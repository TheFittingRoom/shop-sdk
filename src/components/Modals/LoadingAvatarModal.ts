import { L } from "../../api/Locale";
import Modal from "./Modal";
import { ModalContent } from "../../types";
import {ModalManager} from "./ModalManager";
import SignInModal from "./SignInModal";

class LoadingAvatarModal extends Modal implements ModalContent{
    constructor(title:string = L.Loading, modalTitle: string = L.Loading){
        super(title, modalTitle);
    }

    Hook(): void {

    }
    Unhook(): void {

    }
    Body(){
        return `
        <div tfr-element="true" class="tfr-poppins-light-22-300 tfr-c-dark tfr-mt-60" > ${L.LoadingAvatar} </div>
        `;
    }
}

export default LoadingAvatarModal;
