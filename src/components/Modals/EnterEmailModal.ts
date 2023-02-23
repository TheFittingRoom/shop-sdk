import { Locale } from "../../classes/Locale";
import { TfrLogo } from "../../lib/svgUrl";
import { EnterEmailModalProps } from "../../types";

const EnterEmailModal = ({override}: EnterEmailModalProps) => {
    const { Strings } = override || Locale.getLocale();
    const { title, emailAddress, signUp, modalTitle } = Strings;

    return `
        <div class="tfr-modal" id="modalContainer" onclick="window.theFittingRoom.closeModal(true)">
            <div class="tfr-modal-content-container tfr-p-20">
                <div class="tfr-close-container" onclick="window.theFittingRoom.closeModal()">
                    <span class="tfr-close tfr-cursor">&times;</span>
                </div>

                <div class="tfr-modal-content tfr-pt-20 tfr-pb-50">
                    <div class="tfr-modal-title-logo-container">
                        <div class="tfr-poppins-light-24-300 tfr-c-dark tfr-mr-10">${title}</div>
                        <div>
                            <object data="tfr-logo.svg" type="image/svg+xml">
                                <img src="${TfrLogo}" />
                            </object>
                        </div>
                    </div>

                    <div class="tfr-poppins-light-22-300 tfr-c-dark tfr-w-85-p tfr-m-h-auto mt-40">${modalTitle}</div>

                    <fieldset class="tfr-fieldset-element tfr-fieldset tfr-mt-60 tfr-mb-40">
                        <legend class="tfr-label-element tfr-roboto-14-default tfr-c-dark-o5">${emailAddress}</legend>
                        <input type="email" id="email-input" />
                    </fieldset>
                    <div class="tfr-roboto-12-default tfr-c-red tfr-mt-10 tfr-d-none" id="error-msg"></div>

                    <button id="signUpButton" class="tfr-standard-button tfr-bg-aquamarina-strong tfr-c-white tfr-poppins-medium-16-default tfr-cursor tfr-mt-30"
                        onclick="
                            window.theFittingRoom._internal.validate();
                            const response = window.theFittingRoom._internal.notifyEmail({email: document.querySelector('#thefittingroom-modal #email-input').value});

                            response.then(data => {
                                if (data?.errorMessage) {
                                    window.theFittingRoom._internal.validate(data.errorMessage)
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
