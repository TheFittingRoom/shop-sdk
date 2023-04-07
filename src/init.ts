// import { InitFirebase, ModalManager, Shop, SignInModal, ForgotPasswordModal, ScanCodeModal, NoAvatarModal, LoadingAvatarModal, LoggedOutModal, ErrorModal, types, L } from "@thefittingroom/ui";
import { InitFirebase, FirebaseUser, NotLoggedIn } from "./auth/Firebase";
import { ModalManager, SignInModal, ForgotPasswordModal, ScanCodeModal, NoAvatarModal, LoadingAvatarModal, LoggedOutModal, ErrorModal, SizeErrorModal } from "./components";
import { InitShop, Shop } from "./api/Shop";
import { L, SetLocale } from "./api/Locale";
import * as types from "./types";
import ResetLinkModal from "./components/Modals/ResetLinkModal";


export const TheFittingRoom = (shopID: number, modalDivID: string) => {
	const searchParams = new URL(window.location.href).searchParams;
	const language = searchParams.get("language") || "en";

	SetLocale(language).catch((error) => {
		console.error(error);
	});

	let user: FirebaseUser;
	let shop: Shop;
	let firebase = InitFirebase();
	let manager = ModalManager(modalDivID);
	let framesCallback: (frames: types.TryOnFrames) => void;

	let onLogout = (colorwaySKU: string) => {
		return () => {
			manager.Open(LoggedOutModal({
				onNavSignIn: onNavSignIn(colorwaySKU),
				onClose
			}));
		};
	};

	let onClose = () => {
		manager.Close();
	};

	let onNavBack = () => {
		window.history.back();
	};

	let onTryOn = (colorwaySKU) => {
		manager.Open(LoadingAvatarModal({}));
		shop.TryOn(colorwaySKU).then((frames) => {
			manager.Close();
			framesCallback(frames);
		}).catch((error) => {
			if (error.recommended_size_id) {
				shop.GetStyles().then((styles: types.FirebaseStyles) => {
					let recommendedSize: string
					let availableSizes: string[] = [];
					for (const style of styles.values()) {
						for (let size of style.sizes.values()) {
							if (size.id === error.recommended_size_id) {
								recommendedSize = size.size
							}
							if (error.available_size_ids.includes(size.id) && !availableSizes.includes(size.size) && size.size != recommendedSize) {
								availableSizes.push(size.size)
							}
						}
					}
					manager.Open(SizeErrorModal({
						sizes: {
							recommended: recommendedSize,
							avaliable: availableSizes
						},
						onClose,
						onNavBack
					}));
				}).catch((error) => {
					console.error(error);
					manager.Open(ErrorModal({
						error: L.SomethingWentWrong,
						onClose,
						onNavBack
					}));
				})
			} else {
				manager.Open(ErrorModal({
					error: error.message,
					onClose,
					onNavBack
				}));
			}
		});
	};

	let afterSignIn = (user, colorwaySKU) => {
		shop = InitShop(user, shopID); // todo: pass in shop id
		user.GetUserProfile().then((profile) => {
			switch (profile.avatar_status) {
				case types.AvatarState.NOT_CREATED:
					console.log("avatar not created");
					manager.Open(NoAvatarModal({
						onClose,
						onNavBack
					}));
					break;
				case types.AvatarState.PENDING:
					console.log("avatar pending");
					manager.Open(LoadingAvatarModal({}));
					shop.AwaitAvatarCreated().then(() => {
						onTryOn(colorwaySKU);
					}).catch((UIError) => {
						console.error(UIError.error);
						manager.Open(ErrorModal({
							error: UIError.message,
							onClose,
							onNavBack
						}));
					});
					break;
				case types.AvatarState.CREATED:
					console.log("avatar created");
					onTryOn(colorwaySKU);
					break;
				default:
					console.error("profile.avatar_status is invalid", profile);
					manager.Open(ErrorModal({
						error: "todo: something went wrong",
						onClose,
						onNavBack
					}));
			}
		}).catch((UIError) => {
			console.error(UIError);
			manager.Open(ErrorModal({
				error: UIError.message,
				onClose,
				onNavBack
			}));
		});
	};

	let onSignIn = (colorwaySKU) => {
		return (username, password) => {
			firebase.Login(username, password, onLogout(colorwaySKU)).then((u) => {
				user = u;
				afterSignIn(user, colorwaySKU);
			}).catch((UIError) => {
				console.log(UIError);
				manager.Open(ErrorModal({
					error: UIError.message,
					onClose,
					onNavBack
				}));
			});
		};
	};

	let onNavSignIn = (colorwaySKU: string) => {
		return (email: string) => {
			manager.Open(SignInModal({
				email,
				onSignIn: onSignIn(colorwaySKU),
				onNavForgotPassword: onNavForgotPassword(colorwaySKU),
				onNavScanCode
			}));
		};
	};

	let onPasswordReset = (colorwaySKU: string) => {
		return (email: string) => {
			firebase.SendPasswordResetEmail(email).then(() => {
				manager.Open(ResetLinkModal({
					onNavSignIn: onNavSignIn(colorwaySKU),
				}));
			}).catch((UIError) => {
				console.error(UIError);
				manager.Open(ErrorModal({
					error: UIError.message,
					onClose,
					onNavBack
				}));
			});
		};
	};

	let onNavForgotPassword = (colorwaySKU: string) => {
		return (email: string) => {
			manager.Open(ForgotPasswordModal({
				email,
				onNavSignIn: onNavSignIn(colorwaySKU),
				onPasswordReset: onPasswordReset(colorwaySKU)
			}));
		};
	};

	let onNavScanCode = () => {
		manager.Open(ScanCodeModal({}));
	};

	return {
		onLogout,
		onClose,
		onNavBack,
		tryOn: onTryOn,
		afterSignIn,
		onSignIn,
		onNavSignIn,
		onPasswordReset,
		onNavForgotPassword,
		onNavScanCode,
		TryOn: (colorwaySKU: string, callback: (frames: types.TryOnFrames) => void) => {
			framesCallback = callback;
			try {
				firebase.User(onLogout(colorwaySKU)).then((u) => {
					user = u;
					shop = InitShop(user, shopID);
					afterSignIn(user, colorwaySKU);
				}).catch((error) => {
					if (error == NotLoggedIn) {
						console.info("user not logged in");
						manager.Open(SignInModal({
							email: "",
							onSignIn: onSignIn(colorwaySKU),
							onNavForgotPassword,
							onNavScanCode
						}));
					} else {
						console.error(error);
						manager.Open(ErrorModal({
							error: L.SomethingWentWrong,
							onClose,
							onNavBack
						}));
					}
				});
			} catch (e) {
				if (e.message == NotLoggedIn) {
					manager.Open(SignInModal({
						email: "",
						onSignIn: onSignIn(colorwaySKU),
						onNavForgotPassword,
						onNavScanCode
					}));
				} else {
					manager.Open(ErrorModal({
						error: L.SomethingWentWrong,
						onClose,
						onNavBack
					}));
				}
			};
		}
	};
};

