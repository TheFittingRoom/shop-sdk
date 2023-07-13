// import { InitFirebase, ModalManager, Shop, SignInModal, ForgotPasswordModal, ScanCodeModal, NoAvatarModal, LoadingAvatarModal, LoggedOutModal, ErrorModal, types, L } from "@thefittingroom/ui";
import { InitFirebase } from "./auth/Firebase";
import * as modals from "./components";
import { L, InitLocale } from "./api/Locale";
import * as types from "./types";
import { UIError } from "./api/UIError";
import { InitShop } from "./api/Shop";


const InitFittingRoom = (shopID: number, modalDivID: string): types.FittingRoom => {
	InitLocale().catch((error) => {
		console.error(error);
	});


	let firebaseInstance = InitFirebase()
	const fittingRoom: types.FittingRoom = {
		user: undefined,
		firebase: firebaseInstance,
		shop: InitShop(firebaseInstance, shopID),
		manager: modals.InitModalManager(modalDivID),


		onSignout(colorwaySizeAssetSKU: string) {
			return () => {
				return new Promise((resolve, reject) => {
					if (!this.user) {
						this.whenSignedOut(colorwaySizeAssetSKU);
						resolve(void 0);
						return;
					}
					this.user.SignOut().then(() => {
						this.whenSignedOut(colorwaySizeAssetSKU);
						resolve(void 0);
					}).catch((error: Error) => {
						console.error("failed to sign user out", error);
						this.whenError(colorwaySizeAssetSKU, error);
						reject(error);
					});
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
			if (!colorwaySizeAssetSKU) {
				// this happens when the user logs out and logs back in
				// the user needs to click the try on button again
				console.error("No colorway SKU provided, skipping try on");
				return;
			}

			this.shop.TryOn(this.user, colorwaySizeAssetSKU)
				.then(framesOrFunc => {
					if (framesOrFunc instanceof Function) {
						console.debug("recieved func wrapped promise from shop tryon");
						this.whenTryOnLoading(colorwaySizeAssetSKU);
						return framesOrFunc();
					}
					return framesOrFunc;
				}).then((frames: types.TryOnFrames) => {
					this.manager.Close();
					console.debug("waited for frames and retrieved frames", frames);
					this.whenTryOnReady(colorwaySizeAssetSKU, frames);
				}).catch((error: Error | types.RecommendedAvailableSizes) => {
					const recommendedSizeError = error as types.RecommendedAvailableSizes;
					if (!recommendedSizeError.recommended_size ||
						!recommendedSizeError.available_sizes ||
						!recommendedSizeError.available_sizes.length) {
						console.error("error is not recommended size error", error);
						this.whenError(colorwaySizeAssetSKU, error);
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
					this.whenTryOnReady(colorwaySizeAssetSKU, frames);
				});
		},

		whenAvatarNotCreated(colorwaySizeAssetSKU: string) {
			this.manager.Open(modals.NoAvatarModal({
				onClose: this.onClose.bind(this),
				onNavBack: this.onNavBack,
			}));
		},

		whenAvatarPending(colorwaySizeAssetSKU: string) {
			this.manager.Open(modals.LoadingAvatarModal({timeoutMS: parseInt(process.env.VTO_TIMEOUT_MS)}));
			this.shop.AwaitAvatarCreated().then(() => {
				this.onTryOn(colorwaySizeAssetSKU);
			}).catch((error: UIError) => {
				this.whenError(colorwaySizeAssetSKU, error);
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

		whenTryOnReady(colorwaySizeAssetSKU: string, frames: types.TryOnFrames) {
			this.manager.Open(modals.TryOnModal({
				frames: frames,
				onClose: this.onClose.bind(this),
				onNavBack: this.onNavBack
			}));
		},

		whenTryOnFailed(colorwaySizeAssetSKU: string, error: Error) {
			console.warn("whenFramesFailed not implemented");
			this.whenError(colorwaySizeAssetSKU, error);
		},

		whenTryOnLoading(colorwaySizeAssetSKU: string) {
			this.manager.Open(modals.LoadingAvatarModal({ timeoutMS: parseInt(process.env.VTO_TIMEOUT_MS) }));
		},

		whenError(colorwaySizeAssetSKU: string, error: UIError) {
			this.manager.Open(modals.ErrorModal({
				error: error?.userMessage,
				onClose: this.onClose.bind(this),
				onNavBack: this.onNavBack
			}));
		},

		whenSignedIn(user: types.FirebaseUser, colorwaySizeAssetSKU: string) {
			this.user = user
			user.GetUserProfile().then((profile) => {
				switch (profile.avatar_status) {
					case types.AvatarState.NOT_CREATED:
						console.debug("avatar_state: not_created");
						this.whenAvatarNotCreated(colorwaySizeAssetSKU);
						break;
					case types.AvatarState.PENDING:
						console.debug("avatar_state: pending");
						this.whenAvatarPending(colorwaySizeAssetSKU);
						break;
					case types.AvatarState.CREATED:
						console.debug("avatar_state: created");
						this.whenAvatarCreated(colorwaySizeAssetSKU);
						break;
					default:
						console.error("profile.avatar_status is invalid", profile);
						this.whenError(colorwaySizeAssetSKU, L.SomethingWentWrong);
				}
			}).catch((error: UIError) => {
				console.error('whenSignIn invalid avatar state', error);
				this.whenError(colorwaySizeAssetSKU, error);
			});
		},

		whenSignedOut(colorwaySizeAssetSKU: string) {
			this.manager.Open(modals.LoggedOutModal({
				onNavSignIn: this.onNavSignIn(colorwaySizeAssetSKU),
				onClose: this.onClose.bind(this)
			}));
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
			console.debug('onNavSignIn', colorwaySizeAssetSKU);
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
			console.debug('starting tfr tryon flow', colorwaySizeAssetSKU);
			try {
				if (this?.user?.ID()) {
					this.whenSignedIn(this.user, colorwaySizeAssetSKU);
					return;
				}

				this.firebase.User().then((u) => {
					console.debug("TryOn user", u)
					this.whenSignedIn(u, colorwaySizeAssetSKU);
				}).catch((error) => {
					if (error == types.NotLoggedIn) {
						console.info("user not logged in");
						this.whenNotSignedIn(colorwaySizeAssetSKU);
					} else {
						console.error("error retrieving firebase user", error);
						this.whenError(colorwaySizeAssetSKU, error);
					}
				});
			} catch (e) {
				if (e.message == types.NotLoggedIn) {
					this.whenNotSignedIn(colorwaySizeAssetSKU);
				} else {
					this.whenError(colorwaySizeAssetSKU, e);
				}
			}
		},
	};

	fittingRoom.firebase.User().then((u) => {
		console.debug("on page load user", u.ID())
		fittingRoom.user = u;
	}).catch((error) => {
		if (error == types.NotLoggedIn) {
			console.debug("user not logged in");
		}
	});

	return fittingRoom;
};

export { InitFittingRoom };
