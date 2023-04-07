import { L } from "../../api/Locale";
import { SizeErrorModalProps } from "../../types";

const SizeErrorModal = (props: SizeErrorModalProps) => {
	const onNavBack = () => {
		props.onNavBack();
	};

	const onClose = () => {
		props.onClose();
	};

	const Hook = () => {
		document.getElementById("tfr-back").addEventListener("click", onNavBack);
		document.getElementById("tfr-close").addEventListener("click", onClose);
	};

	const Unhook = () => {
		document.getElementById("tfr-back").removeEventListener("click", onNavBack);
		document.getElementById("tfr-close").removeEventListener("click", onClose);
	};

	const Body = () => {
		console.log("body", L);
		return `
        <div class="tfr-mt-15-p tfr-mb-13-p">
            <div tfr-element="true" class="tfr-poppins-regular-20-default tfr-c-dark">
							${L.NoSizeAvailable} ${L.TrySize} ${props.sizes?.recommended} ${L.OrSize} ${props.sizes?.avaliable?.join(" or ")}
						</div>
        </div>

        <div class="tfr-t-a-center">
            <span id="tfr-back" tfr-element="true" class="tfr-roboto-16-default tfr-c-dark-o5 tfr-underline tfr-cursor tfr-mr-20">${L.ReturnToCatalogPage || "Return to Catalog Page"}</span>
            <span id="tfr-close" tfr-element="true" class="tfr-roboto-16-default tfr-c-dark-o5 tfr-underline tfr-cursor">${L.ReturnToProductPage || "Return to Product Page"}</span>
        </div>
        `;
	};

	return {
		Hook,
		Unhook,
		Body
	};
};

export default SizeErrorModal;
