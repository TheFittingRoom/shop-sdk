import { Locale } from "../../classes/Locale";
import { NoSizeAvailableModalProps } from "../../types";

const NoSizeAvailableModal = ({override, sizes}: NoSizeAvailableModalProps) => {
    const { Texts, NoSizeAvailableModalTexts } = override || Locale.getLocale();
    const { title, signOut } = Texts;
    const { noSizeAvailable, trySize, orSize } = NoSizeAvailableModalTexts;

    // document.querySelector('#thefittingroom-modal #recommendedSize').innerHTML = `${trySize} ${sizes?.recommended?.[0]} ${orSize} ${sizes?.recommended?.[1]}`;
    const msg = `${trySize} ${sizes?.recommended?.[0]} ${orSize} ${sizes?.recommended?.[1]}`;

    return `
        <div class="modal-content-container pt-5-p pb-5-p pr-20 pl-20">
            <div class="modal-content">
                <div class="modal-title-logo-container">
                    <div class="poppins-light-24-300 c-dark mr-10">${title}</div>
                    <img src='../assets/tfr-logo.jpeg' class="tfr-logo" />
                </div>

                <div class="body-text-container mt-15-p mb-40">
                    <div class="poppins-regular-20-default c-dark">${noSizeAvailable}</div>
                    <div class="poppins-regular-20-default c-dark" id="recommendedSize">${msg}</div>
                </div>

                <button class="standard-button bg-aquamarina-strong c-white poppins-medium-16-default cursor mt-10-p" id="signInOut" onclick="window.theFittingRoom.Auth.signOut()">
                    ${signOut}
                </button>
            </div>
        </div>
    `;
}

export default NoSizeAvailableModal;
