import { Locale } from "../../classes/Locale";
import { SignInModalProps } from "../../types";
import { QrCodeLogo, AppStoreLogo, AposeLogo, TfrLogo } from "../../lib/svgUrl";

const defaultImg = "https://cdn.shopify.com/s/files/1/0551/2180/5443/products/SpeckledCrepeBodycon.png?v=1664304344";

const SignInModal = ({override, imgUrl = defaultImg}: SignInModalProps) => {
    const { Strings } = override || Locale.getLocale();
    const { title, emailAddress, password, forgotPasswordWithSymbol, dontHaveAcc, signIn, howItWorks, howItWorksText, simplyScan, simplyScanText, tryOn, tryOnText, or, createAvatarSc, notifiedGoogle } = Strings;

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

                    <div class="poppins-light-22-300 c-dark mt-30">${signIn}</div>

                    <fieldset class="fieldset-element fieldset mt-20">
                        <legend class="label-element roboto-14-default c-dark-o5">${emailAddress}</legend>
                        <input type="email" id="email-input" />
                    </fieldset>

                    <fieldset class="fieldset-element fieldset mt-20">
                        <legend class="label-element roboto-14-default c-dark-o5">${password}</legend>
                        <input type="password" id="password-input" />
                    </fieldset>

                    <div class="roboto-12-default c-red mt-10 d-none" id="error-msg"></div>

                    <div class="mt-30">
                        <span class="roboto-12-default c-dark-o5 underline cursor mr-15" onclick="window.theFittingRoom.renderForgotPasswordModal()">${forgotPasswordWithSymbol}</span>
                        <span class="roboto-12-default c-dark-o5 underline cursor">${dontHaveAcc}</span>
                    </div>

                    <button class="standard-button bg-aquamarina-strong c-white poppins-medium-16-default cursor mt-30" id="sign-in-button"
                    onclick="
                            window.theFittingRoom.validate();
                            const response = window.theFittingRoom._internal.signIn({email: document.querySelector('#thefittingroom-modal #email-input').value, password: document.querySelector('#thefittingroom-modal #password-input').value});

                            response.then(data => {
                                if (data?.errorMessage) {
                                    window.theFittingRoom.validate(data.errorMessage)
                                }
                            })
                        "
                    >
                        ${signIn}
                    </button>
                    
                    <div>
                        <div class="poppins-light-24-300 c-dark mt-30">${howItWorks}</div>

                        <div class="poppins-light-16-300 c-dark mt-15">${howItWorksText}</div>

                        <div class="how-it-works-item mt-15">
                            <div>
                                <div class="poppins-light-22-300 c-dark">${simplyScan}</div>
                                <div class="poppins-light-16-300 c-dark mt-15">${simplyScanText}</div>
                            </div>

                            <div class="girl-clothes d-flex">
                                <img src="${AposeLogo}" />
                            </div>
                        </div>

                        <div class="how-it-works-item mt-15">
                            <img src='${imgUrl}' class="girl-clothes" />
                            <div class="try-on-content">
                                <div class="poppins-light-22-300 c-dark">${tryOn}</div>
                                <div class="poppins-light-16-300 c-dark mt-15">${tryOnText}</div>
                            </div>
                        </div>

                        <div class="poppins-light-22-300 c-dark w-85-p m-h-auto mt-50">${createAvatarSc}</div>

                        <div class="w-150 h-150 mt-30 m-h-auto">
                            <object data="qr-code-logo.svg" type="image/svg+xml">
                                <img src="${QrCodeLogo}" />
                            </object>
                        </div>

                        <div class="poppins-light-22-300 c-dark w-85-p mt-20 m-h-auto">${or}</div>

                        <div class="mt-20 m-h-auto">
                            <object data="app-store-logo.svg" type="image/svg+xml">
                                <img src="${AppStoreLogo}" />
                            </object>
                        </div>

                        <div class="roboto-18-default c-dark-o5 underline cursor mt-40" onclick="window.theFittingRoom.renderEnterEmailModal()">${notifiedGoogle}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export default SignInModal;