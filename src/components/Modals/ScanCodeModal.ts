import { Locale } from "../../classes/Locale";
import { ScanCodeModalProps } from "../../types";
import { QrCodeLogo, AppStoreLogo, TfrLogo } from "../../lib/svgUrl";

const ScanCodeModal = ({override}: ScanCodeModalProps) => {
    const { Strings } = override || Locale.getLocale();
    const { title, createAvatarSc } = Strings;

    return `
        <div class="tfr-modal" id="modalContainer" onclick="window.theFittingRoom.closeModal(true)">
            <div class="tfr-modal-content-container tfr-p-20">
                <div class="tfr-close-container" onclick="window.theFittingRoom.closeModal()">
                    <span class="tfr-close tfr-cursor">&times;</span>
                </div>

                <div class="tfr-modal-content">
                    <div class="tfr-modal-title-logo-container">
                        <div tfr-element="true" class="tfr-poppins-light-24-300 tfr-c-dark tfr-mr-10">${title}</div>
                        <div>
                            <object data="tfr-logo.svg" type="image/svg+xml">
                                <img src="${TfrLogo}" />
                            </object>
                        </div>
                    </div>

                    <div tfr-element="true" class="tfr-poppins-light-22-300 tfr-c-dark tfr-w-85-p tfr-m-h-auto tfr-mt-30">${createAvatarSc}</div>

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
                </div>
            </div>
        </div>
    `;
}

export default ScanCodeModal;
