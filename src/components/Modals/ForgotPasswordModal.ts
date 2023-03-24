import { L } from "../../api/Locale";
import { TfrLogo } from "../../Modals/svgUrl";
import { ForgotPasswordModalProps } from "../../types";
import { ModalContent } from "../../types";
import {ModalManager} from "./ModalManager";
import Modal from "./Modal";
import SignInModal from "./SignInModal";

class ForgotPasswordModal extends Modal implements ModalContent {
    constructor(title:string = L.ForgotPassword) {
        super(title);
    }
    Error: string;

    backToSignIn(){
    }

    sendPasswordReset(){

    }
    Hook(): void {
        document.getElementById("tfr-back-to-signin").addEventListener("click", this.backToSignIn);
        document.getElementById("tfr-send-password-reset").addEventListener("click", this.sendPasswordReset);
    }
    Unhook(): void {
        document.getElementById("tfr-back-to-signin").removeEventListener("click", this.backToSignIn);
        document.getElementById("tfr-send-password-reset").removeEventListener("click", this.sendPasswordReset);
    }

    Body() {
        return `
        <div tfr-element="true" class="tfr-poppins-light-16-300 tfr-mt-20 tfr-w-70-p tfr-m-h-auto">${L.EnterEmailAddress}</div>
        <fieldset class="tfr-fieldset-element tfr-fieldset tfr-mt-30">
            <legend tfr-element="true" class="tfr-label-element tfr-roboto-14-default tfr-c-dark-o5">${L.EmailAddress}</legend>
            <input tfr-element="true" type="email" id="email-input" />
        </fieldset>
        <div tfr-element="true" class="tfr-roboto-12-default tfr-c-red tfr-mt-10 tfr-d-none" id="error-msg"></div>
        <div id="tfr-back-to-signin" tfr-element="true" class="tfr-roboto-12-default tfr-c-dark-o5 tfr-underline tfr-cursor tfr-mt-30">${L.BackToSignIn}</div>
        <button id="tfr-send-password-reset" tfr-element="true" class="tfr-standard-button tfr-bg-aquamarina-strong tfr-c-white tfr-poppins-medium-16-default tfr-cursor tfr-mt-30"
        onclick="
                window.theFittingRoom._internal.validate()
                const response = window.theFittingRoom._internal.sendPasswordResetEmail({email: document.querySelector('#thefittingroom-modal #email-input').value})

                response.then(msg => {
                    if (msg) {
                        window.theFittingRoom._internal.validate(msg)
                    }
                })
            "
        >
            ${L.Send}
        </button>
    `;
    }
}

export default ForgotPasswordModal;
