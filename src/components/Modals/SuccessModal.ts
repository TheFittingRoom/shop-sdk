import { Locale } from "../../classes/Locale";
import { TfrLogo } from "../../lib/svgUrl";
import { SuccessModalProps } from "../../types";

const SuccessModal = ({override}: SuccessModalProps) => {
    const { Strings } = override || Locale.getLocale();
    const { title, signBackIn, successfullyLoggedOut, returnToSite } = Strings;

    return `
        <div class="modal">
            <div class="modal-content-container pt-7-p pb-7-p pr-20 pl-20">
                <div class="modal-content">
                    <div class="modal-title-logo-container">
                        <div class="poppins-light-24-300 c-dark mr-10">${title}</div>
                        <div>
                            <object data="tfr-logo.svg" type="image/svg+xml">
                                <img src="${TfrLogo}" />
                            </object>
                        </div>
                    </div>

                    <div class="poppins-light-22-300 mt-15-p mb-13-p">${successfullyLoggedOut}</div>
                </div>

                <div class="t-a-center">
                    <span class="roboto-16-default c-dark-o5 underline cursor mr-20" onclick="window.theFittingRoom.renderSignInModal()">${signBackIn}</span>
                    <span class="roboto-16-default c-dark-o5 underline cursor" id="returnToSite" onclick="window.theFittingRoom.closeModal()">${returnToSite}</span>
                </div>
            </div>
        </div>
    `;
}

export default SuccessModal;
