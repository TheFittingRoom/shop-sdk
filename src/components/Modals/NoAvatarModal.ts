import { L } from "../../api/Locale";
import { NoAvatarModalProps } from "../../types";

const NoAvatarModal = (props: NoAvatarModalProps) => {
    const Hook = () => {};
    const Unhook = () => {};
    const Body = () =>  {
        return `
        <div tfr-element="true" class="tfr-poppins-light-22-300 tfr-c-dark tfr-mt-60">${L.DontHaveAvatar}</div>
        <div tfr-element="true" class="tfr-poppins-light-22-300 tfr-c-dark tfr-mb-60">${L.ReturnToTfr}</div>
    `};

    return {
        Body,
        Hook,
        Unhook
    }
}

export default NoAvatarModal;
