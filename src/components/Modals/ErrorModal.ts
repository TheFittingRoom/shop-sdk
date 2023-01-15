import { Locale } from "../../classes/Locale";
import { TfrLogo } from "../../lib/svgUrl";
import { ErrorModalProps } from "../../types";

const ErrorModal = ({override, errorText, sizes}: ErrorModalProps) => {
    const { Strings } = override || Locale.getLocale();
    const { title, signOut, noSizeAvailable, trySize, orSize, somethingWentWrong, returnToProductPage, returnToCatalogPage } = Strings;

    const sizeText = `${noSizeAvailable} ${trySize} ${sizes?.recommended} ${orSize} ${sizes?.optionalSizes?.join(", ")}.`;
    const errorMsg = errorText || (Boolean(sizes?.recommended) && `${sizeText}`) || somethingWentWrong;

    return `
        <div class="modal" id="modalContainer" onclick="window.theFittingRoom.closeModal(true)">
            <div class="modal-content-container pt-5-p pb-5-p pr-20 pl-20">
                <div class="modal-content">
                    <div class="modal-title-logo-container">
                        <div class="poppins-light-24-300 c-dark mr-10">${title}</div>
                        <div>
                            <object data="tfr-logo.svg" type="image/svg+xml">
                                <img src="${TfrLogo}" />
                            </object>
                        </div>
                    </div>

                    <div class="body-text-container mt-15-p mb-13-p">
                        <div class="poppins-regular-20-default c-dark">${errorMsg}</div>
                    </div>

                    <!--
                    <button class="standard-button bg-aquamarina-strong c-white poppins-medium-16-default cursor mt-10-p" id="thefittingroom-signout-btn" onclick="window.theFittingRoom.signOut()">
                        ${signOut}
                    </button>
                    -->

                    <div class="t-a-center">
                        <span class="roboto-16-default c-dark-o5 underline cursor mr-20" onclick="window.history.back()">${returnToCatalogPage || "Return to Catalog Page"}</span>
                        <span class="roboto-16-default c-dark-o5 underline cursor" id="returnToSite" onclick="window.theFittingRoom.closeModal()">${returnToProductPage || "Return to Product Page"}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export default ErrorModal;
