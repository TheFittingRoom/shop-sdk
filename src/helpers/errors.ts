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

export class BrandUserIdNotSetError extends Error {
  constructor() {
    super('brand user id not set')
    this.name = 'BrandUserIdNotSetError'
  }
}

export class NoFramesFoundError extends Error {
  constructor() {
    super('no frames found')
    this.name = 'NoFramesFoundError'
  }
}

export class RecommendedAvailableSizesError extends Error {
  recommended_size: string
  available_sizes: string[]

  constructor(recommended_size: string, available_sizes: string[]) {
    super('recommended available sizes error')
    this.name = 'RecommendedAvailableSizesError'
    this.recommended_size = recommended_size
    this.available_sizes = available_sizes
  }
}

export interface ErrorOutsideRecommendedSizes {
  error: string
  recommended_size_id: number /* int64 */
  available_size_ids: number /* int64 */[]
}

export class NoStylesFoundError extends Error {
  constructor() {
    super('no styles found')
    this.name = 'NoStylesFoundError'
  }
}

// Backend responses
export const AvatarNotCreated = 'avatar not created'
