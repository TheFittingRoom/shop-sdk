import Api from './Api';
import { ErrorType, GetVirtualTryOnFramesProps, GetVirtualTryOnFramesResponse } from '../types';
import ErrorHandler from './ErrorHandler';
import { Locale } from './Locale';

const { Strings } = Locale.getLocale();
const { getVirtualTryOnFramesErrorText } = Strings;

export const getVirtualTryOnFrames = async ({ sku, size, backgroundColor }: GetVirtualTryOnFramesProps): Promise<GetVirtualTryOnFramesResponse | ErrorType> => {
    try {
        const data = await Api.post("/get-virtual-try-on-frames", { body: { sku, size, backgroundColor } });

        return data;
    } catch (error) {
        window.theFittingRoom.renderErrorModal({errorText: getVirtualTryOnFramesErrorText});
        return ErrorHandler.getError(error?.code);
    }
}
