import { Locale } from "../../classes/Locale";
import { TfrLogo } from "../../lib/svgUrl";
import { NoAvatarModalProps } from "../../types";

const NoAvatarModal = ({override}: NoAvatarModalProps) => {
    const { Strings } = override || Locale.getLocale();
    const { title, backToSignIn, dontHaveAvatar, returnToTfr } = Strings;

    return `
        <div class="modal">
            <div class="modal-content-container p-20">
                <div class="close-container" onclick="window.theFittingRoom.closeModal()">
                    <span class="close cursor">&times;</span>
                </div>

                <div class="modal-content pt-20 pb-50">
                    <div class="modal-title-logo-container">
                        <div class="poppins-light-24-300 c-dark mr-10">${title}</div>
                        <div>
                            <object data="tfr-logo.svg" type="image/svg+xml">
                                <img src="${TfrLogo}" />
                            </object>
                        </div>
                    </div>

                    <div class="poppins-light-22-300 c-dark mt-60">${dontHaveAvatar}</div>
                    <div class="poppins-light-22-300 c-dark mb-60">${returnToTfr}</div>
                

                    <div class="roboto-16-default c-dark-o5 underline cursor mt-10" onclick="window.theFittingRoom.renderSignInModal()">${backToSignIn}</div>
                </div>
            </div>
        </div>
    `;
}

export default NoAvatarModal;
