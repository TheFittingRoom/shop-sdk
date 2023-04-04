import { L } from "../../api/Locale";
import { ResetLinkModalProps } from "../../types";

const ResetLinkModal = (props: ResetLinkModalProps) => {
    return `
    <div tfr-element="true" class="tfr-poppins-regular-20-default tfr-c-dark tfr-mt-15-p tfr-mb-13-p tfr-w-80-p tfr-m-h-auto">${L.AssociatedEmail}</div>
    <div class="tfr-t-a-center">
        <span tfr-element="true" class="tfr-roboto-16-default tfr-c-dark-o5 tfr-underline tfr-cursor tfr-mr-20" onclick="window.theFittingRoom.renderSignInModal()">${L.BackToSignIn}</span>
    </div>
    `;
}
export default ResetLinkModal;
