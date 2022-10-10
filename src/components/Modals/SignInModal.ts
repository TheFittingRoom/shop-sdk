import { Locale } from "../../classes/Locale";
import { SignInModalProps } from "../../types";

const SignInModal = ({override}: SignInModalProps) => {

    console.log("Locale.getLocale(): ", Locale.getLocale())

    const { Texts } = override || Locale.getLocale();
    const { title, emailAddress, password, forgotPasswordWithSymbol, dontHaveAcc, signIn } = Texts;

    return `
        <div class="modal-content-container p-20">
            <div class="close-container" onclick="window.theFittingRoom.closeModal()">
                <span class="close cursor">&times;</span>
            </div>

            <div class="modal-content pt-20 pb-50">
                <div class="modal-title-logo-container">
                    <div class="poppins-light-24-300 c-dark mr-10">${title}</div>
                    <img src='../assets/tfr-logo.jpeg' class="tfr-logo" />
                </div>

                <div class="poppins-light-22-300 c-dark mt-30">${signIn}</div>

                <fieldset class="fieldset-element fieldset mt-20">
                    <legend class="label-element arial-helvetica-14-default c-dark-o5">${emailAddress}</legend>
                    <input type="email" id="email-input" />
                </fieldset>

                <fieldset class="fieldset-element fieldset mt-20">
                    <legend class="label-element arial-helvetica-14-default c-dark-o5">${password}</legend>
                    <input type="password" id="password-input" />
                </fieldset>

                <div class="arial-helvetica-12-default c-red mt-10 d-none" id="error-msg"></div>

                <div class="mt-30">
                    <span class="arial-helvetica-12-default c-dark-o5 underline cursor mr-15" onclick="window.theFittingRoom.renderForgotPasswordModal()">${forgotPasswordWithSymbol}</span>
                    <span class="arial-helvetica-12-default c-dark-o5 underline cursor">${dontHaveAcc}</span>
                </div>

                <button class="standard-button bg-aquamarina-strong c-white poppins-medium-16-default cursor mt-30" id="sign-in-button"
                onclick="
                        window.theFittingRoom.validate();
                        const response = window.theFittingRoom.Auth.signIn({email: document.querySelector('#thefittingroom-modal #email-input').value, password: document.querySelector('#thefittingroom-modal #password-input').value})

                        response.then(msg => {
                            if (msg) {
                                window.theFittingRoom.validate(msg)
                            }
                        })
                    "
                >
                    ${signIn}
                </button>
            </div>
        </div>
    `;
}

export default SignInModal;