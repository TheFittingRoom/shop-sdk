import Api from './Api';
import { GetVirtualTryOnFramesProps } from '../types';
import ErrorHandler from './ErrorHandler';
import { Locale } from './Locale';
import { FirebaseInstance } from './Firebase';
import { collection, query, where, getDocs } from "firebase/firestore";

const { Strings } = Locale.getLocale();
const { getVirtualTryOnFramesErrorText } = Strings;

export const getVirtualTryOnFrames = async ({ sku }: GetVirtualTryOnFramesProps): Promise<any> => {
    try {
        const db = FirebaseInstance.firestoreApp;

        const q = query(collection(db, 'styles'), where('sku', '==', String(sku)));

        const querySnapshot = await getDocs(q);

        const style = querySnapshot?.docs?.[0]?.data();

        if (style?.id) {
            await Api.post(`/colorways/${style.id}/frames`);

            return 'success';
        } else {
            window.theFittingRoom.renderErrorModal({errorText: getVirtualTryOnFramesErrorText});
        }
    } catch (error) {
        window.theFittingRoom.renderErrorModal({errorText: getVirtualTryOnFramesErrorText});
        return ErrorHandler.getError(error?.code);
    }
}

/*
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc?.id, " => ", doc?.data());
    });
*/
