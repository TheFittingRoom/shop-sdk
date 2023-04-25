// import { InitFirebase, ModalManager, Shop, SignInModal, ForgotPasswordModal, ScanCodeModal, NoAvatarModal, LoadingAvatarModal, LoggedOutModal, ErrorModal, types, L } from "@thefittingroom/ui";
import { InitFirebase } from "./auth/Firebase";
import * as modals from "./components";
import { InitShop } from "./api/Shop";
import { L, InitLocale } from "./api/Locale";
import * as types from "./types";

import { UIError } from "./api/UIError";

interface FittingRoom {
	user: types.FirebaseUser;
	shop: types.Shop;
	firebase: types.FirebaseInstance;
	manager: modals.ModalManager;
	onSignout(colorwaySizeAssetSKU: string): () => void;
	onClose(): void;
	onNavBack(): void;
	onTryOn(colorwaySizeAssetSKU: string): void;
	afterSignIn(user: types.FirebaseUser, colorwaySizeAssetSKU: string): void;
	onSignIn(colorwaySizeAssetSKU: string): (username: string, password: string, validation: (message: string) => void) => void;
	onNavSignIn(colorwaySizeAssetSKU: string): (email: string) => void;
	onPasswordReset(colorwaySizeAssetSKU: string): (email: string) => void;
	onNavForgotPassword(colorwaySizeAssetSKU: string): (email: string) => void;
	onNavScanCode(): void;
	TryOn(colorwaySizeAssetSKU: string, framesCallback: (frames: types.TryOnFrames | Error) => void): void;
}

const InitFittingRoom = (shopID: number, modalDivID: string): FittingRoom => {
	InitLocale().catch((error) => {
		console.error(error);
	});

	let fittingRoom: FittingRoom = {
		user: undefined,
		shop: undefined,
		firebase: InitFirebase(),
		manager: modals.InitModalManager(modalDivID),

		onSignout(colorwaySizeAssetSKU: string) {
			console.log("onSignout", colorwaySizeAssetSKU);
			return () => {
				this.manager.Open(modals.LoggedOutModal({
					onNavSignIn: this.onNavSignIn(colorwaySizeAssetSKU),
					onClose: this.onClose.bind(this)
				}));
			};
		},


		// requires binding to modal (.bind(this))
		onClose() {
			this.manager.Close();
		},

		onNavBack() {
			window.history.back();
		},

		onTryOn(colorwaySizeAssetSKU: string) {
			console.log("try on", colorwaySizeAssetSKU);
			if (!colorwaySizeAssetSKU) {
				// this happens when the user logs out and logs back in
				// the user needs to click the try on button again
				console.error("No colorway SKU provided, skipping try on");
				return;
			}

			this.shop.TryOn(colorwaySizeAssetSKU)
				.then(framesOrFunc => {
					console.log("frames or promise", framesOrFunc)
					if (framesOrFunc instanceof Function) {
						console.log("recieved promise from tryon");
						this.manager.Open(modals.LoadingAvatarModal({}));
						return new Promise((res, rej)  => framesOrFunc(res, rej));
					}
					return framesOrFunc;
				}).then((frames: types.TryOnFrames) => {
					this.manager.Close();
					this.framesCallback(frames);
				}).catch((error: Error | types.RecommendedAvailableSizes) => {
					const recommendedSizeError = error as types.RecommendedAvailableSizes;
					if (!recommendedSizeError.recommended_size ||
						!recommendedSizeError.available_sizes ||
						!recommendedSizeError.available_sizes.length) {
						console.error("unknown error", error);
						this.manager.Open(modals.ErrorModal({
							error: L.SomethingWentWrong,
							onClose: this.onClose.bind(this),
							onNavBack: this.onNavBack
						}));
						this.framesCallback(error);
						return;
					}

					this.manager.Open(modals.SizeErrorModal({
						sizes: {
							recommended: recommendedSizeError.recommended_size,
							available: recommendedSizeError.available_sizes
						},
						onClose: this.onClose.bind(this),
						onNavBack: this.onNavBack
					}));
					this.framesCallback(error);
				});
		},

		afterSignIn(user: types.FirebaseUser, colorwaySizeAssetSKU: string) {
			console.log('afterSignIn', colorwaySizeAssetSKU);
			this.shop = InitShop(user, shopID);
			user.GetUserProfile().then((profile) => {
				switch (profile.avatar_status) {
					case types.AvatarState.NOT_CREATED:
						console.log("avatar not created");
						this.manager.Open(modals.NoAvatarModal({
							onClose: this.onClose.bind(this),
							onNavBack: this.onNavBack,
						}));
						break;
					case types.AvatarState.PENDING:
						console.log("avatar pending");
						this.manager.Open(modals.LoadingAvatarModal({}));
						this.shop.AwaitAvatarCreated().then(() => {
							this.onTryOn(colorwaySizeAssetSKU);
						}).catch((error: UIError) => {
							this.manager.Open(modals.ErrorModal({
								error: error.userMessage,
								onClose: this.onClose.bind(this),
								onNavBack: this.onNavBack
							}));
						});
						break;
					case types.AvatarState.CREATED:
						console.log("avatar created");
						this.onTryOn(colorwaySizeAssetSKU);
						break;
					default:
						console.error("profile.avatar_status is invalid", profile);
						this.manager.Open(modals.ErrorModal({
							error: "todo: something went wrong",
							onClose: this.onClose,
							onNavBack: this.onNavBack
						}));
				}
			}).catch((error: UIError) => {
				console.error('catch uierror', error);
				this.manager.Open(modals.ErrorModal({
					error: error.userMessage,
					onClose: this.onClose.bind(this),
					onNavBack: this.onNavBack
				}));
			});
		},

		onSignIn(colorwaySizeAssetSKU: string) {
			return (username, password, validationError: (message: string) => void) => {
				if (username.length == 0 || password.length == 0) {
					validationError(L.UsernameOrPasswordEmpty);
					return;
				}
				this.firebase.Login(username, password, this.onSignout(colorwaySizeAssetSKU)).then((u) => {
					this.user = u;
					this.afterSignIn(this.user, colorwaySizeAssetSKU);
					this.manager.Close();
				}).catch((error: UIError) => {
					validationError(error.userMessage);
				});
			};
		},

		onNavSignIn(colorwaySizeAssetSKU: string) {
			console.log('onNavSignIn', colorwaySizeAssetSKU);
			return (email: string) => {
				this.manager.Open(modals.SignInModal({
					email,
					onSignIn: this.onSignIn(colorwaySizeAssetSKU),
					onNavForgotPassword: this.onNavForgotPassword(colorwaySizeAssetSKU),
					onNavScanCode: this.onNavScanCode.bind(this)
				}));
			};
		},

		onPasswordReset(colorwaySizeAssetSKU: string) {
			return (email: string) => {
				this.firebase.SendPasswordResetEmail(email).then(() => {
					this.manager.Open(modals.ResetLinkModal({
						onNavSignIn: this.onNavSignIn(colorwaySizeAssetSKU),
					}));
				}).catch((error: UIError) => {
					this.manager.Open(modals.ErrorModal({
						error: error.userMessage,
						onClose: this.onClose.bind(this),
						onNavBack: this.onNavBack
					}));
				});
			};
		},

		onNavForgotPassword(colorwaySizeAssetSKU: string): (email: string) => void {
			return (email: string) => {
				this.manager.Open(modals.ForgotPasswordModal({
					email,
					onNavSignIn: this.onNavSignIn(colorwaySizeAssetSKU),
					onPasswordReset: this.onPasswordReset(colorwaySizeAssetSKU)
				}));
			};
		},

		// requires binding to modal (.bind(this))
		onNavScanCode(): void {
			this.manager.Open(modals.ScanCodeModal({}));
		},

		TryOn(colorwaySizeAssetSKU: string, callback: (frames: types.TryOnFrames | Error) => void) {
			console.log('TryOn', colorwaySizeAssetSKU);
			this.framesCallback = callback;
			try {
				if (this.user) {
					this.afterSignIn(this.user, colorwaySizeAssetSKU);
					return;
				}
				this.firebase.User(this.onSignout(colorwaySizeAssetSKU)).then((u) => {
					this.user = u;
					this.afterSignIn(this.user, colorwaySizeAssetSKU);
				}).catch((error) => {
					if (error == types.NotLoggedIn) {
						console.info("user not logged in");
						this.manager.Open(modals.SignInModal({
							email: "",
							onSignIn: this.onSignIn(colorwaySizeAssetSKU),
							onNavForgotPassword: this.onNavForgotPassword(colorwaySizeAssetSKU),
							onNavScanCode: this.onNavScanCode.bind(this)
						}));
						callback(error);
					} else {
						console.error("error retrieving firebase user", error);
						this.manager.Open(modals.ErrorModal({
							error: L.SomethingWentWrong,
							onClose: this.onClose.bind(this),
							onNavBack: this.onNavBack
						}));
						callback(error);
					}
				});
			} catch (e) {
				if (e.message == types.NotLoggedIn) {
					this.manager.Open(modals.SignInModal({
						email: "",
						onSignIn: this.onSignIn(colorwaySizeAssetSKU),
						onNavForgotPassword: this.onNavForgotPassword(colorwaySizeAssetSKU),
						onNavScanCode: this.onNavScanCode.bind(this)
					}));
				} else {
					this.manager.Open(modals.ErrorModal({
						error: L.SomethingWentWrong,
						onClose: this.onClose.bind(this),
						onNavBack: this.onNavBack
					}));
				}
				callback(e);
			}
		}
	};

	fittingRoom.firebase.User(fittingRoom.onSignout(null)).then((u) => {
		fittingRoom.user = u;
	}).catch((error) => {
		if (error == types.NotLoggedIn) {
			console.info("user not logged in");
		}
	});

	return fittingRoom;
};

export { FittingRoom, InitFittingRoom };
