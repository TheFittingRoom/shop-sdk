import Api from './Api';
import { GetVirtualTryOnFramesProps, GetVirtualTryOnFramesResponse } from '../types';

export const getVirtualTryOnFrames = async ({ sku, size, backgroundColor }: GetVirtualTryOnFramesProps): Promise<GetVirtualTryOnFramesResponse> => {
    try {
        const data = await Api.get("/get-virtual-try-on-frames", { body: { sku, size, backgroundColor } });

        return data.frames;
    } catch (error) {
        window.theFittingRoom.renderNoAvatarModal();
        throw new Error(error);
    }
}
