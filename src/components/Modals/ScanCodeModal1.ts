import { Locale } from "../../classes/Locale";
import { ScanCodeModal1Props } from "../../types";

const ScanCodeModal1 = ({override}: ScanCodeModal1Props) => {
    const { Texts, ScanCodeModalTexts } = override || Locale.getLocale();
    const { title, returnToSignIn } = Texts;
    const { createAvatar, tfrAvailable, notifiedGoogle } = ScanCodeModalTexts;

    return `
        <div class="modal-content-container p-20">
            <div class="close-container" onclick="window.theFittingRoom.closeModal()">
                <span class="close cursor">&times;</span>
            </div>

            <div class="modal-content">
                <div class="modal-title-logo-container">
                    <div class="poppins-light-24-300 c-dark mr-10">${title}</div>
                    <img src='../assets/tfr-logo.jpeg' class="tfr-logo" />
                </div>

                <div class="poppins-light-22-300 c-dark w-85-p m-h-auto mt-30">${createAvatar}</div>

                <img src="../assets/qr-code-logo.png" class="w-150 h-150 mt-30 mb-20" />

                <div class="arial-helvetica-18-default c-dark-o5 mt-10">${tfrAvailable}</div>

                <img src="../assets/ios-logo.png" class="w-100 h-40 mt-5" />

                <div class="arial-helvetica-18-default c-dark-o5 underline cursor mt-20" onclick="window.theFittingRoom.renderEnterEmailModal()">${notifiedGoogle}</div>

                <div class="arial-helvetica-18-default c-dark-o5 underline cursor mt-40 mb-30 d-inline-block" onclick="window.theFittingRoom.renderSignInModal()">${returnToSignIn}</div>
            </div>
        </div>
    `;
}

export default ScanCodeModal1;
