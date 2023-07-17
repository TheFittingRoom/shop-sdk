import * as types from '../types'

interface FetchParams {
  user: types.FirebaseUser
  endpointPath: string
  method: string
  body?: Record<string, any>
}

export class Fetcher {
  private static async Fetch({ user, endpointPath, method, body }: FetchParams): Promise<Response> {
    const url = process.env.API_ENDPOINT + endpointPath
    const token = await this.getToken(user)
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

  private static getToken(user: types.FirebaseUser): Promise<string> {
    try {
      return user.Token()
    } catch (error) {
      console.error('failed to get token')
      return Promise.reject(error)
    }
  }

  static Get(user: types.FirebaseUser, endpointPath: string, body: any): Promise<object> {
    return this.Fetch({ user, endpointPath, method: 'GET', body })
  }

  static Post(user: types.FirebaseUser, endpointPath: string, body: object): Promise<object> {
    return this.Fetch({ user, endpointPath, method: 'POST', body })
  }

  static Put(user: types.FirebaseUser, endpointPath: string, body: object): Promise<object> {
    return this.Fetch({ user, endpointPath, method: 'PUT', body })
  }

  static Patch(user: types.FirebaseUser, endpointPath: string, body: object): Promise<object> {
    return this.Fetch({ user, endpointPath, method: 'PATCH', body })
  }

  static Delete(user: types.FirebaseUser, endpointPath: string, body: object): Promise<object> {
    return this.Fetch({ user, endpointPath, method: 'DELETE', body })
  }
}
