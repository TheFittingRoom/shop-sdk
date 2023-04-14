// import { InitFirebase, ModalManager, Shop, SignInModal, ForgotPasswordModal, ScanCodeModal, NoAvatarModal, LoadingAvatarModal, LoggedOutModal, ErrorModal, types, L } from "@thefittingroom/ui";
import { InitFirebase, InitFirebaseUser } from "./auth/Firebase";
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
		manager: InitModalManager(modalDivID),

		onSignout(colorwaySizeAssetSKU: string) {
			console.log("onSignout", colorwaySizeAssetSKU);
			return () => {
				this.manager.Open(LoggedOutModal({
					onNavSignIn: this.onNavSignIn(colorwaySizeAssetSKU),
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

		onTryOn(colorwaySizeAssetSKU:string) {
			console.log("try on", colorwaySizeAssetSKU);
			if (!colorwaySizeAssetSKU) {
				console.error("No colorway SKU provided, skipping try on");
				return;
			}
			this.shop.GetColorwayFrames(colorwaySizeAssetSKU).then((frames) => {
				console.log("frames exist", frames);
				this.manager.Close();
				this.framesCallback(frames);
			}).catch((error) => {
				if (error == types.NoFramesFound) {
					this.manager.Open(LoadingAvatarModal({}));
					this.shop.TryOn(colorwaySizeAssetSKU)
						.then(frames => {
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
									this.framesCallback(error);
								}).catch((error) => {
									console.error(error);
									this.manager.Open(ErrorModal({
										error: L.SomethingWentWrong,
										onClose: this.onClose.bind(this),
										onNavBack: this.onNavBack
									}));
									this.framesCallback(error);
								});
							} else {
								this.manager.Open(ErrorModal({
									error: L.SomethingWentWrong,
									onClose: this.onClose.bind(this),
									onNavBack: this.onNavBack
								}));
								this.framesCallback(error);
							}
						});
				} else {
					console.error(error);
					this.manager.Open(ErrorModal({
						error: L.SomethingWentWrong,
						onClose: this.onClose.bind(this),
						onNavBack: this.onNavBack
					}));
					this.framesCallback(error);
				}
			});
		},

		afterSignIn(user: types.FirebaseUser, colorwaySizeAssetSKU: string) {
			console.log('afterSignIn', colorwaySizeAssetSKU);
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
							onTryOn: this.onTryOn(colorwaySizeAssetSKU);
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
						onTryOn: this.onTryOn(colorwaySizeAssetSKU);
						break;
					default:
						console.error("profile.avatar_status is invalid", profile);
						this.manager.Open(ErrorModal({
							error: "todo: something went wrong",
							onClose: this.onClose,
							onNavBack: this.onNavBack
						}));
				}
			}).catch((error: UIError) => {
				console.error('catch uierror', error);
				this.manager.Open(ErrorModal({
					error: error.message,
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
				}).catch((UIError) => {
					validationError(UIError.message);
				});
			};
		},

		onNavSignIn(colorwaySizeAssetSKU: string) {
			console.log('onNavSignIn', colorwaySizeAssetSKU);
			return (email: string) => {
				this.manager.Open(SignInModal({
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
					this.manager.Open(ResetLinkModal({
						onNavSignIn: this.onNavSignIn(colorwaySizeAssetSKU),
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

		onNavForgotPassword(colorwaySizeAssetSKU: string): (email: string) => void {
			return (email: string) => {
				this.manager.Open(ForgotPasswordModal({
					email,
					onNavSignIn: this.onNavSignIn(colorwaySizeAssetSKU),
					onPasswordReset: this.onPasswordReset(colorwaySizeAssetSKU)
				}));
			};
		},

		onNavScanCode(): void {
			this.manager.Open(ScanCodeModal({}));
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
						this.manager.Open(SignInModal({
							email: "",
							onSignIn: this.onSignIn(colorwaySizeAssetSKU),
							onNavForgotPassword: this.onNavForgotPassword(colorwaySizeAssetSKU),
							onNavScanCode: this.onNavScanCode.bind(this)
						}));
						callback(error);
					} else {
						console.error(error);
						this.manager.Open(ErrorModal({
							error: L.SomethingWentWrong,
							onClose: this.onClose.bind(this),
							onNavBack: this.onNavBack
						}));
						callback(error);
					}
				});
			} catch (e) {
				if (e.message == types.NotLoggedIn) {
					this.manager.Open(SignInModal({
						email: "",
						onSignIn: this.onSignIn(colorwaySizeAssetSKU),
						onNavForgotPassword: this.onNavForgotPassword(colorwaySizeAssetSKU),
						onNavScanCode: this.onNavScanCode.bind(this)
					}));
				} else {
					this.manager.Open(ErrorModal({
						error: L.SomethingWentWrong,
						onClose: this.onClose.bind(this),
						onNavBack: this.onNavBack
					}));
				}
				callback(e);
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
