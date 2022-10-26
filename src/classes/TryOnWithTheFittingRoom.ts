import { ErrorType, GetVirtualTryOnFramesResponse } from "../types";
import { getVirtualTryOnFrames } from "./VirtualTryOnFrames";

export const tryOnWithTheFittingRoom = async ({sku, size, backgroundColor} = {sku: "", size: "", backgroundColor: "grey"}): Promise<GetVirtualTryOnFramesResponse | ErrorType | void> => {
    if (window.theFittingRoom.isLoggedIn()) {
        const data = await getVirtualTryOnFrames({sku, size, backgroundColor});

        return data;
    } else {
        window.theFittingRoom.renderSignInModal();
    }
}
