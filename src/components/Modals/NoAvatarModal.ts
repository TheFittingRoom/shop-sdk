import { Locale } from "../../classes/Locale";
import { TfrLogo } from "../../Modals/svgUrl";
import { NoAvatarModalProps } from "../../types";

const NoAvatarModal = ({override}: NoAvatarModalProps) => {
    const { Strings } = override || Locale.getLocale();
    const { title, dontHaveAvatar, returnToTfr } = Strings;

    return `
        <div class="tfr-modal" id="modalContainer" onclick="window.theFittingRoom.closeModal(true)">
            <div class="tfr-modal-content-container tfr-p-20">
                <div class="tfr-close-container" onclick="window.theFittingRoom.closeModal()">
                    <span class="tfr-close tfr-cursor">&times;</span>
                </div>

                <div class="tfr-modal-content tfr-pt-20 tfr-pb-50">
                    <div class="tfr-modal-title-logo-container">
                        <div tfr-element="true" class="tfr-poppins-light-24-300 tfr-c-dark tfr-mr-10">${title}</div>
                        <div>
                            <object data="tfr-logo.svg" type="image/svg+xml">
                                <img src="${TfrLogo}" />
                            </object>
                        </div>
                    </div>

                    <div tfr-element="true" class="tfr-poppins-light-22-300 tfr-c-dark tfr-mt-60">${dontHaveAvatar}</div>
                    <div tfr-element="true" class="tfr-poppins-light-22-300 tfr-c-dark tfr-mb-60">${returnToTfr}</div>
                </div>
            </div>
        </div>
    `;
}

export default NoAvatarModal;
