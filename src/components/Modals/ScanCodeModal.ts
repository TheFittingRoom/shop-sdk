import { L } from "../../api/Locale";
import { ScanCodeModalProps, QrCodeLogo, AppStoreLogo } from "../../types";
import { ModalContent } from "../../types";


const ScanCodeModal = (props: ScanCodeModalProps): ModalContent => {
    const Hook = () => void 0;
    const Unhook= () => void 0;
    const Body = () => {
        return `
        <div tfr-element="true" class="tfr-title-font tfr-light-22-300 tfr-c-dark tfr-w-85-p tfr-m-h-auto tfr-mt-30">${L.CreateAvatarSc}</div>

        <div class="tfr-w-150 tfr-h-150 tfr-mt-30 tfr-mb-20 tfr-m-h-auto">
            <object data="qr-code-logo.svg" type="image/svg+xml">
                <img src="${QrCodeLogo}" />
            </object>
        </div>

        <div class="tfr-mt-20 tfr-mb-20 tfr-m-h-auto">
            <object data="app-store-logo.svg" type="image/svg+xml">
                <img src="${AppStoreLogo}" />
            </object>
        </div>
    `;
    }

    return {
        Hook,
        Unhook,
        Body,
    }
}

export default ScanCodeModal;
