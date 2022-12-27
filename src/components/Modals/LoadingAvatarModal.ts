import { Locale } from "../../classes/Locale";
import { TfrLogo } from "../../lib/svgUrl";
import { LoadingAvatarModalProps } from "../../types";

const LoadingAvatarModal = ({ override }: LoadingAvatarModalProps) => {

    const { Strings } = override || Locale.getLocale();
    const { title, loadingAvatar } = Strings;

    return `
        <div class="modal" id="modalContainer" onclick="window.theFittingRoom.closeModal(true)">
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

                    <div class="poppins-light-22-300 c-dark mt-60">${loadingAvatar}</div>
                </div>
            </div>
        </div>
    `;
}

export default LoadingAvatarModal;
