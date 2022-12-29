import { ErrorType, GetVirtualTryOnFramesResponse } from "../types";
import { getVirtualTryOnFrames } from "./VirtualTryOnFrames";

export const tryOnWithTheFittingRoom = async ({ sku }): Promise<GetVirtualTryOnFramesResponse | ErrorType | void> => {
    if (window.theFittingRoom.isLoggedIn()) {
        const data = await getVirtualTryOnFrames({ sku });

        return data;
    } else {
        window.theFittingRoom.renderSignInModal();
    }
}
