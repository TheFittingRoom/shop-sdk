import { L } from "../../api/Locale";
import { ModalContent, SignInModalProps } from "../../types";
import { QrCodeLogo, AppStoreLogo, AposeLogo, TfrLogo } from "../../Modals/svgUrl";
import ScanCodeModal from "./ScanCodeModal";
import Modal from "./Modal";
import { ModalManager } from "./ModalManager";
import ForgotPasswordModal from "./ForgotPasswordModal";


const SignInModal = (props: SignInModalProps) => {
    const OnSignIn = (username, password: string) => {
        onSignIn(username, password);
    };

    const OnForgotPassword = () => {
    };

    const OnScanCode = () => {
    };

    const { manager, onSignIn, onForgotPassword, onScanCode, title } = props;

    const onSignInSetup = () => {
        let username = (<HTMLInputElement>document.getElementById("email-input")).value;
        let password = (<HTMLInputElement>document.getElementById("password-input")).value;
        OnSignIn(username, password);
    };

    const onHook = () => {
        document.getElementById("tfr-forgot-password").addEventListener("click", OnForgotPassword);
        document.getElementById("tfr-scan-code").addEventListener("click", OnScanCode);
        document.getElementById("tfr-sign-in").addEventListener("click", onSignInSetup);
    };

    const onUnhook = () => {
        document.getElementById("tfr-forgot-password").removeEventListener("click", OnForgotPassword);
        document.getElementById("tfr-scan-code").removeEventListener("click", OnScanCode);
        document.getElementById("tfr-sign-in").removeEventListener("click", onSignInSetup);
    };

    const body = () => {
        return `
            <fieldset class="tfr-fieldset-element tfr-fieldset tfr-mt-20">
                <legend tfr-element="true" class="tfr-label-element tfr-roboto-14-default tfr-c-dark-o5">${L.EmailAddress}</legend>
                <input tfr-element="true" type="email" id="email-input" />
            </fieldset>

            <fieldset class="tfr-fieldset-element tfr-fieldset tfr-mt-20">
                <legend tfr-element="true" class="tfr-label-element tfr-roboto-14-default tfr-c-dark-o5">${L.Password}</legend>
                <input tfr-element="true" type="password" id="password-input" />
            </fieldset>

            <div tfr-element="true" class="tfr-roboto-12-default tfr-c-red tfr-mt-10 tfr-d-none" id="error-msg"></div>

            <div class="tfr-mt-30">
                <span id="tfr-forgot-password" tfr-element="true" class="tfr-roboto-12-default tfr-c-dark-o5 tfr-underline tfr-cursor tfr-mr-15">${L.ForgotPasswordWithSymbol}</span>
                <span id="tfr-scan-code" tfr-element="true" class="tfr-roboto-12-default tfr-c-dark-o5 tfr-underline tfr-cursor">${L.DontHaveAcc}</span>
            </div>

            <button id="tfr-sign-in" tfr-element="true" class="tfr-standard-button tfr-bg-aquamarina-strong tfr-c-white tfr-poppins-medium-16-default tfr-cursor tfr-mt-30" id="sign-in-button">
                ${L.SignIn}
            </button>

            <div>
                <div tfr-element="true" class="tfr-poppins-light-24-300 tfr-c-dark tfr-mt-30">${L.HowItWorks}</div>

                <div tfr-element="true" class="tfr-poppins-light-16-300 tfr-c-dark tfr-mt-15">${L.HowItWorksText}</div>

                <div class="tfr-how-it-works-item tfr-mt-15">
                    <div>
                        <div tfr-element="true" class="tfr-poppins-light-22-300 tfr-c-dark">${L.SimplyScan}</div>
                        <div tfr-element="true" class="tfr-poppins-light-16-300 tfr-c-dark tfr-mt-15">${L.SimplyScanText}</div>
                    </div>

                    <div class="tfr-girl-clothes tfr-d-flex">
                        <img src="${AposeLogo}" />
                    </div>
                </div>

                <div class="tfr-how-it-works-item tfr-mt-15">
                    <img src='TODO' class="tfr-girl-clothes" />
                    <div class="tfr-try-on-content">
                        <div tfr-element="true" class="tfr-poppins-light-22-300 tfr-c-dark">${L.TryOn}</div>
                        <div tfr-element="true" class="tfr-poppins-light-16-300 tfr-c-dark tfr-mt-15">${L.TryOnText}</div>
                    </div>
                </div>

                <div tfr-element="true" class="tfr-poppins-light-22-300 tfr-c-dark tfr-w-85-p tfr-m-h-auto tfr-mt-50">${L.CreateAvatarSc}</div>

                <div class="tfr-w-150 tfr-h-150 tfr-mt-30 tfr-m-h-auto">
                    <object data="qr-code-logo.svg" type="image/svg+xml">
                        <img src="${QrCodeLogo}" />
                    </object>
                </div>

                <div tfr-element="true" class="tfr-poppins-light-22-300 tfr-c-dark tfr-w-85-p tfr-mt-20 tfr-m-h-auto">${L.Or}</div>

                <div class="tfr-mt-20 tfr-m-h-auto">
                    <object data="app-store-logo.svg" type="image/svg+xml">
                        <img src="${AppStoreLogo}" />
                    </object>
                </div>
            </div>
            `;
    };

return {
    Title: title,
    Hook: onHook,
    Unhook: onUnhook,
    Body: body,
}
export default SignInModal;
