import { Locale } from "../../classes/Locale";
import { ScanCodeModal3Props } from "../../types";

const ScanCodeModal3 = ({override}: ScanCodeModal3Props) => {
    const { Texts, ScanCodeModalTexts } = override || Locale.getLocale();
    const { title, returnToSignIn } = Texts;
    const { createAvatar, tfrAvailable, comingSoon, notifiedGoogle } = ScanCodeModalTexts;

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

                <div>
                    <div class="d-flex a-items-center j-content-center">
                        <div class="roboto-18-default c-dark mt-10">${tfrAvailable}</div>
                        <img src="../assets/ios-logo.png" class="w-80 h-25" />
                    </div>

                    <div class="d-flex a-items-center j-content-center">
                        <img src="../assets/android-logo.png" class="w-100 h-300 p-relative top-7 mr-5" />
                        <div class="roboto-18-default c-dark mt-10">${comingSoon}</div>
                    </div>
                </div>

                <div class="roboto-18-default c-dark-o5 underline cursor mt-20" onclick="window.theFittingRoom.renderEnterEmailModal()">${notifiedGoogle}</div>

                <div class="roboto-18-default c-dark-o5 underline cursor mt-30 mb-30 d-inline-block" onclick="window.theFittingRoom.renderSignInModal()">${returnToSignIn}</div>
            </div>
        </div>
    `;
}

export default ScanCodeModal3;
