import { Locale } from "../../classes/Locale";
import { TfrLogo } from "../../lib/svgUrl";
import { ErrorModalProps } from "../../types";

const ErrorModal = ({override, errorText, sizes}: ErrorModalProps) => {
    const { Strings } = override || Locale.getLocale();
    const { title, noSizeAvailable, trySize, orSize, somethingWentWrong, returnToProductPage, returnToCatalogPage, somethingIsWrongWithThisUser } = Strings;

    const sizeText = `${noSizeAvailable} ${trySize} ${sizes?.recommended} ${orSize} ${sizes?.optionalSizes?.join(", ")}.`;
    let errorMsg = errorText || (Boolean(sizes?.recommended) && `${sizeText}`) || somethingWentWrong;

    if (errorMsg.toLocaleLowerCase() === 'user not found') {
        errorMsg = somethingIsWrongWithThisUser;
    }

    return `
        <div class="modal" id="modalContainer" onclick="window.theFittingRoom.closeModal(true)">
            <div class="modal-content-container pb-7-p pt-20 pr-20 pl-20">
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

                    <div class="body-text-container mt-15-p mb-13-p">
                        <div class="poppins-regular-20-default c-dark">${errorMsg}</div>
                    </div>

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
