/* import { L } from "../../api/Locale";
import Modal from "./Modal";
import { ModalContent } from "../../types";
import {ModalManager} from "./ModalManager";
import SignInModal from "./SignInModal";
class SuccessModal extends Modal implements ModalContent {
    Hook(){
        document.getElementById("tfr-sign-in").addEventListener("click", this.signIn);
        document.getElementById("tfr-close").addEventListener("click", this.close);
    }

    Unhook(): void {
        document.getElementById("tfr-sign-in").removeEventListener("click", this.signIn);
        document.getElementById("tfr-close").removeEventListener("click", this.close);
    }

    signIn(): void {
        ModalManager.Manager().Open(new SignInModal())
    }

    close(): void {
        ModalManager.Manager().Close();
    }

    Body() {
        return `
        <div tfr-element="true" class="tfr-poppins-light-22-300 tfr-mt-15-p tfr-mb-13-p">${L.SuccessfullyLoggedOut}</div>
        <div class="tfr-t-a-center">
            <span id="tfr-sign-in" tfr-element="true" class="tfr-roboto-16-default tfr-c-dark-o5 tfr-underline tfr-cursor tfr-mr-20">${L.SignBackIn}</span>
            <span id="tfr-close" tfr-element="true" class="tfr-roboto-16-default tfr-c-dark-o5 tfr-underline tfr-cursor" >${L.ReturnToSite}</span>
        </div>
    `;
    }
}

export default SuccessModal;
 */
