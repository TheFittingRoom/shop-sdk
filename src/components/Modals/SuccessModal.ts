import { Locale } from "../../classes/Locale";
import { SuccessModalProps } from "../../types";

const SuccessModal = ({override}: SuccessModalProps) => {
    const { SuccessModalTexts, Texts } = override || Locale.getLocale();
    const { title, signBackIn } = Texts;
    const { successfullyLoggedOut, returnToSite } = SuccessModalTexts;

    return `
        <div class="modal-content-container pt-7-p pb-7-p pr-20 pl-20">
            <div class="modal-content">
                <div class="modal-title-logo-container">
                    <div class="poppins-light-24-300 c-dark mr-10">${title}</div>
                    <img src='../assets/tfr-logo.jpeg' class="tfr-logo" />
                </div>

                <div class="poppins-light-22-300 mt-15-p mb-13-p">${successfullyLoggedOut}</div>
            </div>

            <div class="t-a-center">
                <span class="arial-helvetica-16-default c-dark-o5 underline cursor mr-20" onclick="window.theFittingRoom.renderSignInModal()">${signBackIn}</span>
                <span class="arial-helvetica-16-default c-dark-o5 underline cursor" id="returnToSite" onclick="window.theFittingRoom.closeModal()">${returnToSite}</span>
            </div>
        </div>
    `;
}

export default SuccessModal;
