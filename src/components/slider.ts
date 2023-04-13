const InitImageSlider = (sliderID: string, onChange: (slider: HTMLInputElement, imageUrl: string) => void) => {
	const slider = <HTMLInputElement>(document.getElementById(sliderID));
	if (!slider) {
		throw new Error(`Slider with id ${sliderID} not found`);
	}
	slider.style.display = 'none';

	return {
		Load(imageURLs: string[]) {
			imageURLs.forEach(function (path) { new Image().src = path; });
			const defaultScrollValue = Math.ceil(imageURLs?.length / 2) + 1;
			slider.value = defaultScrollValue.toString();
			slider.max = (imageURLs.length - 1).toString();
			const handleSliderChange = () => {
				let currentValue = parseInt((<HTMLInputElement>slider).value);
				onChange(slider, imageURLs[currentValue])
			}
			onChange(slider, imageURLs[defaultScrollValue])
			slider.style.display = 'block';
			slider.removeEventListener('input', handleSliderChange);
			slider.addEventListener('input', handleSliderChange);
			return ()=> {
				slider.removeEventListener('input', handleSliderChange);
				slider.style.display = 'none';
			}
		},
	}
}

export default InitImageSlider

