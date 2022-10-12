import { Locale } from "../../classes/Locale";
import { NoAvatarModalProps } from "../../types";

const NoAvatarModal = ({override}: NoAvatarModalProps) => {
    const { Texts, NoAvatarModalTexts } = override || Locale.getLocale();
    const { title, returnToSignIn } = Texts;
    const { dontHaveAvatar, createAvatar } = NoAvatarModalTexts;

    return `
        <div class="modal-content-container p-20">
            <div class="close-container" onclick="window.theFittingRoom.closeModal()">
                <span class="close cursor">&times;</span>
            </div>

            <div class="modal-content pt-20 pb-50">
                <div class="modal-title-logo-container">
                    <div class="poppins-light-24-300 c-dark mr-10">${title}</div>
                    <img src='../assets/tfr-logo.jpeg' class="tfr-logo" />
                </div>

                <div class="poppins-light-22-300 c-dark mt-30">${dontHaveAvatar}</div>
                <div class="poppins-light-22-300 c-dark">${createAvatar}</div>
                
                <img src="../assets/qr-code-logo.png" class="w-200 h-200 mt-30 mb-20" />

                <div class="roboto-16-default c-dark-o5 underline cursor mt-10" onclick="window.theFittingRoom.renderSignInModal()">${returnToSignIn}</div>
            </div>
        </div>
    `;
}

export default NoAvatarModal;
