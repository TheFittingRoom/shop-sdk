import { Locale } from "../../classes/Locale";
import { TfrLogo } from "../../lib/svgUrl";
import { ForgotPasswordModalProps } from "../../types";

const ForgotPasswordModal = ({override}: ForgotPasswordModalProps) => {
    const { Strings } = override || Locale.getLocale();
    const { title, emailAddress, forgotPassword, backToSignIn, send, enterEmailAddress } = Strings;

    return `
        <div class="modal">
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

                    <div class="poppins-light-22-300 c-dark mt-30">${forgotPassword}</div>

                    <div class="poppins-light-16-300 mt-20 w-70-p m-h-auto">${enterEmailAddress}</div>

                    <fieldset class="fieldset-element fieldset mt-30">
                        <legend class="label-element roboto-14-default c-dark-o5">${emailAddress}</legend>
                        <input type="email" id="email-input" />
                    </fieldset>

                    <div class="roboto-12-default c-red mt-10 d-none" id="error-msg"></div>

                    <div class="roboto-12-default c-dark-o5 underline cursor mt-30" onclick="window.theFittingRoom.renderSignInModal()">${backToSignIn}</div>

                    <button class="standard-button bg-aquamarina-strong c-white poppins-medium-16-default cursor mt-30"
                    onclick="
                            window.theFittingRoom.validate()
                            const response = window.theFittingRoom.sendPasswordResetEmail({email: document.querySelector('#thefittingroom-modal #email-input').value})
                            
                            response.then(data => {
                                if (data?.errorMessage) {
                                    window.theFittingRoom.validate(data.errorMessage)
                                }
                            })
                        "
                    >
                        ${send}
                    </button>
                </div>
            </div>
        </div>
    `;
}

export default ForgotPasswordModal;
