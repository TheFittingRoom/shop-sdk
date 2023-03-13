import Api from './Api';
import Auth from './Auth';
import { collection, query, where, getDocs, documentId } from 'firebase/firestore';
import { AvatarState, TryOnFrames, TryOnTheFittingRoomProps } from '../types';
import { FirebaseInstance } from './Firebase';
import { getRecommendedSizes } from './Sizes';
import { getVTOFrames } from './Frames';
import { onSnapshot } from "firebase/firestore";

export const tryOnWithTheFittingRoom = async ({ sku }: TryOnTheFittingRoomProps): Promise<TryOnFrames | void> => {
    try {
        const db = FirebaseInstance.firestoreApp;
        const userId = FirebaseInstance.auth.currentUser.uid;

        const userProfile = await Auth.getUserProfile();

        if (userProfile?.avatar_status === AvatarState.PENDING || userProfile?.avatar_status === AvatarState.NOT_CREATED) {
            throw new Error("No avatar created");
        }

        const userVTOFramesResponse = await getVTOFrames({ sku: sku }) as TryOnFrames;

        if (userVTOFramesResponse?.length) {
            return userVTOFramesResponse as TryOnFrames;
        }

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

            const resoleUserVTOFrames = () => {
                return new Promise((resolve, reject) => {
                    const q = query(collection(db, "users"),where(documentId(), "==", userId));

                    const unsubscribe = onSnapshot(q, (snapshot) => {
                        snapshot.docChanges().forEach(async (change) => {
                            if (change.type === "modified") {
                                const userProfile = change.doc.data();
                                console.log("Modified userProfile: ", userProfile);

                                const userVTOFrames = await getVTOFrames({ sku: sku }) as TryOnFrames;

                                console.log("userVTOFrames::: ", userVTOFrames)

                                if (userVTOFrames?.length) {
                                    resolve(userVTOFrames);
                                } else {
                                    reject("Something went wrong. Try again!")
                                }
                                unsubscribe();
                            }
                        });
                    });
                });
            }

            const result = await resoleUserVTOFrames();

            return result as TryOnFrames;
        } else {
            throw new Error('Something went wrong while fetching colorway id. Try again!');
        }
    } catch (error) {
        console.log("error virtualTryOnFrames: ", error)
        const errMsg = error?.message?.error;

        if (errMsg === 'size id is outside of recommended range') {
            const recommendedSizeText = await getRecommendedSizes({ sku: sku });

            const errRecommendedSizeText = recommendedSizeText.replace('You can try on a size', 'Please try on one of the recommended sizes: ').replace('We recommend', 'We suggest');

            throw new Error(errRecommendedSizeText);
        } else {
            throw new Error(errMsg || 'Something went wrong. Try again!');
        }
    }
}
