// import { InitFirebase, ModalManager, Shop, SignInModal, ForgotPasswordModal, ScanCodeModal, NoAvatarModal, LoadingAvatarModal, LoggedOutModal, ErrorModal, types, L } from "@thefittingroom/ui";
import { InitFirebase } from "./auth/Firebase";
import * as modals from "./components";
import { InitShop } from "./api/Shop";
import { L, InitLocale } from "./api/Locale";
import * as types from "./types";
import { UIError } from "./api/UIError";

const InitFittingRoom = (shopID: number, modalDivID: string): types.FittingRoom => {
	InitLocale().catch((error) => {
		console.error(error);
	});

	let fittingRoom: types.FittingRoom = {
		shop: undefined,
		user: undefined,
		firebase: InitFirebase(),
		manager: modals.InitModalManager(modalDivID),

		onSignout(colorwaySizeAssetSKU: string) {
			return () => {
				this.user.SignOut().then(() => {
					this.manager.Open(modals.LoggedOutModal({
						onNavSignIn: this.onNavSignIn(colorwaySizeAssetSKU),
						onClose: this.onClose.bind(this)
					}));
				}).catch((error: Error) => {
					console.error("failed to logout user", error);
					this.manager.Open(modals.ErrorModal({
						error: L.SomethingWentWrong,
						onClose: this.onClose.bind(this),
						onNavBack: this.onNavBack
					}));
				});
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
					console.log("frames or promise", framesOrFunc);
					if (framesOrFunc instanceof Function) {
						console.log("recieved func wrapped promise from shop tryon");
						this.manager.Open(modals.LoadingAvatarModal({}));
						return framesOrFunc();
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

				whenAvatarNotCreated(colorwaySizeAssetSKU: string) {
			this.manager.Open(modals.NoAvatarModal({
				onClose: this.onClose.bind(this),
				onNavBack: this.onNavBack,
			}));
		},

		whenAvatarPending(colorwaySizeAssetSKU: string) {
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
		},

		whenAvatarCreated(colorwaySizeAssetSKU: string) {
			this.onTryOn(colorwaySizeAssetSKU);
		},

		whenNotSignedIn(colorwaySizeAssetSKU: string) {
			this.manager.Open(modals.SignInModal({
				email: "",
				onSignIn: this.onSignIn(colorwaySizeAssetSKU),
				onNavForgotPassword: this.onNavForgotPassword(colorwaySizeAssetSKU),
				onNavScanCode: this.onNavScanCode.bind(this)
			}));
		},

		whenFramesReady(colorwaySizeAssetSKU: string, frames: types.TryOnFrames) {
			console.warn("whenFramesReady not implemented");
		},

		whenFramesFailed(colorwaySizeAssetSKU: string, error: Error) {
			console.warn("whenFramesFailed not implemented");
		},

		whenError(colorwaySizeAssetSKU: string, error: UIError) {
			this.manager.Open(modals.ErrorModal({
				error: error.userMessage,
				onClose: this.onClose.bind(this),
				onNavBack: this.onNavBack
			}));
		},

		whenSignedIn(user: types.FirebaseUser, colorwaySizeAssetSKU: string) {
			console.log('whenSignedIn', colorwaySizeAssetSKU);
			this.shop = InitShop(user, shopID);
			user.GetUserProfile().then((profile) => {
				switch (profile.avatar_status) {
					case types.AvatarState.NOT_CREATED:
						console.log("avatar not created");
						this.whenAvatarNotCreated(colorwaySizeAssetSKU);
						break;
					case types.AvatarState.PENDING:
						console.log("avatar pending");
						this.whenAvatarPending(colorwaySizeAssetSKU);
						break;
					case types.AvatarState.CREATED:
						console.log("avatar created");
						this.whenAvatarCreated(colorwaySizeAssetSKU);
						break;
					default:
						console.error("profile.avatar_status is invalid", profile);
						this.manager.Open(modals.ErrorModal({
							error: L.SomethingWentWrong,
							onClose: this.onClose,
							onNavBack: this.onNavBack
						}));
				}
			}).catch((error: UIError) => {
				console.error('whenSignIn invalid avatar state', error);
				this.whenError(colorwaySizeAssetSKU, error);
			});
		},


		afterSignIn(user: types.FirebaseUser, colorwaySizeAssetSKU: string) {
			console.log('afterSignIn', colorwaySizeAssetSKU);
			this.user = user;
			this.shop = InitShop(this.user, shopID);
			this.user.GetUserProfile().then((profile) => {
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
						this.whenAvatarCreated(colorwaySizeAssetSKU);
						break;
					default:
						console.error("profile.avatar_status is invalid", profile);
						this.manager.Open(modals.ErrorModal({
							error: L.SomethingWentWrong,
							onClose: this.onClose,
							onNavBack: this.onNavBack
						}));
				}
			}).catch((error: UIError) => {
				console.error('whenSignIn invalid avatar state', error);
				this.whenError(colorwaySizeAssetSKU, error);
			});
		},

		onSignIn(colorwaySizeAssetSKU: string) {
			return (username, password, validationError: (message: string) => void) => {
				if (username.length == 0 || password.length == 0) {
					validationError(L.UsernameOrPasswordEmpty);
					return;
				}
				this.firebase.Login(username, password).then((u: types.FirebaseUser) => {
					this.whenSignedIn(u, colorwaySizeAssetSKU);
					this.manager.Close();
				}).catch((error: UIError) => {
					console.error("failed to login", error);
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
						email: email,
						onNavSignIn: this.onNavSignIn(colorwaySizeAssetSKU),
					}));
				}).catch((error: UIError) => {
					this.whenError(colorwaySizeAssetSKU, error);
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

		TryOn(colorwaySizeAssetSKU: string) {
			console.log('starting tfr tryon flow', colorwaySizeAssetSKU);
			try {
				if (this?.user?.ID()) {
					this.whenSignedIn(this.user, colorwaySizeAssetSKU);
					return;
				}

				this.firebase.User().then((u) => {
					this.whenSignedIn(u, colorwaySizeAssetSKU);
				}).catch((error) => {
					if (error == types.NotLoggedIn) {
						console.info("user not logged in");
						this.whenNotSignedIn(colorwaySizeAssetSKU);
					} else {
						console.error("error retrieving firebase user", error);
						this.whenError(colorwaySizeAssetSKU, error);
					}
					this.whenFramesFailed(colorwaySizeAssetSKU, error);
				});
			} catch (e) {
				if (e.message == types.NotLoggedIn) {
					this.whenNotSignedIn(colorwaySizeAssetSKU);
				} else {
					this.whenError(colorwaySizeAssetSKU, e);
				}
				this.whenFramesFailed(colorwaySizeAssetSKU, e);
			}
		}
	};

	fittingRoom.firebase.User().then((u) => {
		fittingRoom.user = u;
	}).catch((error) => {
		if (error == types.NotLoggedIn) {
			console.log("user not logged in");
		}
	});

	return fittingRoom;
};

export { InitFittingRoom };
