import { L } from "../../api/Locale";
import { ModalContent } from "../../types";
import { LoadingAvatarModalProps } from "../../types";

const LoadingAvatarModal = (props:LoadingAvatarModalProps): ModalContent => {
    const Hook = () => {

    }

    const Unhook = () => {

    }

    const Body = () => {
        return `
        <div tfr-element="true" class="tfr-title-font tfr-light-22-300 tfr-c-dark tfr-mt-60" > ${L.LoadingAvatar} </div>
        `;
    }

    return {
        Hook,
        Unhook,
        Body
    }
}

export default LoadingAvatarModal;
