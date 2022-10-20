import { ErrorType, GetVirtualTryOnFramesResponse } from "../types";
import { getVirtualTryOnFrames } from "./VirtualTryOnFrames";

export const tryOnWithTheFittingRoom = async ({sku, size, backgroundColor} = {sku: "", size: "", backgroundColor: "grey"}): Promise<GetVirtualTryOnFramesResponse | ErrorType | void> => {
    if (window.theFittingRoom.isLoggedIn()) {
        const data = await getVirtualTryOnFrames({sku, size, backgroundColor});
        const frames = data as Array<string>;

        const thefittingroomImgContainer = document.getElementById('thefittingroom-virtual-try-on');

        if (thefittingroomImgContainer) {
            thefittingroomImgContainer.style.backgroundColor = 'white';
            if (frames.length) {
                thefittingroomImgContainer.innerHTML = `
                    <div>
                        ${frames.map(item => `<img src=${item} />`)}
                    </div>
                `;
            }
        }
    } else {
        window.theFittingRoom.renderSignInModal()
    }
}