import { L } from "../../api/Locale";
import { SignInModalProps } from "../../types";
import { QrCodeLogo, AppStoreLogo, AposeLogo, TfrLogo } from "../../Modals/svgUrl";

const defaultImg = "https://cdn.shopify.com/s/files/1/0551/2180/5443/products/SpeckledCrepeBodycon.png?v=1664304344";

const SignInModal = ({override, imgUrl = defaultImg}: SignInModalProps) => {
    const { Strings } = override || L;
    const { title, emailAddress, password, forgotPasswordWithSymbol, dontHaveAcc, signIn, howItWorks, howItWorksText, simplyScan, simplyScanText, tryOn, tryOnText, or, createAvatarSc } = Strings;

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

                    <div tfr-element="true" class="tfr-poppins-light-22-300 tfr-c-dark tfr-mt-30">${signIn}</div>

                    <fieldset class="tfr-fieldset-element tfr-fieldset tfr-mt-20">
                        <legend tfr-element="true" class="tfr-label-element tfr-roboto-14-default tfr-c-dark-o5">${emailAddress}</legend>
                        <input tfr-element="true" type="email" id="email-input" />
                    </fieldset>

                    <fieldset class="tfr-fieldset-element tfr-fieldset tfr-mt-20">
                        <legend tfr-element="true" class="tfr-label-element tfr-roboto-14-default tfr-c-dark-o5">${password}</legend>
                        <input tfr-element="true" type="password" id="password-input" />
                    </fieldset>

                    <div tfr-element="true" class="tfr-roboto-12-default tfr-c-red tfr-mt-10 tfr-d-none" id="error-msg"></div>

                    <div class="tfr-mt-30">
                        <span tfr-element="true" class="tfr-roboto-12-default tfr-c-dark-o5 tfr-underline tfr-cursor tfr-mr-15" onclick="window.theFittingRoom.renderForgotPasswordModal()">${forgotPasswordWithSymbol}</span>
                        <span tfr-element="true" class="tfr-roboto-12-default tfr-c-dark-o5 tfr-underline tfr-cursor" onclick="window.theFittingRoom.renderScanCodeModal()">${dontHaveAcc}</span>
                    </div>

                    <button tfr-element="true" class="tfr-standard-button tfr-bg-aquamarina-strong tfr-c-white tfr-poppins-medium-16-default tfr-cursor tfr-mt-30" id="sign-in-button"
                    onclick="
                            window.theFittingRoom._internal.validate();
                            const response = window.theFittingRoom._internal.signIn({email: document.querySelector('#thefittingroom-modal #email-input').value, password: document.querySelector('#thefittingroom-modal #password-input').value});

                            response.then(data => {
                                if (data?.errorMessage) {
                                    window.theFittingRoom._internal.validate(data.errorMessage)
                                }
                            })
                        "
                    >
                        ${signIn}
                    </button>

                    <div>
                        <div tfr-element="true" class="tfr-poppins-light-24-300 tfr-c-dark tfr-mt-30">${howItWorks}</div>

                        <div tfr-element="true" class="tfr-poppins-light-16-300 tfr-c-dark tfr-mt-15">${howItWorksText}</div>

                        <div class="tfr-how-it-works-item tfr-mt-15">
                            <div>
                                <div tfr-element="true" class="tfr-poppins-light-22-300 tfr-c-dark">${simplyScan}</div>
                                <div tfr-element="true" class="tfr-poppins-light-16-300 tfr-c-dark tfr-mt-15">${simplyScanText}</div>
                            </div>

                            <div class="tfr-girl-clothes tfr-d-flex">
                                <img src="${AposeLogo}" />
                            </div>
                        </div>

                        <div class="tfr-how-it-works-item tfr-mt-15">
                            <img src='${imgUrl}' class="tfr-girl-clothes" />
                            <div class="tfr-try-on-content">
                                <div tfr-element="true" class="tfr-poppins-light-22-300 tfr-c-dark">${tryOn}</div>
                                <div tfr-element="true" class="tfr-poppins-light-16-300 tfr-c-dark tfr-mt-15">${tryOnText}</div>
                            </div>
                        </div>

                        <div tfr-element="true" class="tfr-poppins-light-22-300 tfr-c-dark tfr-w-85-p tfr-m-h-auto tfr-mt-50">${createAvatarSc}</div>

                        <div class="tfr-w-150 tfr-h-150 tfr-mt-30 tfr-m-h-auto">
                            <object data="qr-code-logo.svg" type="image/svg+xml">
                                <img src="${QrCodeLogo}" />
                            </object>
                        </div>

                        <div tfr-element="true" class="tfr-poppins-light-22-300 tfr-c-dark tfr-w-85-p tfr-mt-20 tfr-m-h-auto">${or}</div>

                        <div class="tfr-mt-20 tfr-m-h-auto">
                            <object data="app-store-logo.svg" type="image/svg+xml">
                                <img src="${AppStoreLogo}" />
                            </object>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export default SignInModal;
