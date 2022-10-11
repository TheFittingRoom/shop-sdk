import { 
    NoAvatarModal,
    SignInModal,
    ForgotPasswordModal,
    ScanCodeModal1,
    ScanCodeModal2,
    ScanCodeModal3,
    EnterEmailModal,
    ErrorModal,
    SuccessModal,
    ResetLinkModal,
} from '../components';
import { ErrorModalProps } from '../types';

export const renderNoAvatarModal = () => {
    document.querySelector("#thefittingroom-modal").innerHTML = NoAvatarModal({});
    document.querySelector("#thefittingroom-modal").setAttribute("style", "display:block;");
    return;
}

export const renderSignInModal = () => {
    document.querySelector("#thefittingroom-modal").innerHTML = SignInModal({});
    document.querySelector("#thefittingroom-modal").setAttribute("style", "display:block;");
    return;
}

export const renderForgotPasswordModal = () => {
    document.querySelector("#thefittingroom-modal").innerHTML = ForgotPasswordModal({});
    document.querySelector("#thefittingroom-modal").setAttribute("style", "display:block;");
    return;
}

export const renderScanCodeModal1 = () => {
    document.querySelector("#thefittingroom-modal").innerHTML = ScanCodeModal1({});
    document.querySelector("#thefittingroom-modal").setAttribute("style", "display:block;");
    return;
}

export const renderScanCodeModal2 = () => {
    document.querySelector("#thefittingroom-modal").innerHTML = ScanCodeModal2({});
    document.querySelector("#thefittingroom-modal").setAttribute("style", "display:block;");
    return;
}

export const renderScanCodeModal3 = () => {
    document.querySelector("#thefittingroom-modal").innerHTML = ScanCodeModal3({});
    document.querySelector("#thefittingroom-modal").setAttribute("style", "display:block;");
    return;
}

export const renderEnterEmailModal = () => {
    document.querySelector("#thefittingroom-modal").innerHTML = EnterEmailModal({});
    document.querySelector("#thefittingroom-modal").setAttribute("style", "display:block;");
    return;
}

export const renderErrorModal = ({errorText, sizes}: ErrorModalProps) => {
    document.querySelector("#thefittingroom-modal").innerHTML = ErrorModal({errorText, sizes});
    document.querySelector("#thefittingroom-modal").setAttribute("style", "display:block;");
    return;
}

export const renderSuccessModal = () => {
    document.querySelector("#thefittingroom-modal").innerHTML = SuccessModal({});
    document.querySelector("#thefittingroom-modal").setAttribute("style", "display:block;");
    return;
}

export const renderResetLinkModal = () => {
    document.querySelector("#thefittingroom-modal").innerHTML = ResetLinkModal({});
    document.querySelector("#thefittingroom-modal").setAttribute("style", "display:block;");
    return;
}
