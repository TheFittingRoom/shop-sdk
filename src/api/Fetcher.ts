import { FirebaseUser } from "../auth/FirebaseUser";

class Fetcher {
	private static async Fetch(user: FirebaseUser, endpointPath: string, method: string, request: object|null): Promise<object> {
		return new Promise(async (resolve, reject) => {
			user.Token().then((token) => {
				let config: RequestInit = {
					method: method,
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${token}`
					},
					credentials: 'include'
				}
				if (request) {
					config.body = JSON.stringify(request)
				}
				fetch(
					new URL(endpointPath, process.env.api_url).toString(),config).then((r) => {
						if (r.ok) {
							resolve(r.json())
						} else {
							reject(r.json())
						}
					}).catch((error) => {
						reject(error)
					})
			}).catch((error) => {
				reject(error)
			})
		})
	}

	static async Get(user: FirebaseUser, endpointPath: string, body: any): Promise<object> {
		return Fetcher.Fetch(user, endpointPath, "GET", body)
	}

	static async Post(user: FirebaseUser, endpointPath: string, body:object): Promise<object> {
		return Fetcher.Fetch(user, endpointPath, "POST", body)
	}

	static async Put(user: FirebaseUser, endpointPath: string, body: object): Promise<object> {
		return Fetcher.Fetch(user, endpointPath, "PUT", body)
	}

	static async Patch(user: FirebaseUser, endpointPath: string, body: object): Promise<object> {
		return Fetcher.Fetch(user, endpointPath, "PATCH", body)
	}

	static async Delete(user: FirebaseUser, endpointPath: string, body: object): Promise<object> {
		return Fetcher.Fetch(user, endpointPath, "DELETE", body)
	}
}

export {Fetcher}
