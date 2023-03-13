import { FirebaseUser } from "../auth/FirebaseUser";

class Fetcher {



	private static async Fetch(endpointPath: string, method: string, request: object|null): Promise<object> {
		return new Promise(async (resolve, reject) => {
			FirebaseUser.Token().then((token) => {
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

	static async Get(endpointPath: string, body: any): Promise<object> {
		return Fetcher.Fetch(endpointPath, "GET", body)
	}

	static async Post(endpointPath: string, body:object): Promise<object> {
		return Fetcher.Fetch(endpointPath, "POST", body)
	}

	static async Put(endpointPath: string, body: object): Promise<object> {
		return Fetcher.Fetch(endpointPath, "PUT", body)
	}

	static async Patch(endpointPath: string, body: object): Promise<object> {
		return Fetcher.Fetch(endpointPath, "PATCH", body)
	}

	static async Delete(endpointPath: string, body: object): Promise<object> {
		return Fetcher.Fetch(endpointPath, "DELETE", body)
	}
}

export {Fetcher}
