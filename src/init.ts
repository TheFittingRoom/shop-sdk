// import { InitFirebase, ModalManager, Shop, SignInModal, ForgotPasswordModal, ScanCodeModal, NoAvatarModal, LoadingAvatarModal, LoggedOutModal, ErrorModal, types, L } from "@thefittingroom/ui";
import { InitFirebase } from "./auth/Firebase";
import { ModalManager, SignInModal, ForgotPasswordModal, ScanCodeModal, NoAvatarModal, LoadingAvatarModal, LoggedOutModal, ErrorModal, SizeErrorModal, InitModalManager } from "./components";
import { InitShop } from "./api/Shop";
import { L, InitLocale } from "./api/Locale";
import * as types from "./types";
import ResetLinkModal from "./components/Modals/ResetLinkModal";
import { UIError } from "./api/UIError";

interface FittingRoom {
	user: types.FirebaseUser | undefined;
	shop: types.Shop | undefined;
	firebase: types.FirebaseInstance;
	manager: ModalManager;
	onSignout(colorwaySKU: string): () => void;
	onClose(): void;
	onNavBack(): void;
	onTryOn(colorwaySKU: string): void;
	afterSignIn(user: types.FirebaseUser, colorwaySKU: string): void;
	onSignIn(colorwaySKU: string): (username: string, password: string, validation: (message: string) => void) => void;
	onNavSignIn(colorwaySKU: string): (email: string) => void;
	onPasswordReset(colorwaySKU: string): (email: string) => void;
	onNavForgotPassword(colorwaySKU: string): (email: string) => void;
	onNavScanCode(): void;
	TryOn(colorwaySKU: string, framesCallback: (frames: types.TryOnFrames | Error) => void): void;
}

const InitFittingRoom = (shopID: number, modalDivID: string): FittingRoom => {
	InitLocale().catch((error) => {
		console.error(error);
	});

	let fittingRoom: FittingRoom = {
		user: undefined,
		shop: undefined,
		firebase: InitFirebase(),
		manager: InitModalManager(modalDivID),

		onSignout(colorwaySKU: string) {
			return () => {
				this.manager.Open(LoggedOutModal({
					onNavSignIn: this.onNavSignIn(colorwaySKU),
					onClose: this.onClose.bind(this)
				}));
			};
		},

		onClose() {
			this.manager.Close();
		},

		onNavBack() {
			window.history.back();
		},

		onTryOn(colorwaySKU) {
			if (!colorwaySKU) {
				console.warn("No colorway SKU provided, skipping try on");
				return
			}
			this.manager.Open(LoadingAvatarModal({}));
			this.shop.TryOn(colorwaySKU).then((frames) => {
				this.manager.Close();
				this.framesCallback(frames);
			}).catch((error) => {
				if (error.recommended_size_id) {
					this.shop.GetStyles().then((styles: types.FirebaseStyles) => {
						let recommendedSize: string;
						let availableSizes: string[] = [];
						for (const style of styles.values()) {
							for (let size of style.sizes.values()) {
								if (size.id === error.recommended_size_id) {
									recommendedSize = size.size;
								}
								if (error.available_size_ids.includes(size.id) && !availableSizes.includes(size.size) && size.size != recommendedSize) {
									availableSizes.push(size.size);
								}
							}
						}
						this.manager.Open(SizeErrorModal({
							sizes: {
								recommended: recommendedSize,
								avaliable: availableSizes
							},
							onClose: this.onClose.bind(this),
							onNavBack: this.onNavBack
						}));
					}).catch((error) => {
						console.error(error);
						this.manager.Open(ErrorModal({
							error: L.SomethingWentWrong,
							onClose: this.onClose.bind(this),
							onNavBack: this.onNavBack
						}));
					});
				} else {
					this.manager.Open(ErrorModal({
						error: error.message,
						onClose: this.onClose.bind(this),
						onNavBack: this.onNavBack
					}));
				}
			});
		},

		afterSignIn(user, colorwaySKU) {
			this.shop = InitShop(user, shopID);
			user.GetUserProfile().then((profile) => {
				switch (profile.avatar_status) {
					case types.AvatarState.NOT_CREATED:
						console.log("avatar not created");
						this.manager.Open(NoAvatarModal({
							onClose: this.onClose.bind(this),
							onNavBack: this.onNavBack,
						}));
						break;
					case types.AvatarState.PENDING:
						console.log("avatar pending");
						this.manager.Open(LoadingAvatarModal({}));
						this.shop.AwaitAvatarCreated().then(() => {
							onTryOn: this.onTryOn(colorwaySKU);
						}).catch((error: UIError) => {
							this.manager.Open(ErrorModal({
								error: error.message,
								onClose: this.onClose.bind(this),
								onNavBack: this.onNavBack
							}));
						});
						break;
					case types.AvatarState.CREATED:
						console.log("avatar created");
						onTryOn: this.onTryOn(colorwaySKU);
						break;
					default:
						console.error("profile.avatar_status is invalid", profile);
						this.manager.Open(ErrorModal({
							error: "todo: something went wrong",
							onClose: this.onClose,
							onNavBack: this.onNavBack
						}));
				}
			}).catch((UIError) => {
				console.error(UIError);
				this.manager.Open(ErrorModal({
					error: UIError.message,
					onClose: this.onClose.bind(this),
					onNavBack: this.onNavBack
				}));
			});
		},

		onSignIn(colorwaySKU) {
			return (username, password, validationError: (message: string) => void) => {
				if(username.length == 0 || password.length == 0) {
					validationError(L.UsernameOrPasswordEmpty);
					return;
				}
				this.firebase.Login(username, password, this.onSignout(colorwaySKU)).then((u) => {
					this.user = u;
					this.afterSignIn(this.user, colorwaySKU);
				}).catch((UIError) => {
					validationError(UIError.message);
				});
			};
		},

		onNavSignIn(colorwaySKU: string) {
			console.log("onNavSignIn", colorwaySKU)
			return (email: string) => {
				this.manager.Open(SignInModal({
					email,
					onSignIn: this.onSignIn(colorwaySKU),
					onNavForgotPassword: this.onNavForgotPassword(colorwaySKU),
					onNavScanCode: this.onNavScanCode.bind(this)
				}));
			};
		},

		onPasswordReset(colorwaySKU: string) {
			return (email: string) => {
				this.firebase.SendPasswordResetEmail(email).then(() => {
					this.manager.Open(ResetLinkModal({
						onNavSignIn: this.onNavSignIn(colorwaySKU),
					}));
				}).catch((UIError) => {
					console.error(UIError);
					this.manager.Open(ErrorModal({
						error: UIError.message,
						onClose: this.onClose.bind(this),
						onNavBack: this.onNavBack
					}));
				});
			};
		},

		onNavForgotPassword(colorwaySKU: string): (email: string) => void {
			return (email: string) => {
				this.manager.Open(ForgotPasswordModal({
					email,
					onNavSignIn: this.onNavSignIn(colorwaySKU),
					onPasswordReset: this.onPasswordReset(colorwaySKU)
				}));
			};
		},

		onNavScanCode(): void {
			this.manager.Open(ScanCodeModal({}));
		},

		TryOn(colorwaySKU: string, callback: (frames: types.TryOnFrames | Error) => void) {
			this.framesCallback = callback;
			try {
				if(this.user) {
					console.log("user is already set")
					this.afterSignIn(this.user, colorwaySKU);
					return
				}
				this.firebase.User(this.onSignout(colorwaySKU)).then((u) => {
					this.user = u;
					this.afterSignIn(this.user, colorwaySKU);
				}).catch((error) => {
					if (error == types.NotLoggedIn) {
						console.info("user not logged in");
						this.manager.Open(SignInModal({
							email: "",
							onSignIn: this.onSignIn(colorwaySKU),
							onNavForgotPassword: this.onNavForgotPassword(colorwaySKU),
							onNavScanCode: this.onNavScanCode.bind(this)
						}));
						callback(error)
					} else {
						console.error(error);
						this.manager.Open(ErrorModal({
							error: L.SomethingWentWrong,
							onClose: this.onClose.bind(this),
							onNavBack: this.onNavBack
						}));
						callback(error)
					}
				});
			} catch (e) {
				if (e.message == types.NotLoggedIn) {
					this.manager.Open(SignInModal({
						email: "",
						onSignIn: this.onSignIn(colorwaySKU),
						onNavForgotPassword: this.onNavForgotPassword(colorwaySKU),
						onNavScanCode: this.onNavScanCode.bind(this)
					}));
				} else {
					this.manager.Open(ErrorModal({
						error: L.SomethingWentWrong,
						onClose: this.onClose.bind(this),
						onNavBack: this.onNavBack
					}));
				}
				callback(e)
			};
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
