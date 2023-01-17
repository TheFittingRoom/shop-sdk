import { AvatarState, GetRecommendedSizeProps } from '../types';
import Api from './Api';
import ErrorHandler from './ErrorHandler';
import { FirebaseInstance } from './Firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Auth from './Auth';

export const getRecommendedSizes = async ({ sku }: GetRecommendedSizeProps): Promise<any> => {
    try {
        const userProfile = await Auth.getUserProfile();

        if ((userProfile?.avatar_status === AvatarState.PENDING) || 
            (userProfile?.avatar_status === AvatarState.NOT_CREATED) || 
            (!Boolean(userProfile?.vto?.frames?.length))) {
            return;
        }

        const db = FirebaseInstance.firestoreApp;

        const brandStyleId = sku?.split('-')?.[0];

        const q = query(collection(db, 'styles'), where('brand_style_id', '==', String(brandStyleId)));

        const querySnapshot = await getDocs(q);

        const style = querySnapshot?.docs?.[0]?.data();

        console.log("getRecommendedSizes style: ", style)

        const data = await Api.get(`/styles/${style?.id}/recommendation`);

        const results = await data.json();

        return results;
    } catch (error) {
        console.log("error getRecommendedSizes: ", error)
        const errMsg = error?.message?.error;
        window.theFittingRoom.renderErrorModal({errorText: errMsg || 'Something went wrong while fetching recommended sizes. Try again!'});
        return ErrorHandler.getError(error?.code);
    }
}
