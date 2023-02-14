import { ErrorType } from "../types";

export const getVTOFrames = async ({ sku }): Promise<ErrorType | void> => {
  window.theFittingRoom?.getUserProfile().then(userProfile => {
    console.log("userProfile: ", userProfile?.vto);
    console.log("sku: ", sku);

    const getBandStyleId = () => {
      const bandStyleId = sku?.split('-')?.[0];
      return String(bandStyleId || "");
    }

    const getUserVTOFrames = () => {
      let frames = [];

      if (userProfile?.vto?.frames) {
        frames = userProfile?.vto?.frames;
      } else {
        frames = userProfile?.vto?.[`${getBandStyleId()}`]?.[`${sku}`]?.frames;
      }

      return frames || [];
    }

  /*
    const getColorWayId = () => {
      const colorWayId = userProfile?.vto?.[`${getBandStyleId()}`]?.[`${sku}`]?.colorway_id;
      return Number(colorWayId || null);
    }
  */

    const getUserLoadedSku = () => {
      let sku = "";

      if (userProfile?.vto?.sku) {
        sku = userProfile?.vto?.sku;
      } else {
        sku = Object.keys(userProfile?.vto?.[`${getBandStyleId()}`])?.[0];
      }

      return String(sku || "");
    }

    return {frames: getUserVTOFrames(), userSku: getUserLoadedSku()};
  }).catch(error => {
    console.log("getUserProfile error: ", error)
    throw new Error(error)
  })
}
