import { Locale } from "../../classes/Locale";
import { TfrLogo } from "../../lib/svgUrl";
import { SuccessModalProps } from "../../types";

const SuccessModal = ({override}: SuccessModalProps) => {
    const { Strings } = override || Locale.getLocale();
    const { title, signBackIn, successfullyLoggedOut, returnToSite } = Strings;

    return `
        <div class="tfr-modal" id="modalContainer" onclick="window.theFittingRoom.closeModal(true)">
            <div class="tfr-modal-content-container tfr-pb-7-p tfr-pt-20 tfr-pr-20 tfr-pl-20">
                <div class="tfr-close-container" onclick="window.theFittingRoom.closeModal()">
                    <span class="tfr-close tfr-cursor">&times;</span>
                </div>

                <div class="tfr-modal-content">
                    <div class="tfr-modal-title-logo-container">
                        <div tfr-element="true" class="tfr-poppins-light-24-300 tfr-c-dark tfr-mr-10">${title}</div>
                        <div>
                            <object data="tfr-logo.svg" type="image/svg+xml">
                                <img src="${TfrLogo}" />
                            </object>
                        </div>
                    </div>

                    <div tfr-element="true" class="tfr-poppins-light-22-300 tfr-mt-15-p tfr-mb-13-p">${successfullyLoggedOut}</div>
                </div>

                <div class="tfr-t-a-center">
                    <span tfr-element="true" class="tfr-roboto-16-default tfr-c-dark-o5 tfr-underline tfr-cursor tfr-mr-20" onclick="window.theFittingRoom.renderSignInModal()">${signBackIn}</span>
                    <span tfr-element="true" class="tfr-roboto-16-default tfr-c-dark-o5 tfr-underline tfr-cursor" id="returnToSite" onclick="window.theFittingRoom.closeModal()">${returnToSite}</span>
                </div>
            </div>
        </div>
    `;
}

export default SuccessModal;
