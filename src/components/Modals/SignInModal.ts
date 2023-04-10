import { L } from "../../api/Locale";
import { ModalContent, SignInModalProps } from "../../types";
import { QrCodeLogo, AppStoreLogo, AposeLogo } from "../../Modals/svgUrl";


const SignInModal = (props: SignInModalProps): ModalContent =>  {
    const { email } = props;

    const onSignIn = () => {
        let email = (<HTMLInputElement>document.getElementById("email-input")).value;
        let password = (<HTMLInputElement>document.getElementById("password-input")).value;
        resetValidation();
        props.onSignIn(email, password, validationError);
    };

    const onNavForgotPassword = () => {
        let email = (<HTMLInputElement>document.getElementById("email-input")).value;
        props.onNavForgotPassword(email);
    }

    const onNavScanCode = () => {
        props.onNavScanCode();
    }

    const onHook = () => {
        document.getElementById("tfr-sign-in").addEventListener("click", onSignIn);
        document.getElementById("tfr-forgot-password").addEventListener("click", onNavForgotPassword);
        document.getElementById("tfr-scan-code").addEventListener("click", onNavScanCode);
    };

    const onUnhook = () => {
        document.getElementById("tfr-sign-in").removeEventListener("click", onSignIn);
        document.getElementById("tfr-forgot-password").removeEventListener("click", onNavForgotPassword);
        document.getElementById("tfr-scan-code").removeEventListener("click", onNavScanCode);
    };

    const resetValidation = () => {
        const fieldsetElement = document.querySelectorAll('.tfr-fieldset-element');
        fieldsetElement.forEach(element => {
            element.classList.remove('tfr-fieldset-err');
        });

        const labelElement = document.querySelectorAll('.tfr-label-element');
        labelElement.forEach(element => {
            element.classList.remove('tfr-c-red');
        });

        const formError = document.querySelector('#tfr-form-error');
        formError.classList.remove('tfr-d-block');
        formError.innerHTML = '';
    }

    const validationError = (message: string) => {
        const fieldsetElement = document.querySelectorAll('.tfr-fieldset-element');
        fieldsetElement.forEach(element => {
            element.classList.add('tfr-fieldset-err');
        });

        const labelElement = document.querySelectorAll('.tfr-label-element');
        labelElement.forEach(element => {
            element.classList.add('tfr-c-red');
        });

        const formError = document.querySelector('#tfr-form-error');
        formError.innerHTML = message;
        formError.classList.add('tfr-d-block');
    }

    const body = () => {
        return `
            <fieldset class="tfr-fieldset-element tfr-fieldset tfr-mt-20">
                <legend tfr-element="true" class="tfr-label-element tfr-body-font tfr-14-default tfr-c-dark-o5">${L.EmailAddress}</legend>
                <input tfr-element="true" type="email" id="email-input" value="${email}" />
            </fieldset>

            <fieldset class="tfr-fieldset-element tfr-fieldset tfr-mt-20">
                <legend tfr-element="true" class="tfr-label-element tfr-body-font tfr-14-default tfr-c-dark-o5">${L.Password}</legend>
                <input tfr-element="true" type="password" id="password-input" />
            </fieldset>

            <div tfr-element="true" class="tfr-body-font tfr-12-default tfr-c-red tfr-mt-10 tfr-d-none" id="tfr-form-error"></div>

            <div class="tfr-mt-30">
                <span id="tfr-forgot-password" tfr-element="true" class="tfr-body-font tfr-12-default tfr-c-dark-o5 tfr-underline tfr-cursor tfr-mr-15">${L.ForgotPasswordWithSymbol}</span>
                <span id="tfr-scan-code" tfr-element="true" class="tfr-body-font tfr-12-default tfr-c-dark-o5 tfr-underline tfr-cursor">${L.DontHaveAcc}</span>
            </div>

            <button id="tfr-sign-in" tfr-element="true" class="tfr-standard-button tfr-bg-aquamarina-strong tfr-c-whitetfr-title-font tfr-medium-16-default tfr-cursor tfr-mt-30" id="sign-in-button">
                ${L.SignIn}
            </button>

            <div>
                <div tfr-element="true" class="tfr-title-font tfr-light-24-300 tfr-c-dark tfr-mt-30">${L.HowItWorks}</div>

                <div tfr-element="true" class="tfr-title-font tfr-light-16-300 tfr-c-dark tfr-mt-15">${L.HowItWorksText}</div>

                <div class="tfr-how-it-works-item tfr-mt-15">
                    <div>
                        <div tfr-element="true" class="tfr-title-font tfr-light-22-300 tfr-c-dark">${L.SimplyScan}</div>
                        <div tfr-element="true" class="tfr-title-font tfr-light-16-300 tfr-c-dark tfr-mt-15">${L.SimplyScanText}</div>
                    </div>

                    <div class="tfr-girl-clothes tfr-d-flex">
                        <img src="${AposeLogo}" />
                    </div>
                </div>

                <div class="tfr-how-it-works-item tfr-mt-15">
                    <img src='TODO' class="tfr-girl-clothes" />
                    <div class="tfr-try-on-content">
                        <div tfr-element="true" class="tfr-title-font tfr-light-22-300 tfr-c-dark">${L.TryOn}</div>
                        <div tfr-element="true" class="tfr-title-font tfr-light-16-300 tfr-c-dark tfr-mt-15">${L.TryOnText}</div>
                    </div>
                </div>

                <div tfr-element="true" class="tfr-title-font tfr-light-22-300 tfr-c-dark tfr-w-85-p tfr-m-h-auto tfr-mt-50">${L.CreateAvatarSc}</div>

                <div class="tfr-w-150 tfr-h-150 tfr-mt-30 tfr-m-h-auto">
                    <object data="qr-code-logo.svg" type="image/svg+xml">
                        <img src="${QrCodeLogo}" />
                    </object>
                </div>

                <div tfr-element="true" class="tfr-title-font tfr-light-22-300 tfr-c-dark tfr-w-85-p tfr-mt-20 tfr-m-h-auto">${L.Or}</div>

                <div class="tfr-mt-20 tfr-m-h-auto">
                    <object data="app-store-logo.svg" type="image/svg+xml">
                        <img src="${AppStoreLogo}" />
                    </object>
                </div>
            </div>
            `;
    };

    return {
        Hook: onHook,
        Unhook: onUnhook,
        Body: body,
    };
};
export default SignInModal;
