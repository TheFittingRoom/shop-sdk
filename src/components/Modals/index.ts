import NoAvatarModal from './NoAvatarModal';
import SignInModal from './SignInModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import ScanCodeModal1 from './ScanCodeModal1';
import ScanCodeModal2 from './ScanCodeModal2';
import ScanCodeModal3 from './ScanCodeModal3';
import EnterEmailModal from './EnterEmailModal';
import NoSizeAvailableModal from './NoSizeAvailableModal';
import SuccessModal from './SuccessModal';
import ResetLinkModal from './ResetLinkModal';

export const initializeModal = ()=> {
    console.log("initializeModal called")
    const modal = document.getElementById("thefittingroom-modal");
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
export const closeModal = () => {
    const modal = document.getElementById("thefittingroom-modal");
    if(modal){
        modal.style.display = "none";
        modal.innerHTML = "";
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
    ScanCodeModal1,
    ScanCodeModal2,
    ScanCodeModal3,
    EnterEmailModal,
    NoSizeAvailableModal,
    SuccessModal,
    ResetLinkModal,
};
