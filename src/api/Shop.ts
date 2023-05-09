import { UserProfile } from "firebase/auth";
import { UIError } from "./UIError";
import { AvatarNotCreated, AvatarNotReady, ErrorResponse, SizeIDOutsideRecommendedRange, ErrorOutsideRecommendedSizes } from "./errors";
import { Fetcher } from "./Fetcher";
import { SizeRecommendation } from "../api/responses";
import { collection, query, where, getDocs, documentId, onSnapshot, QueryFieldFilterConstraint } from "firebase/firestore";
import { GetFirebaseUIError } from "../auth/Firebase";
import { L } from "./Locale";
import { createUIError } from "./UIError";
import * as types from "../types";


function TestImage(url: string): Promise<void> {
	const img = new Image();
	img.src = url;

	return new Promise((resolve, reject) => {
		img.onerror = () => reject();
		img.onload = () => resolve();
	});
}

const InitShop = (user: types.FirebaseUser, id: number): types.Shop => {
	const brandID = id;

	const AwaitAvatarCreated = async (): Promise<void> => {
		return new Promise((resolve, reject) => {
			if (user.notLoggedIn(reject)) return;
			const cancel = window.setTimeout(() => {
				unsubscribe();
				reject(createUIError(L.SomethingWentWrong, new Error("timed out waiting for avatar creation")));
			}, parseInt(process.env.AVATAR_TIMEOUT_MS));
			const q = query(collection(user.FirebaseInstance.Firestore, "users"), where(documentId(), "==", user.ID()));
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

	const User = () => {
		return user;
	};

	const AwaitColorwaySizeAssetFrames = async (colorwaySizeAssetSKU: string): Promise<types.TryOnFrames> => {
		return new Promise((resolve, reject) => {
			if (user.notLoggedIn(reject)) return;
			window.setTimeout(() => {
				unsubscribe();
				reject(createUIError(L.SomethingWentWrong, new Error("timed out waiting for frames")));
			}, parseInt(process.env.VTO_TIMEOUT_MS));
			const q = query(collection(user.FirebaseInstance.Firestore, "users"), where(documentId(), "==", user.ID()));
			const unsubscribe = onSnapshot(q, (snapshot) => {
				console.log("snapshot retrieved", snapshot);
				//TODO: make this more effecient by using the snapshot response
				GetColorwaySizeAssetFrames(colorwaySizeAssetSKU).then((frames) => {
					unsubscribe();
					resolve(frames);
				}).catch((error) => {
					if (error === types.NoFramesFound) {
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

	const GetRecommendedSizes = async (BrandStyleID: string): Promise<SizeRecommendation | ErrorResponse> => {
		return new Promise((resolve, reject) => {
			if (user.notLoggedIn(reject)) return;
			Fetcher.Get(user, `/styles/${BrandStyleID}/recommendation`, null).then((r: Response) => {
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

	const GetStyles = async (ids: number[]): Promise<Map<number, types.FirestoreStyle>> => {
		return new Promise((resolve, reject) => {
			if (user.notLoggedIn(reject)) return;
			const constraints: QueryFieldFilterConstraint[] = [where("brand_id", "==", brandID)];
			if (ids?.length > 0) {
				constraints.push(where("id", "in", ids));
			}
			const q = query(collection(user.FirebaseInstance.Firestore, "styles"), ...constraints);
			getDocs(q).then((querySnapshot) => {
				const styles: Map<number, types.FirestoreStyle> = new Map();
				querySnapshot.forEach((doc) => {
					const FirestoreStyle = doc.data() as types.FirestoreStyle;
					styles.set(FirestoreStyle.id, FirestoreStyle);
				});
				console.log("resolving styles", styles);
				resolve(styles);
			}).catch((error) => {
				reject(GetFirebaseUIError(error));
			});
		});
	};

	const GetColorwaySizeAssets = async (style_id?: number, skus?: string[]): Promise<Map<number, types.FirestoreColorwaySizeAsset>> => {
		return new Promise((resolve, reject) => {
			if (user.notLoggedIn(reject)) return;
			const constraints: QueryFieldFilterConstraint[] = [where("brand_id", "==", brandID)];
			if (style_id) {
				constraints.push(where("style_id", "==", style_id));
			}
			if (skus?.length > 0) {
				constraints.push(where("sku", "in", skus));
			}
			const q = query(collection(user.FirebaseInstance.Firestore, "colorway_size_assets"), ...constraints);
			getDocs(q).then((querySnapshot) => {
				const colorwaySizeAssets: Map<number, types.FirestoreColorwaySizeAsset> = new Map();
				querySnapshot.forEach((doc) => {
					const colorwaySizeAsset = doc.data() as types.FirestoreColorwaySizeAsset;
					colorwaySizeAssets.set(colorwaySizeAsset.id, colorwaySizeAsset);
				});
				resolve(colorwaySizeAssets);
			}).catch((error) => {
				reject(GetFirebaseUIError(error));
			});
		});
	};

	const GetColorwaySizeAssetFrames = async (colorwaySizeAssetSKU: string): Promise<types.TryOnFrames> => {
		return new Promise((resolve, reject) => {
			if (user.notLoggedIn(reject)) return;
			user.GetUserProfile().then((profile: UserProfile) => {
				const frames = profile?.vto?.[brandID]?.[colorwaySizeAssetSKU]?.frames || [];
				if (frames.length > 0 && TestImage(frames[0])) {
					resolve(frames as types.TryOnFrames);
				} else {
					reject(types.NoFramesFound);
				}
			}).catch((error: UIError) => {
				reject(error);
			});
		});
	};


	const RequestColorwaySizeAssetFrames = async (colorwaySizeAssetID: number): Promise<void> => {
		console.log("requesting colorway frames", colorwaySizeAssetID);
		return new Promise((resolve, reject) => {
			if (user.notLoggedIn(reject)) return;
			Fetcher.Post(user, `/colorway-size-assets/${colorwaySizeAssetID}/frames`, null).then(() => {
				resolve();
			}).catch((error: ErrorResponse | ErrorOutsideRecommendedSizes) => {
				switch (error.error) {
					case AvatarNotCreated:
						reject(createUIError(L.DontHaveAvatar, new Error(error.error)));
						break;
					case AvatarNotReady:
						reject(new Error(error.error));
						break;
					case SizeIDOutsideRecommendedRange:
						reject(error);
						break;
					default:
						reject(error);
				}
			});
		});
	};

	const TryOn = (colorwaySizeAssetSKU: string): Promise<types.TryOnFrames | (() => Promise<types.TryOnFrames>)> => {
		let styleIDCache: number;
		return new Promise((resolve, reject) => {
			if (user.notLoggedIn(reject)) return;
			GetColorwaySizeAssetFrames(colorwaySizeAssetSKU).then((frames) => {
				console.log("frames are ready instantly");
				resolve(frames as types.TryOnFrames);
			}).catch((error: Error) => {
				if (error != types.NoFramesFound) {
					console.error("error is not NoFramesFound", error);
					reject(error);
					return;
				}
				console.log('resolving with promise instead of frames');
				// TODO: come up with solution than inner promise func call
				resolve(() => new Promise((resolve, reject) => {
					// lookup current sku to get style_id
					GetColorwaySizeAssets(null, [colorwaySizeAssetSKU])
						.then((colorwaySizeAssets: Map<number, types.FirestoreColorwaySizeAsset>) => {
							if (!colorwaySizeAssets?.size) {
								console.error("no colorway size assets found");
								return reject(types.NoColorwaySizeAssetsFound);
							}
							const colorwaySizeAsset = colorwaySizeAssets.values().next().value;
							styleIDCache = colorwaySizeAsset.style_id;
							return RequestColorwaySizeAssetFrames(colorwaySizeAsset.id);
						}).then(() => {
							// listen for changes in firebase
							return AwaitColorwaySizeAssetFrames(colorwaySizeAssetSKU);
						}).then((frames) => {
							resolve(frames);
						}).catch((error: Error | ErrorOutsideRecommendedSizes) => {
							console.error("error requesting colorway frames", error);
							if (!(error as ErrorOutsideRecommendedSizes).recommended_size_id) {
								reject(error);
								return;
							}

							GetStyles([styleIDCache]).then((styles: Map<number, types.FirestoreStyle>) => {
								const errorOutsideRecommended = error as ErrorOutsideRecommendedSizes;
								const recommendedSizeResponse: types.RecommendedAvailableSizes = {
									error: errorOutsideRecommended.error,
									recommended_size: null,
									available_sizes: [],
								};

								const style = styles.get(styleIDCache);

								if (!style.sizes) {
									console.error("no style or sizes found");
									return reject(types.NoStylesFound);
								}

								recommendedSizeResponse.recommended_size = style.sizes[errorOutsideRecommended.recommended_size_id]?.label || style.sizes[errorOutsideRecommended.recommended_size_id]?.size;
								for (const available_size_id of errorOutsideRecommended.available_size_ids) {
									if (style.sizes[available_size_id] && style.sizes[available_size_id].size != recommendedSizeResponse.recommended_size) {
										recommendedSizeResponse.available_sizes.push(style.sizes[available_size_id].label || style.sizes[available_size_id]?.size);
									}
								}

								return reject(recommendedSizeResponse);
							}).catch((error: Error | types.RecommendedAvailableSizes) => {
								console.error("error requesting colorway frames", error);
								reject(error);
							});
						});
				}));
			});
		});
	};

	return {
		User,
		AwaitAvatarCreated,
		GetStyles,
		GetColorwaySizeAssets,
		AwaitColorwaySizeAssetFrames,
		GetColorwaySizeAssetFrames,
		TryOn,
		GetRecommendedSizes,
		RequestColorwaySizeAssetFrames,
	};
};

export { InitShop, TestImage };

