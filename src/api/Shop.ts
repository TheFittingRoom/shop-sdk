import { UserProfile } from "firebase/auth";
import { FriendlyError } from "./FriendlyError";
import { AvatarNotCreated, AvatarNotReady, ErrorResponse, SizeIDOutsideRecommendedRange, ErrorOutsideRecommendedSizes } from "./errors";
import { TryOnFrames } from "../types";
import { FirebaseUser } from "../auth/FirebaseUser";
import { Fetcher } from "./Fetcher";
import { SizeRecommendation } from "../api/responses";
import { collection, query, where, getDocs, documentId, onSnapshot } from "firebase/firestore";
import { Firebase } from "../auth/Firebase";
import { L } from "./Locale";
import { User } from "./requests";
import { UserID } from "./responses";


function IsImgValid(url: string) {
	const img = new Image();
	img.src = url;

	return new Promise((resolve) => {
		img.onerror = () => resolve(false);
		img.onload = () => resolve(true);
	});
}


class Shop {
	private brandID: number;
	private user: FirebaseUser;
	static NoFramesFound = new Error('No frames found for this colorway');

	constructor(brandID: number) {
		Firebase.Init(
			process.env.FIREBASE_API_KEY,
			process.env.FIREBASE_AUTH_DOMAIN,
			process.env.FIREBASE_PROJECT_ID,
			process.env.FIREBASE_STORAGE_BUCKET,
			process.env.FIREBASE_MESSAGING_SENDER_ID,
			process.env.FIREBASE_APP_ID,
		);

		this.brandID = brandID;
	}

	User(): FirebaseUser {
		if (!this.user) {
			throw FirebaseUser.NotLoggedIn;
		}
		return this.user;
	}

	/**
 * Finishes the account creation process for the user
 * @param {User} user - the user information to create the profile with
 * @returns {Promise<UserID | ErrorResponse | Error>} - the user ID of the user if successful, an APIError or javascript Error if not.
 * @throws {FirebaseUser.NotLoggedIn} - if the user is not logged in.
 */
	async SignUp(user: User): Promise<UserID | ErrorResponse | Error> {
		return new Promise((resolve, reject) => {
			Fetcher.Get(this.User(), `/user/${this.User().ID()}`, user)
				.then((response: UserID) => {
					resolve(response);
				}).catch((error) => {
					if (error instanceof Error) {
						reject(new FriendlyError("There was an error when trying to create your account", error.message));
					}
					if (error as ErrorResponse) {
						reject(reject(new FriendlyError("There was an error when trying to create your account", error.error)));
					}
					reject(error);
				});
		});
	}

	async SendPasswordResetEmail(email: string): Promise<void> {
		return FirebaseUser.SendPasswordResetEmail(email);
	}

	async Login(username, password: string, onLogout: () => any): Promise<void> {
		return new Promise((resolve, reject) => {
			FirebaseUser.Login(username, password, onLogout).then((user) => {
				this.user = user;
				resolve();
			}).catch((error) => {
				reject(error)
			});
		});
	}

	async RequestColorwayFrames(colorwayID: number): Promise<void> {
		return new Promise((resolve, reject) => {
			Fetcher.Post(this.User(),`/colorways/${colorwayID}/frames`, null).then(() => {
				resolve();
			}).catch((error: ErrorResponse | ErrorOutsideRecommendedSizes) => {
				switch (error.error) {
					case AvatarNotCreated:
						reject(new FriendlyError(L.DontHaveAvatar, error.error));
						break;
					case AvatarNotReady:
						reject(new FriendlyError(L.LoadingAvatar, error.error));
						break;
					case SizeIDOutsideRecommendedRange:
						reject(error);
						break;
					default:
						reject(new FriendlyError(L.SomethingWentWrong, error.error));
				}
			});
		});
	}

	async AwaitColorwayFrames(colorwaySKU: string): Promise<TryOnFrames> {
		return new Promise((resolve, reject) => {
			window.setTimeout(() => {
				unsubscribe();
				reject(new FriendlyError(L.SomethingWentWrong, "timed out waiting for frames"));
			}, 60 * 1000);
			const q = query(collection(Firebase.Firestore, "users"), where(documentId(), "==", this.User().ID()));
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
						reject(new FriendlyError(L.SomethingWentWrong, error.message));
					}
				});
			});
		});
	}

	async GetStyles(): Promise<object[]> {
		return new Promise((resolve, reject) => {
			this.User().EnsureLogin();
			const q = query(collection(Firebase.Firestore, "styles"), where("brand_id", "==", this.brandID));
			getDocs(q).then((querySnapshot) => {
				const styles: any = [];
				querySnapshot.forEach((doc) => {
					styles.push(doc.data());
				});
				resolve(styles);
			}).catch((error) => {
				reject(error);
			});
		});
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
		return new Promise((resolve, reject) => {
			this.User().GetUserProfile().then((profile: UserProfile) => {
				const frames = profile?.vto?.[this.brandID]?.[colorwaySKU]?.frames || [];
				if (frames.length > 0 && IsImgValid(frames[0])) {
					resolve(frames as TryOnFrames);
				}
				reject(Shop.NoFramesFound);
			}).catch((error) => {
				reject(error);
			});
		});
	}

	async GetRecommendedSizes(BrandStyleID: string): Promise<SizeRecommendation | ErrorResponse> {
		return new Promise((resolve, reject) => {
			Fetcher.Get(this.User(), `/styles/${BrandStyleID}/recommendation`, null).then((data) => {
				resolve(data as SizeRecommendation);
			}).catch((error: ErrorResponse) => {
				switch (error.error) {
					case AvatarNotCreated:
						reject(new FriendlyError(L.DontHaveAvatar, error.error));
						break;
					case AvatarNotReady:
						reject(new FriendlyError(L.LoadingAvatar, error.error));
						break;
					default:
						reject(new FriendlyError(L.SomethingWentWrong, error.error));
				}
			});
		});
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
								return this.AwaitColorwayFrames(ColorwaySKU);
							}).catch((error) => {
								reject(error);
							});
						}
						reject(error);
					});
				} else {
					reject(new FriendlyError(L.SomethingWentWrong, "No colorway found"));
				}
			}).catch((error) => {
				reject(error);
			});
		});
	}
}

export { Shop, IsImgValid };

