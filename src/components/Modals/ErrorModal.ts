import { L } from "../../api/Locale";
import { ErrorModalProps } from "../../types";
import { ModalContent } from "../../types";
import {ModalManager} from "./ModalManager";
import Modal from "./Modal";

class ErrorModal extends Modal implements ModalContent {
    constructor(title, modalTitle, error: string) {
        super(title, modalTitle);
        this.Error = error;
    }
    Error: string;
    Hook(): void {
        document.getElementById("tfr-back").addEventListener("click", window.history.back);
        document.getElementById("tfr-close").addEventListener("click", ModalManager.Manager().Close);
    }
    Unhook(): void {
        document.getElementById("tfr-back").removeEventListener("click", window.history.back);
        document.getElementById("tfr-close").removeEventListener("click", ModalManager.Manager().Close);
    }
    Body() {
        return `
    <div class="tfr-mt-15-p tfr-mb-13-p">
        <div tfr-element="true" class="tfr-poppins-regular-20-default tfr-c-dark">${this.Error}</div>
    </div>

    <div class="tfr-t-a-center">
        <span id="tfr-back" tfr-element="true" class="tfr-roboto-16-default tfr-c-dark-o5 tfr-underline tfr-cursor tfr-mr-20">${L.ReturnToCatalogPage || "Return to Catalog Page"}</span>
        <span id="tfr-close" tfr-element="true" class="tfr-roboto-16-default tfr-c-dark-o5 tfr-underline tfr-cursor" id="returnToSite">${L.ReturnToProductPage || "Return to Product Page"}</span>
    </div>
    `;
    }
}

export default ErrorModal;
