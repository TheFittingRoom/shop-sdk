import { User } from "./requests"
import { UserID } from "./responses"
import { ErrorResponse } from "./errors"
import {FirebaseUser } from "../auth/FirebaseUser"
import { Fetcher } from "./Fetcher"
import { FriendlyError } from "../auth/errors"
import { TryOnFrames } from "../types"
import { UserProfile } from "firebase/auth"
import { isImgValid } from "../classes/Frames"


class ShopUser {
	BrandID: string;

	constructor(BrandID: string) {
		this.BrandID = BrandID;
	}

 /**
  * Puts the user in the database.
  * @param {User} user - the user to put in the database.
  * @returns {Promise<UserID | ErrorResponse | Error>} - the user ID of the user if successful, an APIError or javascript Error if not.
	* @throws {FirebaseUser.UserNotLoggedIn} - if the user is not logged in.
  */
	async PutUser(user: User): Promise<UserID | ErrorResponse | Error> {
		return new Promise((resolve, reject) => {
			Fetcher.Get(`/user/${FirebaseUser.ID()}`, user)
			.then((response: UserID) => {
				resolve(response)
			}).catch((error) => {
				if (error instanceof Error) {
					reject(new FriendlyError("There was an error when trying to create your account", error.message))
				}
				if (error as ErrorResponse) {
					reject(reject(new FriendlyError("There was an error when trying to create your account", error.error)))
				}
				reject(error)
			})
		})
	}
}
