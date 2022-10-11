import Auth from "../../classes/Auth";
import { Locale } from "../../classes/Locale";
import { ErrorModalProps } from "../../types";

const ErrorModal = ({override, errorText}: ErrorModalProps) => {
    const { Texts, ErrorModal } = override || Locale.getLocale();
    const { title, signOut } = Texts;
    const { noSizeAvailable, trySize, orSize } = ErrorModal;

    const sizes = {recommended: ["1", "2"], optionalSizes: ["1", "2"]};

    const errorMsg = errorText || `${noSizeAvailable} ${trySize} ${sizes?.recommended?.[0]} ${orSize} ${sizes?.recommended?.[1]}`

    setTimeout(() => {
        if(!window.theFittingRoom.isLoggedIn()) {
            document.querySelector('#thefittingroom-modal #signOutButton').style.display = "none";
        }
    }, 10);

    return `
        <div class="modal-content-container pt-5-p pb-5-p pr-20 pl-20">
            <div class="modal-content">
                <div class="modal-title-logo-container">
                    <div class="poppins-light-24-300 c-dark mr-10">${title}</div>
                    <img src='../assets/tfr-logo.jpeg' class="tfr-logo" />
                </div>

                <div class="body-text-container mt-15-p mb-40">
                    <div class="poppins-regular-20-default c-dark">${errorMsg}</div>
                </div>

                <button class="standard-button bg-aquamarina-strong c-white poppins-medium-16-default cursor mt-10-p" id="signOutButton" onclick="window.theFittingRoom.signOut()">
                    ${signOut}
                </button>
            </div>
        </div>
    `;
}

export default ErrorModal;
