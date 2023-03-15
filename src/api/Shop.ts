import { UserProfile } from "firebase/auth";
import { FriendlyError } from "../auth/errors";
import { AvatarNotCreated, AvatarNotReady, ErrorResponse } from "../api/errors";
import { TryOnFrames } from "../types";
import { FirebaseUser } from "../auth/FirebaseUser";
import { Fetcher } from "./Fetcher";
import { SizeRecommendation } from "../api/responses";
import { collection, query, where, getDocs, DocumentData, DocumentSnapshot, documentId, onSnapshot } from "firebase/firestore";
import {Firebase} from "../auth/Firebase";

function IsImgValid(url: string) {
	const img = new Image();
	img.src = url;

	return new Promise((resolve) => {
		img.onerror = () => resolve(false);
		img.onload = () => resolve(true);
	});
}


class Shop {
	private BrandID: string;

	static NoFramesFound = new Error('No frames found for this colorway');

	constructor(brandID: string) {
		this.BrandID = brandID;
	}

	async RequestColorwayFrames(colorwayID: number): Promise<void> {
		return new Promise((resolve, reject) => {
			Fetcher.Post(`/colorways/${colorwayID}/frames`, null).then(() => {
				resolve();
			}).catch((error: ErrorResponse) => {
				switch (error.error) {
					case AvatarNotCreated:
						reject(new FriendlyError("You have not creatd an avatar", error.error));
						break
					case AvatarNotReady:
						reject(new FriendlyError("Your avatar is not ready yet", error.error));
						break
					default:
						reject(new FriendlyError("There was an error when trying on clothing", error.error));
				}
			})
		})
	}

	async AwaitColorwayFrames(colorwaySKU: string): Promise<TryOnFrames> {
			return new Promise((resolve, reject) => {
				window.setTimeout(()=>{
					unsubscribe();
					reject(new Error("timed out waiting for frames"));
				}, 60 * 1000);
				const q = query(collection(Firebase.Firestore, "users"), where(documentId(), "==", FirebaseUser.ID()));
				const unsubscribe = onSnapshot(q, (snapshot) => {
						this.GetColorwayFrames(colorwaySKU).then((frames) => {
							unsubscribe();
							resolve(frames);
						}).catch((error) => {
							if (error === Shop.NoFramesFound) {
								// we caught an event that was not a vto event
								return;
							} else {
								unsubscribe();
								reject(error);
							}
						})
					});
			});
	}

	async GetStyles(): Promise<object[]> {
		return new Promise((resolve, reject) => {
			FirebaseUser.EnsureLogin()
			const q = query(collection(Firebase.Firestore, "styles"), where("brand_id", "==", this.BrandID));
			getDocs(q).then((querySnapshot) => {
				const styles: any = [];
				querySnapshot.forEach((doc) => {
					styles.push(doc.data());
				});
				resolve(styles);
			}).catch((error) => {
				reject(error);
			})
		})
	}

	LookupColorwayBySKU(colorwaySKU: string, styles: any[]): any | undefined {
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
	}

	async GetColorwayFrames(colorwaySKU: string): Promise<TryOnFrames> {
		return new Promise((resolve, reject) =>  {
			FirebaseUser.GetUserProfile().then((profile: UserProfile) => {
				const frames = profile?.vto?.[this.BrandID]?.[colorwaySKU]?.frames || [];
				if (frames.length > 0 && IsImgValid(frames[0])) {
					resolve(frames as TryOnFrames);
				}
				reject(Shop.NoFramesFound);
			}).catch((error) => {
				reject(error);
			})
		})
	}

	async GetRecommendedSizes(BrandStyleID: string): Promise<SizeRecommendation | ErrorResponse> {
		return new Promise((resolve, reject) => {
			Fetcher.Get(`/styles/${BrandStyleID}/recommendation`, null).then((data) => {
				resolve(data as SizeRecommendation);
			}).catch((error: ErrorResponse) => {
				switch (error.error) {
					case AvatarNotCreated:
						reject(new FriendlyError("You have not created an avatar", error.error));
						break
					case AvatarNotReady:
						reject(new FriendlyError("Your avatar is not ready yet", error.error));
						break
					default:
						reject(new FriendlyError("There was an error when trying on clothing", error.error));
				}
			})
		})
	}

	async TryOn(ColorwaySKU: string): Promise<TryOnFrames> {
		return new Promise((resolve, reject) => {
			this.GetStyles().then((styles) => {
				const colorway = this.LookupColorwayBySKU(ColorwaySKU, styles);
				if (colorway) {
					this.GetColorwayFrames(colorway.id).then((frames) => {
						resolve(frames);
					}).catch((error) => {
						if (error == Shop.NoFramesFound) {
							this.RequestColorwayFrames(colorway.id).then(() => {
								// listen for changes in firebase

							}).catch((error) => {
								reject(error);
							})
						} else {
							reject(error);
						}
					})
				} else {
					reject(new Error("No colorway found"));
				}
			}).catch((error) => {
				reject(error);
			})
		})
	}
}

