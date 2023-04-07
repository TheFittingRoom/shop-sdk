import { UserProfile } from "firebase/auth";
import { UIError } from "./UIError";
import { AvatarNotCreated, AvatarNotReady, ErrorResponse, SizeIDOutsideRecommendedRange, ErrorOutsideRecommendedSizes } from "./errors";
import { TryOnFrames, FirebaseStyles } from "../types";
import { Fetcher } from "./Fetcher";
import { SizeRecommendation } from "../api/responses";
import { collection, query, where, getDocs, documentId, onSnapshot } from "firebase/firestore";
import { FirebaseUser, GetFirebaseUIError } from "../auth/Firebase";
import { L } from "./Locale";
import { createUIError } from "./UIError";


function TestImage(url: string): Promise<void> {
	const img = new Image();
	img.src = url;

	return new Promise((resolve, reject) => {
		img.onerror = () => reject();
		img.onload = () => resolve();
	});
}

interface Shop {
	LookupColorwayIDBySKU: (colorwaySKU: string, styles: FirebaseStyles) => number | undefined;
	User: () => FirebaseUser;
	AwaitAvatarCreated: () => Promise<void>;
	AwaitColorwayFrames: (colorwaySKU: string) => Promise<TryOnFrames>;
	GetColorwayFrames: (colorwaySKU: string) => Promise<TryOnFrames>;
	TryOn: (colorwaySKU: string) => Promise<TryOnFrames>;
	GetRecommendedSizes(BrandStyleID: string): Promise<SizeRecommendation | ErrorResponse>;

	GetStyles: () => Promise<FirebaseStyles>;
	RequestColorwayFrames(colorwayID: number): Promise<void>;
}

const NoFramesFound = new Error('No frames found for this colorway');

const InitShop = (u: FirebaseUser, id: number): Shop => {
	let firebaseUser = u;
	let brandID = id;

	const User = (): FirebaseUser => {
		firebaseUser.EnsureLogin();
		return firebaseUser;
	};

	const AwaitAvatarCreated = async (): Promise<void> => {
		return new Promise((resolve, reject) => {
			const cancel = window.setTimeout(() => {
				unsubscribe();
				reject(createUIError(L.SomethingWentWrong, new Error("timed out waiting for avatar creation")));
			}, parseInt(process.env.AVATAR_TIMEOUT_MS));
			const q = query(collection(User().FirebaseInstance.Firestore, "users"), where(documentId(), "==", User().ID()));
			const unsubscribe = onSnapshot(q, (snapshot) => {
				const userProfile = snapshot.docs[0].data();
				console.log('detected event', userProfile.avatar_status);
				if (userProfile.avatar_status === 'CREATED') {
					window.clearTimeout(cancel);
					unsubscribe();
					resolve();
				}
				return;
			});
		});
	};

	const AwaitColorwayFrames = async (colorwaySKU: string): Promise<TryOnFrames> => {
		return new Promise((resolve, reject) => {
			window.setTimeout(() => {
				unsubscribe();
				reject(createUIError(L.SomethingWentWrong, new Error("timed out waiting for frames")));
			}, parseInt(process.env.VTO_TIMEOUT_MS));
			const q = query(collection(User().FirebaseInstance.Firestore, "users"), where(documentId(), "==", User().ID()));
			const unsubscribe = onSnapshot(q, (snapshot) => {
				console.log("snapshot retrieved", snapshot);
				//TODO: make this more effecient by using the snapshot response
				GetColorwayFrames(colorwaySKU).then((frames) => {
					unsubscribe();
					resolve(frames);
				}).catch((error) => {
					if (error === NoFramesFound) {
						// we caught an event that was not a vto event
						return;
					} else {
						unsubscribe();
						reject(createUIError(L.SomethingWentWrong, error));
					}
				});
			});
		});
	};

	const LookupColorwayIDBySKU = (colorwaySKU: string, styles: FirebaseStyles): number | undefined => {
		for (const style of styles.values()) {
			for (const size of style.sizes.values()) {
				for (const colorway_size_asset of size.colorways_size_assets) {
					if (colorway_size_asset.sku === colorwaySKU) {
						console.log(size)
						return colorway_size_asset.id;
					}
				}
			}
		}
		return undefined;
	};

	const GetRecommendedSizes = async (BrandStyleID: string): Promise<SizeRecommendation | ErrorResponse> => {
		return new Promise((resolve, reject) => {
			Fetcher.Get(User(), `/styles/${BrandStyleID}/recommendation`, null).then((r: Response) => {
				r.json().then((data) => {
					resolve(data);
				}).catch((error: SyntaxError | ErrorResponse) => {
					if (error instanceof SyntaxError) {
						reject(createUIError(L.SomethingWentWrong, error));
					} else {
						reject(createUIError(L.SomethingWentWrong, new Error(error.error)));
					}
				});
			}).catch((error: ErrorResponse) => {
				switch (error.error) {
					case AvatarNotCreated:
						reject(createUIError(L.DontHaveAvatar, new Error(error.error)));
						break;
					case AvatarNotReady:
						reject(createUIError(L.LoadingAvatar, new Error(error.error)));
						break;
					default:
						reject(createUIError(L.SomethingWentWrong, new Error(error.error)));
				}
			});
		});
	};

	const GetStyles = async (): Promise<FirebaseStyles> => {
		return new Promise((resolve, reject) => {
			const q = query(collection(User().FirebaseInstance.Firestore, "styles"), where("brand_id", "==", brandID));
			getDocs(q).then((querySnapshot) => {
				const styles: any = [];
				querySnapshot.forEach((doc) => {
					styles.push(doc.data());
				});
				resolve(styles);
			}).catch((error) => {
				reject(GetFirebaseUIError(error));
			});
		});
	};

	const GetColorwayFrames = async (colorwaySKU: string): Promise<TryOnFrames> => {
		return new Promise((resolve, reject) => {
			User().GetUserProfile().then((profile: UserProfile) => {
				const frames = profile?.vto?.[brandID]?.[colorwaySKU]?.frames || [];
				if (frames.length > 0 && TestImage(frames[0])) {
					resolve(frames as TryOnFrames);
				} else {
					reject(NoFramesFound);
				}
			}).catch((error: UIError) => {
				reject(error);
			});
		});
	};


	const RequestColorwayFrames = async (colorwaySizeAssetID: number): Promise<void> => {
		console.info("requesting colorway frames", colorwaySizeAssetID)
		return new Promise((resolve, reject) => {
			Fetcher.Post(User(), `/colorway-size-assets/${colorwaySizeAssetID}/frames`, null).then(() => {
				resolve();
			}).catch((error: ErrorResponse | ErrorOutsideRecommendedSizes) => {
				switch (error.error) {
					case AvatarNotCreated:
						reject(createUIError(L.DontHaveAvatar, new Error(error.error)));
						break;
					case AvatarNotReady:
						console.error("RequestColorwayFrames recieved AvatarNotReady");
						reject(createUIError(L.SomethingWentWrong, new Error(error.error)));
						break;
					case SizeIDOutsideRecommendedRange:
						reject(error);
						break;
					default:
						if (error instanceof Error) {
							reject(createUIError(L.SomethingWentWrong, error));
						} else {
							// UIError
							reject(createUIError(L.SomethingWentWrong, new Error(error.error)));
						}
				}
			});
		});
	};

	const TryOn = async (ColorwaySKU: string): Promise<TryOnFrames> => {
		return new Promise((resolve, reject) => {
			GetColorwayFrames(ColorwaySKU).then((frames) => {
				resolve(frames)
			}).catch((error) => {
				if (error == NoFramesFound) {
					GetStyles().then((styles) => {
						const colorwaySizeAssetID = LookupColorwayIDBySKU(ColorwaySKU, styles);
						if (colorwaySizeAssetID) {
							console.info("requesting new colorway frames");
							RequestColorwayFrames(colorwaySizeAssetID).then(() => {
								// listen for changes in firebase
								console.info("waiting for rendered colorway frames");
								AwaitColorwayFrames(ColorwaySKU).then((frames) => {
									resolve(frames);
								}).catch((error: UIError | Error) => {
									reject(error);
								});
							}).catch((error: UIError) => {
								console.error("error requesting colorway frames", error);
								reject(error);
							});
						} else {
							reject(createUIError(L.SomethingWentWrong, new Error("No colorway found")));
						}
					}).catch((error: UIError) => {
						reject(error);
					});
				} else {
					reject(createUIError(L.SomethingWentWrong, new Error(error)));
				}
			});
		});
	};

	return {
		User,
		AwaitAvatarCreated,
		GetStyles,
		AwaitColorwayFrames,
		LookupColorwayIDBySKU: LookupColorwayIDBySKU,
		GetColorwayFrames,
		TryOn,
		GetRecommendedSizes,
		RequestColorwayFrames,
	};
};

export { InitShop, TestImage, Shop };

