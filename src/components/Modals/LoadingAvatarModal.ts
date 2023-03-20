import { L } from "../../api/Locale";
import { TfrLogo } from "../../Modals/svgUrl";
import { LoadingAvatarModalProps } from "../../types";

const LoadingAvatarModal = ({ override }: LoadingAvatarModalProps) => {

    const { Strings } = override || L;
    const { title, loadingAvatar } = Strings;

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

                    <div tfr-element="true" class="tfr-poppins-light-22-300 tfr-c-dark tfr-mt-60">${loadingAvatar}</div>
                </div>
            </div>
        </div>
    `;
}

export default LoadingAvatarModal;
