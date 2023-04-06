// import { InitFirebase, ModalManager, Shop, SignInModal, ForgotPasswordModal, ScanCodeModal, NoAvatarModal, LoadingAvatarModal, LoggedOutModal, ErrorModal, types, L } from "@thefittingroom/ui";
import { InitFirebase, FirebaseUser } from "./auth/Firebase";
import { ModalManager, SignInModal, ForgotPasswordModal, ScanCodeModal, NoAvatarModal, LoadingAvatarModal, LoggedOutModal, ErrorModal } from "./components";
import { InitShop, Shop } from "./api/Shop";
import { L } from "./api/Locale";
import * as types from "./types";
import ResetLinkModal from "./components/Modals/ResetLinkModal";


export const TheFittingRoom = (id: number, modalDivID: string) => {
	const searchParams = new URL(window.location.href).searchParams;
	const language = searchParams.get("language") || "en";
	const version = searchParams.get("version") || "";

	let user: FirebaseUser;
	let shop: Shop;
	let firebase = InitFirebase();
	let manager = ModalManager(modalDivID);

	const onLogout = (colorwaySKU: string) => {
		return () => {
			manager.Open(LoggedOutModal({
				onNavSignIn: onNavSignIn(colorwaySKU),
				onClose
			}));
		};
	};

	const onClose = () => {
		manager.Close();
	};

	const onNavBack = () => {
		window.history.back();
	};

	const tryOn = (colorwaySKU) => {
		manager.Open(LoadingAvatarModal({}));
		shop.TryOn(colorwaySKU).then((frames) => {
			console.log(frames);
			// TODO: add model frames functionality
		}).catch((error) => {
			manager.Open(ErrorModal({
				error: error.message,
				onClose,
				onNavBack
			}));
		});
	};

	const afterSignIn = (user, colorwaySKU) => {
		shop = InitShop(user, 1); // todo: pass in shop id
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
						tryOn(colorwaySKU);
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
					tryOn(colorwaySKU);
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

	const onSignIn = (colorwaySKU) => {
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

	const onNavSignIn = (colorwaySKU: string) => {
		return (email: string) => {
			manager.Open(SignInModal({
				email,
				onSignIn: onSignIn(colorwaySKU),
				onNavForgotPassword: onNavForgotPassword(colorwaySKU),
				onNavScanCode
			}));
		};
	};

	const onPasswordReset = (colorwaySKU: string) => {
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

	const onNavForgotPassword = (colorwaySKU: string) => {
		return (email: string) => {
			manager.Open(ForgotPasswordModal({
				email,
				onNavSignIn: onNavSignIn(colorwaySKU),
				onPasswordReset: onPasswordReset(colorwaySKU)
			}));
		};
	};

	const onNavScanCode = () => {
		manager.Open(ScanCodeModal({}));
	};

	return {
		TryOn: (colorwaySKU: string) => {
			firebase.User(onLogout(colorwaySKU)).then((u) => {
				user = u;
				shop = InitShop(user, id);
				afterSignIn(user, colorwaySKU);
			}).catch((error) => {
				if (error.message == "user not logged in") {
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
		}
	};
};
