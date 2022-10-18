import Api from './Api';
import { ErrorType, GetVirtualTryOnFramesProps, GetVirtualTryOnFramesResponse } from '../types';
import ErrorHandler from './ErrorHandler';

export const getVirtualTryOnFrames = async ({ sku, size, backgroundColor }: GetVirtualTryOnFramesProps): Promise<GetVirtualTryOnFramesResponse | ErrorType> => {
    try {
        const data = await Api.post("/get-virtual-try-on-frames", { body: { sku, size, backgroundColor } });

        return data.frames;
    } catch (error) {
        window.theFittingRoom.renderNoAvatarModal();
        return ErrorHandler.NOT_FOUND;
    }
}
