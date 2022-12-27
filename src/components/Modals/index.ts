import NoAvatarModal from './NoAvatarModal';
import SignInModal from './SignInModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import ScanCodeModal from './ScanCodeModal';
import EnterEmailModal from './EnterEmailModal';
import ErrorModal from './ErrorModal';
import SuccessModal from './SuccessModal';
import ResetLinkModal from './ResetLinkModal';
import LoadingAvatarModal from './LoadingAvatarModal';

export const initializeModal = ()=> {
    const modal = document.getElementById("thefittingroom-modal");
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

const hideModal = (modal: HTMLElement) => {
    if (modal) {
        modal.style.display = "none";
        modal.innerHTML = "";
    }
}

export const closeModal = (isCalledFromParent?: boolean) => {
    const modal = document.getElementById("thefittingroom-modal");

    if (isCalledFromParent) {
        const modalContainer = document.querySelector('#thefittingroom-modal #modalContainer');
        window.onclick = (event) => {
            if (event.target == modalContainer) {
                hideModal(modal);
            }
        }
    } else {
        hideModal(modal);
    }
}

export const validate = (errorMessage?: string) => {
    const errorMsgElement = document.querySelector('#thefittingroom-modal #error-msg');
    errorMsgElement.classList.remove('d-block');

    const fieldsetElement = document.querySelectorAll('#thefittingroom-modal .fieldset-element');
    fieldsetElement.forEach(element => {
        element.classList.remove('fieldset-err');
    })

    const labelElement = document.querySelectorAll('#thefittingroom-modal .label-element');
    labelElement.forEach(element => {
        element.classList.remove('c-red');
    })
    
    if (errorMessage) {
        errorMsgElement.classList.add('d-block');
        errorMsgElement.innerHTML = errorMessage;

        fieldsetElement.forEach(element => {
            element.classList.add('fieldset-err');
        })

        labelElement.forEach(element => {
            element.classList.add('c-red');
        })
    }
}

export { 
    NoAvatarModal,
    SignInModal,
    ForgotPasswordModal,
    ScanCodeModal,
    EnterEmailModal,
    ErrorModal,
    SuccessModal,
    ResetLinkModal,
    LoadingAvatarModal
};
