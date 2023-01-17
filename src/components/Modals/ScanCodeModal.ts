import { Locale } from "../../classes/Locale";
import { ScanCodeModalProps } from "../../types";
import { QrCodeLogo, AppStoreLogo, TfrLogo } from "../../lib/svgUrl";

const ScanCodeModal = ({override}: ScanCodeModalProps) => {
    const { Strings } = override || Locale.getLocale();
    const { title, createAvatarSc } = Strings;

    return `
        <div class="modal" id="modalContainer" onclick="window.theFittingRoom.closeModal(true)">
            <div class="modal-content-container p-20">
                <div class="close-container" onclick="window.theFittingRoom.closeModal()">
                    <span class="close cursor">&times;</span>
                </div>

                <div class="modal-content">
                    <div class="modal-title-logo-container">
                        <div class="poppins-light-24-300 c-dark mr-10">${title}</div>
                        <div>
                            <object data="tfr-logo.svg" type="image/svg+xml">
                                <img src="${TfrLogo}" />
                            </object>
                        </div>
                    </div>

                    <div class="poppins-light-22-300 c-dark w-85-p m-h-auto mt-30">${createAvatarSc}</div>

                    <div class="w-150 h-150 mt-30 mb-20 m-h-auto">
                        <object data="qr-code-logo.svg" type="image/svg+xml">
                            <img src="${QrCodeLogo}" />
                        </object>
                    </div>

                    <div class="mt-20 mb-20 m-h-auto">
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
