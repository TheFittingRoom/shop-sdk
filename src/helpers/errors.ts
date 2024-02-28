export interface ErrorResponse {
  error: string
}

export class AvatarNotCreatedError extends Error {
  constructor() {
    super('Avatar not created')
    this.name = 'AvatarNotCreatedError'
  }
}

export class UserNotLoggedInError extends Error {
  constructor() {
    super('user not logged in')
    this.name = 'UserNotLoggedInError'
  }
}

export class NoColorwaySizeAssetsFoundError extends Error {
  constructor() {
    super('no colorway size assets found')
    this.name = 'NoColorwaySizeAssetsFoundError'
  }
}

// Backend responses
export const AvatarNotCreated = 'avatar not created'
