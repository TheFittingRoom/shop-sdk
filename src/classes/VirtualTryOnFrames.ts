import Api from './Api';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { AvatarState, Response, UserVTOFrames, VirtualTryOnFramesProps } from '../types';
import { FirebaseInstance } from './Firebase';
import ErrorHandler from './ErrorHandler';
import Auth from './Auth';
import { getRecommendedSizes } from './Sizes';
import { getVTOFrames } from './Frames';

export const virtualTryOnFrames = async ({ sku }: VirtualTryOnFramesProps): Promise<any> => {
    try {
        const userProfile = await Auth.getUserProfile();

        if (userProfile?.avatar_status === AvatarState.PENDING) {
            window.theFittingRoom.renderLoadingAvatarModal();
            return;
        }

        if (userProfile?.avatar_status === AvatarState.NOT_CREATED) {
            window.theFittingRoom.renderNoAvatarModal();
            return;
        }

        const userVTOFrames = await getVTOFrames({ sku: sku }) as UserVTOFrames;

        if (userVTOFrames?.length) {
            return Response.SUCCESS;
        }

        const db = FirebaseInstance.firestoreApp;

        console.log("sku: ", sku)

        const brandStyleId = sku?.split('-')?.[0];

        console.log("brandStyleId: ", brandStyleId)

        const q = query(collection(db, 'styles'), where('brand_style_id', '==', String(brandStyleId)));

        const querySnapshot = await getDocs(q);

        const style = querySnapshot?.docs?.[0]?.data();

        console.log("style: ", style)

        let colorwayId = null;

        if (style?.sizes?.length) {
            for (const size of style?.sizes) {
                if (size?.colorways?.length) {
                    const foundColorway = size?.colorways?.find((colorway: any) => String(colorway?.sku) === String(sku));
                    if (foundColorway && foundColorway?.id) {
                        colorwayId = foundColorway?.id;
                        break;
                    }
                }
            };
        }

        console.log("colorwayId: ", colorwayId);

        if (colorwayId) {
            await Api.post(`/colorways/${colorwayId}/frames`);

            return Response.SUCCESS;
        } else {
            window.theFittingRoom.renderErrorModal({errorText: 'Something went wrong while fetching colorway id. Try again!'});
        }
    } catch (error) {
        console.log("error virtualTryOnFrames: ", error)
        const errMsg = error?.message?.error;

        if (errMsg === 'size id is outside of recommended range') {
            try {
                const recommendedSizeText = await getRecommendedSizes({ sku: sku });

                const errRecommendedSizeText = recommendedSizeText.replace('You can try on a size', 'Please try on one of the recommended sizes: ').replace('We recommend', 'We suggest');

                window.theFittingRoom?.renderErrorModal({errorText: errRecommendedSizeText});
            } catch (error) { }
        } else {
            window.theFittingRoom.renderErrorModal({errorText: errMsg || 'Something went wrong. Try again!'}); 
        }

        return ErrorHandler.getError(error?.code);
    }
}
