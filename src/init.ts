// import { InitFirebase, ModalManager, Shop, SignInModal, ForgotPasswordModal, ScanCodeModal, NoAvatarModal, LoadingAvatarModal, LoggedOutModal, ErrorModal, types, L } from "@thefittingroom/ui";
import { InitFirebase, FirebaseUser, NotLoggedIn, FirebaseInstance } from "./auth/Firebase";
import { ModalManager, SignInModal, ForgotPasswordModal, ScanCodeModal, NoAvatarModal, LoadingAvatarModal, LoggedOutModal, ErrorModal, SizeErrorModal, InitModalManager } from "./components";
import { InitShop, Shop } from "./api/Shop";
import { L, InitLocale } from "./api/Locale";
import * as types from "./types";
import ResetLinkModal from "./components/Modals/ResetLinkModal";
import { UIError } from "./api/UIError";

interface FittingRoom {
	user: FirebaseUser | undefined;
	shop: Shop | undefined;
	firebase: FirebaseInstance;
	manager: ModalManager;
	onLogout(colorwaySKU: string): () => void;
	onClose(): void;
	onNavBack(): void;
	onTryOn(colorwaySKU: string): void;
	afterSignIn(user: FirebaseUser, colorwaySKU: string): void;
	onSignIn(colorwaySKU: string): (username: string, password: string) => void;
	onNavSignIn(colorwaySKU: string): (email: string) => void;
	onPasswordReset(colorwaySKU: string): (email: string) => void;
	onNavForgotPassword(colorwaySKU: string): (email: string) => void;
	onNavScanCode(): void;
	TryOn(colorwaySKU: string, framesCallback: (frames: types.TryOnFrames) => void): void;
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

		onLogout(colorwaySKU: string) {
			return () => {
				this.manager.Open(LoggedOutModal({
					onNavSignIn: this.onNavSignIn(colorwaySKU),
					onClose: this.onClose
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
							onClose: this.onClose,
							onNavBack: this.onNavBack
						}));
					}).catch((error) => {
						console.error(error);
						this.manager.Open(ErrorModal({
							error: L.SomethingWentWrong,
							onClose: this.onClose,
							onNavBack: this.onNavBack
						}));
					});
				} else {
					this.manager.Open(ErrorModal({
						error: error.message,
						onClose: this.onClose,
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
							onClose: this.onClose,
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
								onClose: this.onClose,
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
					onClose: this.onClose,
					onNavBack: this.onNavBack
				}));
			});
		},

		onSignIn(colorwaySKU) {
			return (username, password) => {
				this.firebase.Login(username, password, this.onLogout(colorwaySKU)).then((u) => {
					this.user = u;
					this.afterSignIn(this.user, colorwaySKU);
				}).catch((UIError) => {
					console.log(UIError);
					this.manager.Open(ErrorModal({
						error: UIError.message,
						onClose: this.onClose,
						onNavBack: this.onNavBack
					}));
				});
			};
		},

		onNavSignIn(colorwaySKU: string) {
			return (email: string) => {
				this.manager.Open(SignInModal({
					email,
					onSignIn: this.onSignIn(colorwaySKU),
					onNavForgotPassword: this.onNavForgotPassword(colorwaySKU),
					onNavScanCode: this.onNavScanCode()
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
						onClose: this.onClose,
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

		onNavScanCode() {
			this.manager.Open(ScanCodeModal({}));
		},

		TryOn(colorwaySKU: string, callback: (frames: types.TryOnFrames) => void) {
			this.framesCallback = callback;
			try {
				this.firebase.User(this.onLogout(colorwaySKU)).then((u) => {
					this.user = u;
					this.shop = InitShop(this.user, shopID);
					this.afterSignIn(this.user, colorwaySKU);
				}).catch((error) => {
					if (error == NotLoggedIn) {
						console.info("user not logged in");
						this.manager.Open(SignInModal({
							email: "",
							onSignIn: this.onSignIn(colorwaySKU),
							onNavForgotPassword: this.onNavForgotPassword(colorwaySKU),
							onNavScanCode: this.onNavScanCode()
						}));
					} else {
						console.error(error);
						this.manager.Open(ErrorModal({
							error: L.SomethingWentWrong,
							onClose: this.onClose,
							onNavBack: this.onNavBack
						}));
					}
				});
			} catch (e) {
				if (e.message == NotLoggedIn) {
					this.manager.Open(SignInModal({
						email: "",
						onSignIn: this.onSignIn(colorwaySKU),
						onNavForgotPassword: this.onNavForgotPassword(colorwaySKU),
						onNavScanCode: this.onNavScanCode()
					}));
				} else {
					this.manager.Open(ErrorModal({
						error: L.SomethingWentWrong,
						onClose: this.onClose,
						onNavBack: this.onNavBack
					}));
				}
			};
		}
	};

	return fittingRoom;
};

export { FittingRoom, InitFittingRoom };
