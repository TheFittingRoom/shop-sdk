import { Locale } from "../../classes/Locale";
import { getProfile } from "../../classes/Profile";
import { TfrLogo } from "../../lib/svgUrl";
import { EnterEmailModalProps, ProfileResponse } from "../../types";

const EnterEmailModal = ({override}: EnterEmailModalProps) => {
    const { Strings } = override || Locale.getLocale();
    const { title, emailAddress, signUp, modalTitle } = Strings;

    getProfile().then((data: ProfileResponse) => {
        if (data?.hasAvatar) {
            document.querySelector('#thefittingroom-modal #signUpButton').style.display = "none";
        }
    });

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

                    <div class="poppins-light-22-300 c-dark w-85-p m-h-auto mt-40">${modalTitle}</div>

                    <fieldset class="fieldset-element fieldset mt-60 mb-40">
                        <legend class="label-element roboto-14-default c-dark-o5">${emailAddress}</legend>
                        <input type="email" id="email-input" />
                    </fieldset>
                    <div class="roboto-12-default c-red mt-10 d-none" id="error-msg"></div>

                    <button id="signUpButton" class="standard-button bg-aquamarina-strong c-white poppins-medium-16-default cursor mt-30"
                        onclick="
                            window.theFittingRoom.validate();
                            const response = window.theFittingRoom.notifyEmail({email: document.querySelector('#thefittingroom-modal #email-input').value});

                            response.then(data => {
                                if (data?.errorMessage) {
                                    window.theFittingRoom.validate(data.errorMessage)
                                }
                            })
                        "
                    >
                        ${signUp}
                    </button>
                </div>
            </div>
        </div>
    `;
};

export default EnterEmailModal;
