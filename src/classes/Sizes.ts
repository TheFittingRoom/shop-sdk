import { ErrorType, GetRecommendedSizeProps, GetRecommendedSizesResponse } from '../types';
import Api from './Api';
import ErrorHandler from './ErrorHandler';
import { FirebaseInstance } from './Firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
// import { Locale } from "./Locale";

// const { Strings } = Locale.getLocale();
// const { getRecommendedSizesErrorText } = Strings;

export const getRecommendedSizes = async ({ sku }: GetRecommendedSizeProps): Promise<GetRecommendedSizesResponse | ErrorType> => {
    try {
        const db = FirebaseInstance.firestoreApp;

        const brandStyleId = sku?.split('-')?.[0];

        const q = query(collection(db, 'styles'), where('brand_style_id', '==', String(brandStyleId)));

        const querySnapshot = await getDocs(q);

        const style = querySnapshot?.docs?.[0]?.data();

        console.log("getRecommendedSizes style: ", style)

        const data = await Api.get(`/styles/${style?.id}/recommendation`);

        console.log("data getRecommendedSizes: ", data)

        return data;
    } catch (error) {
        console.log("error getRecommendedSizes: ", error)
        const errMsg = error?.message?.error;
        window.theFittingRoom.renderErrorModal({errorText: errMsg || 'Something went wrong while fetching recommended sizes. Try again!'});
        return ErrorHandler.getError(error?.code);
    }
}
