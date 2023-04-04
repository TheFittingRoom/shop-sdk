import { UserProfile } from "firebase/auth";
import { UIError } from "./UIError";
import { AvatarNotCreated, AvatarNotReady, ErrorResponse, SizeIDOutsideRecommendedRange, ErrorOutsideRecommendedSizes } from "./errors";
import { TryOnFrames } from "../types";
import { Fetcher } from "./Fetcher";
import { SizeRecommendation } from "../api/responses";
import { collection, query, where, getDocs, documentId, onSnapshot } from "firebase/firestore";
import { InitFirebase, NotLoggedIn, FirebaseUser } from "../auth/Firebase";

import { L } from "./Locale";
import { User } from "./requests";
import { createUIError } from "./UIError";


function TestImage(url: string): Promise<boolean> {
	const img = new Image();
	img.src = url;

	return new Promise((resolve) => {
		img.onerror = () => resolve(false);
		img.onload = () => resolve(true);
	});
}

const Shop = (u: FirebaseUser, id: number) => {
	let firebaseUser = u;
	let brandID = id;

	const NoFramesFound = new Error('No frames found for this colorway');

	const User = (): FirebaseUser => {
		firebaseUser.EnsureLogin();
		return firebaseUser;
	};

	const AwaitAvatarCreated = async (): Promise<void> => {
		return new Promise((resolve, reject) => {
			window.setTimeout(() => {
				unsubscribe();
				reject(createUIError(L.SomethingWentWrong, new Error("timed out waiting for avatar creation")));
			}, 60 * 1000);
			const q = query(collection(User().FirebaseInstance.Firestore, "users"), where(documentId(), "==", User().ID()));
			const unsubscribe = onSnapshot(q, (snapshot) => {
				const userProfile = snapshot.docs[0].data();
				if (userProfile.avatar_status === 'CREATED') {
					unsubscribe();
					resolve();
				}
				return;
			});
		});
	};

	const AwaitColorwayFrames = async (colorwaySKU: string): Promise<TryOnFrames> => {

		return new Promise((resolve, reject) => {
			resolve([
				"https://assets.dev.thefittingroom.xyz/user-H0xIgzZKNIdQ21xQwL8V7Nywtet2/avatar-9/frames/image_0.png",
				"https://assets.dev.thefittingroom.xyz/user-H0xIgzZKNIdQ21xQwL8V7Nywtet2/avatar-9/frames/image_1.png",
				"https://assets.dev.thefittingroom.xyz/user-H0xIgzZKNIdQ21xQwL8V7Nywtet2/avatar-9/frames/image_2.png",
				"https://assets.dev.thefittingroom.xyz/user-H0xIgzZKNIdQ21xQwL8V7Nywtet2/avatar-9/frames/image_3.png",
				"https://assets.dev.thefittingroom.xyz/user-H0xIgzZKNIdQ21xQwL8V7Nywtet2/avatar-9/frames/image_4.png",
				"https://assets.dev.thefittingroom.xyz/user-H0xIgzZKNIdQ21xQwL8V7Nywtet2/avatar-9/frames/image_5.png",
				"https://assets.dev.thefittingroom.xyz/user-H0xIgzZKNIdQ21xQwL8V7Nywtet2/avatar-9/frames/image_6.png",
				"https://assets.dev.thefittingroom.xyz/user-H0xIgzZKNIdQ21xQwL8V7Nywtet2/avatar-9/frames/image_7.png",
			]);
			/* 			window.setTimeout(() => {
							unsubscribe();
							reject(createUIError(L.SomethingWentWrong, new Error("timed out waiting for frames")));
						}, 60 * 1000);
						const q = query(collection(User().FirebaseInstance.Firestore, "users"), where(documentId(), "==", User().ID()));
						const unsubscribe = onSnapshot(q, (snapshot) => {
							console.log("shapshop retrieved", snapshot)
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
						}); */
		});
	};



	const LookupColorwayBySKU = (colorwaySKU: string, styles: any[]): any | undefined => {
		for (const style of styles) {
			for (const size of style.sizes) {
				for (const colorway of size.colorways) {
					if (colorway.sku === colorwaySKU) {
						return colorway;
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

	const GetStyles = async (): Promise<object[]> => {
		return new Promise((resolve, reject) => {
			const q = query(collection(User().FirebaseInstance.Firestore, "styles"), where("brand_id", "==", brandID));
			getDocs(q).then((querySnapshot) => {
				const styles: any = [];
				querySnapshot.forEach((doc) => {
					styles.push(doc.data());
				});
				resolve(styles);
			}).catch((error) => {
				reject(createUIError(L.SomethingWentWrong,));
			});
		});
	};

	const GetColorwayFrames = async (colorwaySKU: string): Promise<TryOnFrames> => {
		return new Promise((resolve, reject) => {
			resolve([
				"https://assets.dev.thefittingroom.xyz/user-H0xIgzZKNIdQ21xQwL8V7Nywtet2/avatar-9/frames/image_0.png",
				"https://assets.dev.thefittingroom.xyz/user-H0xIgzZKNIdQ21xQwL8V7Nywtet2/avatar-9/frames/image_1.png",
				"https://assets.dev.thefittingroom.xyz/user-H0xIgzZKNIdQ21xQwL8V7Nywtet2/avatar-9/frames/image_2.png",
				"https://assets.dev.thefittingroom.xyz/user-H0xIgzZKNIdQ21xQwL8V7Nywtet2/avatar-9/frames/image_3.png",
				"https://assets.dev.thefittingroom.xyz/user-H0xIgzZKNIdQ21xQwL8V7Nywtet2/avatar-9/frames/image_4.png",
				"https://assets.dev.thefittingroom.xyz/user-H0xIgzZKNIdQ21xQwL8V7Nywtet2/avatar-9/frames/image_5.png",
				"https://assets.dev.thefittingroom.xyz/user-H0xIgzZKNIdQ21xQwL8V7Nywtet2/avatar-9/frames/image_6.png",
				"https://assets.dev.thefittingroom.xyz/user-H0xIgzZKNIdQ21xQwL8V7Nywtet2/avatar-9/frames/image_7.png",
			]
/* 			User().GetUserProfile().then((profile: UserProfile) => {
				const frames = profile?.vto?.[brandID]?.[colorwaySKU]?.frames || [];
				if (frames.length > 0 && TestImage(frames[0])) {
					resolve(frames as TryOnFrames);
				}
				reject(NoFramesFound);
			}).catch((error: UIError) => {
				reject(error);
			}); */
		});
	};

	const RequestColorwayFrames = async (colorwayID: number): Promise<void> => {
		return new Promise((resolve, reject) => {
			Fetcher.Post(User(), `/colorway-size-assets/${colorwayID}/frames`, null).then(() => {
				resolve();
			}).catch((error: ErrorResponse | ErrorOutsideRecommendedSizes) => {
				switch (error.error) {
					case AvatarNotCreated:
						reject(createUIError(L.DontHaveAvatar, new Error(error.error)));
						break;
					case AvatarNotReady:
						reject(createUIError(L.LoadingAvatar, new Error(error.error)));
						break;
					case SizeIDOutsideRecommendedRange:
						reject(error);
						break;
					default:
						if (error instanceof Error) {
							reject(createUIError(L.SomethingWentWrong, error));
						} else {
							reject(createUIError(L.SomethingWentWrong, new Error(error.error)));
						}
				}
			});
		});
	};

	const TryOn = async (ColorwaySKU: string): Promise<TryOnFrames> => {
		return new Promise((resolve, reject) => {
			GetStyles().then((styles) => {
				console.debug(styles);
				const colorway = LookupColorwayBySKU(ColorwaySKU, styles);
				if (colorway) {
					GetColorwayFrames(colorway.id).then((frames) => {
						resolve(frames);
					}).catch((error) => {
						if (error == NoFramesFound) {
							console.info("requesting new colorway frames");
							RequestColorwayFrames(colorway.id).then(() => {
								// listen for changes in firebase
								console.info("waiting for rendered colorway frames");
								AwaitColorwayFrames(ColorwaySKU).then((frames) => {
									resolve(frames);
								}).catch((error: UIError) => {
									reject(error);
								});
							}).catch((error: UIError) => {
								console.error("error requesting colorway frames", error);
								reject(error);
							});
						} else {
							reject(createUIError(L.SomethingWentWrong, new Error(error)));
						}
					});
				} else {
					reject(createUIError(L.SomethingWentWrong, new Error("No colorway found")));
				}
			}).catch((error) => {
				reject(error);
			});
		});
	};

	return {
		GetStyles,
		GetRecommendedSizes,
		GetColorwayFrames,
		LookupColorwayBySKU,
		AwaitAvatarCreated,
		TryOn,
	};
};

export { Shop, TestImage };

