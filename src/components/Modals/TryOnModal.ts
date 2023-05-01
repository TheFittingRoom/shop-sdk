import { L } from "../../api/Locale";
import { ModalContent } from "../../types";
import { TryOnModalProps } from "../../types";
	import InitImageSlider from "../../components/slider";

const TryOnModal = (props: TryOnModalProps): ModalContent => {
	let close = () => {};
	const Hook = () => {
		let tryOnImage = <HTMLImageElement>document.getElementById("tfr-tryon-image")
		const onChange = (slider, imageUrl) => {
			console.log("slider change", slider, imageUrl);
			tryOnImage.src = imageUrl;
		}
		let slider = InitImageSlider("tfr-slider", onChange)
		if (Array.isArray(props.frames) && props.frames.length > 0) {
			let e = slider.Load(props.frames);
			if (e instanceof Error) {
				console.error(e);
				return
			}
			close = e as () => void;
		}
	};

	const Unhook = () => {
		close();
	};



	const Body = () => {
		return `
        <div tfr-element="true" class="tfr-title-font tfr-light-22-300 tfr-c-dark tfr-mt-60" >
				    <input type="range" id="tfr-slider" />
    				<img id="tfr-tryon-image" src="" />
				</div>
				<div class="tfr-t-a-center">
            <span id="tfr-back" tfr-element="true" class="tfr-body-font tfr-16-default tfr-c-dark-o5 tfr-underline tfr-cursor tfr-mr-20">${L.ReturnToCatalogPage || "Return to Catalog Page"}</span>
            <span id="tfr-close" tfr-element="true" class="tfr-body-font tfr-16-default tfr-c-dark-o5 tfr-underline tfr-cursor" id="returnToSite">${L.ReturnToProductPage || "Return to Product Page"}</span>
        </div>
        `;
	};

	return {
		Hook,
		Unhook,
		Body
	};
};

export default TryOnModal;
