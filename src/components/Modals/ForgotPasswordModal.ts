import { Locale } from "../../classes/Locale";
import { TfrLogo } from "../../Modals/svgUrl";
import { ForgotPasswordModalProps } from "../../types";

const ForgotPasswordModal = ({override}: ForgotPasswordModalProps) => {
    const { Strings } = override || Locale.getLocale();
    const { title, emailAddress, forgotPassword, backToSignIn, send, enterEmailAddress } = Strings;

    return `
        <div class="tfr-modal" id="modalContainer" onclick="window.theFittingRoom.closeModal(true)">
            <div class="tfr-modal-content-container tfr-p-20">
                <div class="tfr-close-container" onclick="window.theFittingRoom.closeModal()">
                    <span class="tfr-close tfr-cursor">&times;</span>
                </div>

                <div class="tfr-modal-content tfr-pt-20 tfr-pb-50">
                    <div class="tfr-modal-title-logo-container">
                        <div tfr-element="true" class="tfr-poppins-light-24-300 tfr-c-dark tfr-mr-10">${title}</div>
                        <div>
                            <object data="tfr-logo.svg" type="image/svg+xml">
                                <img src="${TfrLogo}" />
                            </object>
                        </div>
                    </div>

                    <div tfr-element="true" class="tfr-poppins-light-22-300 tfr-c-dark tfr-mt-30">${forgotPassword}</div>

                    <div tfr-element="true" class="tfr-poppins-light-16-300 tfr-mt-20 tfr-w-70-p tfr-m-h-auto">${enterEmailAddress}</div>

                    <fieldset class="tfr-fieldset-element tfr-fieldset tfr-mt-30">
                        <legend tfr-element="true" class="tfr-label-element tfr-roboto-14-default tfr-c-dark-o5">${emailAddress}</legend>
                        <input tfr-element="true" type="email" id="email-input" />
                    </fieldset>

                    <div tfr-element="true" class="tfr-roboto-12-default tfr-c-red tfr-mt-10 tfr-d-none" id="error-msg"></div>

                    <div tfr-element="true" class="tfr-roboto-12-default tfr-c-dark-o5 tfr-underline tfr-cursor tfr-mt-30" onclick="window.theFittingRoom.renderSignInModal()">${backToSignIn}</div>

                    <button tfr-element="true" class="tfr-standard-button tfr-bg-aquamarina-strong tfr-c-white tfr-poppins-medium-16-default tfr-cursor tfr-mt-30"
                    onclick="
                            window.theFittingRoom._internal.validate()
                            const response = window.theFittingRoom._internal.sendPasswordResetEmail({email: document.querySelector('#thefittingroom-modal #email-input').value})

                            response.then(msg => {
                                if (msg) {
                                    window.theFittingRoom._internal.validate(msg)
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
