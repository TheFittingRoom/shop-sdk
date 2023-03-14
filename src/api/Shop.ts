import { UserProfile } from "firebase/auth";
import { FriendlyError } from "../auth/errors";
import { AvatarNotCreated, AvatarNotReady, ErrorResponse } from "../api/errors";
import { TryOnFrames } from "../types";
import { FirebaseUser } from "../auth/FirebaseUser";
import { Fetcher } from "./Fetcher";
import { SizeRecommendation } from "../api/responses";

function IsImgValid(url: string) {
	const img = new Image();
	img.src = url;

	return new Promise((resolve) => {
		img.onerror = () => resolve(false);
		img.onload = () => resolve(true);
	});
}


class Shop {
	private BrandID: string;

	static NoFramesFound = new Error('No frames found for this colorway');

	constructor(brandID: string) {
		this.BrandID = brandID;
	}

	RequestColorwayFrames(colorwayID: number): Promise<void> {
		return new Promise((resolve, reject) => {
			Fetcher.Post(`/colorways/${colorwayID}/frames`, null).then(() => {
				resolve();
			}).catch((error: ErrorResponse) => {
				switch (error.error) {
					case AvatarNotCreated:
						reject(new FriendlyError("You have not creatd an avatar", error.error));
						break
					case AvatarNotReady:
						reject(new FriendlyError("Your avatar is not ready yet", error.error));
						break
					default:
						reject(new FriendlyError("There was an error when trying on clothing", error.error));
				}
			})
		})
	}

	async GetColorwayFrames(ColorwaySKU: string): Promise<TryOnFrames> {
		return new Promise((resolve, reject) => {
			FirebaseUser.GetUserProfile().then((profile: UserProfile) => {
				const frames = profile?.vto?.[this.BrandID]?.[ColorwaySKU]?.frames || [];
				if (frames.length > 0 && IsImgValid(frames[0])) {
					resolve(frames as TryOnFrames);
				}
				reject(Shop.NoFramesFound);
			}).catch((error) => {
				reject(error);
			})
		})
	}

	async GetRecommendedSizes(BrandStyleID: string): Promise<SizeRecommendation | ErrorResponse> {
		return new Promise((resolve, reject) => {
			Fetcher.Get(`/styles/${BrandStyleID}/recommendation`, null).then((data) => {
				resolve(data as SizeRecommendation);
			}).catch((error: ErrorResponse) => {
				switch (error.error) {
					case AvatarNotCreated:
						reject(new FriendlyError("You have not created an avatar", error.error));
						break
					case AvatarNotReady:
						reject(new FriendlyError("Your avatar is not ready yet", error.error));
						break
					default:
						reject(new FriendlyError("There was an error when trying on clothing", error.error));
				}
			})

		})
	}
}

