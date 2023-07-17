import { FirebaseUser } from '../firebase/firebase-user'

interface FetchParams {
  user: FirebaseUser
  endpointPath: string
  method: string
  body?: Record<string, any>
}

export class Fetcher {
  private static async Fetch({ user, endpointPath, method, body }: FetchParams): Promise<Response> {
    const url = process.env.API_ENDPOINT + endpointPath
    const token = await user.getToken()
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
    const config: RequestInit = { method, headers, credentials: 'include' }

    if (body) config.body = JSON.stringify(body)

    const res = await fetch(url, config)

    if (res.ok) return res
    if (res.status === 500) throw new Error(res.statusText)

    const json = await res.json()

    return Promise.reject(json)
  }

  static Get(user: FirebaseUser, endpointPath: string): Promise<Response> {
    return this.Fetch({ user, endpointPath, method: 'GET', body: null })
  }

  static Post(user: FirebaseUser, endpointPath: string, body: Record<string, any> = null): Promise<Response> {
    return this.Fetch({ user, endpointPath, method: 'POST', body })
  }

  static Put(user: FirebaseUser, endpointPath: string, body: Record<string, any>): Promise<Response> {
    return this.Fetch({ user, endpointPath, method: 'PUT', body })
  }

  static Patch(user: FirebaseUser, endpointPath: string, body: Record<string, any>): Promise<Response> {
    return this.Fetch({ user, endpointPath, method: 'PATCH', body })
  }

  static Delete(user: FirebaseUser, endpointPath: string, body: Record<string, any>): Promise<Response> {
    return this.Fetch({ user, endpointPath, method: 'DELETE', body })
  }
}
