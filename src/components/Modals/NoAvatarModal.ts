import { Locale } from "../../classes/Locale";
import { TfrLogo } from "../../lib/svgUrl";
import { NoAvatarModalProps } from "../../types";

const NoAvatarModal = ({override}: NoAvatarModalProps) => {
    const { Strings } = override || Locale.getLocale();
    const { title, dontHaveAvatar, returnToTfr } = Strings;

    return `
        <div class="modal" id="modalContainer" onclick="window.theFittingRoom.closeModal(true)">
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
                </div>
            </div>
        </div>
    `;
}

export default NoAvatarModal;
