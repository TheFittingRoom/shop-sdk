import { Locale } from "../../classes/Locale";
import { ResetLinkModalProps } from "../../types";

const ResetLinkModal = ({override}: ResetLinkModalProps) => {
    const { Texts, ResetLinkModalTexts } = override || Locale.getLocale();
    const { title, backToSignIn } = Texts;
    const { associatedEmail } = ResetLinkModalTexts;

    return `
        <div class="modal-content-container pt-7-p pb-7-p pr-20 pl-20">
            <div class="modal-content">
                <div class="modal-title-logo-container">
                    <div class="poppins-light-24-300 c-dark mr-10">${title}</div>
                    <img src='../assets/tfr-logo.jpeg' class="tfr-logo" />
                </div>

                <div class="poppins-regular-20-default c-dark mt-15-p mb-13-p w-80-p m-h-auto">${associatedEmail}</div>
            </div>

            <div class="t-a-center">
                <span class="arial-helvetica-16-default c-dark-o5 underline cursor mr-20" onclick="window.theFittingRoom.renderSignInModal()">${backToSignIn}</span>
            </div>
        </div>
    `;
}

export default ResetLinkModal;
