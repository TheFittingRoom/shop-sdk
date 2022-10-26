import { 
    NoAvatarModal,
    SignInModal,
    ForgotPasswordModal,
    ScanCodeModal,
    ErrorModal,
    SuccessModal,
    ResetLinkModal,
} from '../components';
import { ErrorModalProps, SignInModalProps, NoAvatarModalProps, ForgotPasswordModalProps, ScanCodeModalProps, SuccessModalProps, ResetLinkModalProps } from '../types';

export const renderNoAvatarModal = (props: NoAvatarModalProps) => {
    document.querySelector("#thefittingroom-modal").innerHTML = NoAvatarModal({...props});
    document.querySelector("#thefittingroom-modal").setAttribute("style", "display:block;");
    return;
}

export const renderSignInModal = (props: SignInModalProps) => {
    document.querySelector("#thefittingroom-modal").innerHTML = SignInModal({...props});
    document.querySelector("#thefittingroom-modal").setAttribute("style", "display:block;");
    return;
}

export const renderForgotPasswordModal = (props: ForgotPasswordModalProps) => {
    document.querySelector("#thefittingroom-modal").innerHTML = ForgotPasswordModal({...props});
    document.querySelector("#thefittingroom-modal").setAttribute("style", "display:block;");
    return;
}

export const renderScanCodeModal = (props: ScanCodeModalProps) => {
    document.querySelector("#thefittingroom-modal").innerHTML = ScanCodeModal({...props});
    document.querySelector("#thefittingroom-modal").setAttribute("style", "display:block;");
    return;
}

export const renderErrorModal = (props: ErrorModalProps) => {
    document.querySelector("#thefittingroom-modal").innerHTML = ErrorModal({...props});
    document.querySelector("#thefittingroom-modal").setAttribute("style", "display:block;");
    return;
}

export const renderSuccessModal = (props: SuccessModalProps) => {
    document.querySelector("#thefittingroom-modal").innerHTML = SuccessModal({...props});
    document.querySelector("#thefittingroom-modal").setAttribute("style", "display:block;");
    return;
}

export const renderResetLinkModal = (props: ResetLinkModalProps) => {
    document.querySelector("#thefittingroom-modal").innerHTML = ResetLinkModal({...props});
    document.querySelector("#thefittingroom-modal").setAttribute("style", "display:block;");
    return;
}
