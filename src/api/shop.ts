import { QueryFieldFilterConstraint, documentId, where } from 'firebase/firestore'

import { Firebase } from '../firebase/firebase'
import { getFirebaseError } from '../firebase/firebase-error'
import { asyncTry } from '../helpers/async'
import * as Errors from '../helpers/errors'
import * as types from '../types'
import { Fetcher } from './fetcher'
import { SizeRecommendation } from './responses'
import { TestImage } from './utils'

export class TfrShop {
  private static AVATAR_TIMEOUT = process.env.AVATAR_TIMEOUT_MS ? Number(process.env.AVATAR_TIMEOUT_MS) : 12000

  constructor(private readonly brandId: number, private readonly firebase: Firebase) {}

  public get user() {
    return this.firebase.user
  }

  public get isLoggedIn(): boolean {
    return !this.firebase || Boolean(this.user.id)
  }

  public onInit() {
    return this.firebase.onInit()
  }

  public async tryOn(colorwaySizeAssetSku: string) {
    if (!this.isLoggedIn) throw new Errors.UserNotLoggedInError()

    try {
      const frames = await this.getColorwaySizeAssetFrames(colorwaySizeAssetSku)

      return frames
    } catch (error) {
      if (!(error instanceof Errors.NoFramesFoundError)) throw error

      return this.requestThenGetColorwaySizeAssetFrames(colorwaySizeAssetSku)
    }
  }

  public async awaitAvatarCreated() {
    if (!this.isLoggedIn) throw new Errors.UserNotLoggedInError()

    const { promise, unsubscribe } = this.firebase.query('users', where(documentId(), '==', this.user.id))
    const cancel = setTimeout(() => {
      unsubscribe()
      throw new Errors.RequestTimeoutError()
    }, TfrShop.AVATAR_TIMEOUT)

    const snapshot = await promise
    clearTimeout(cancel)

    const userProfile = snapshot.docs[0].data()

    return userProfile.avatar_status === 'CREATED'
  }

  public async getRecommendedSizes(brandStyleId: string) {
    if (!this.isLoggedIn) throw new Errors.UserNotLoggedInError()

    const res = await Fetcher.Get(this.user, `/styles/${brandStyleId}/recommendation`)
    const json = await res.json()

    return json as SizeRecommendation
  }

  public async getStyles(ids: number[], skus: string[]) {
    const constraints: QueryFieldFilterConstraint[] = [where('brand_id', '==', this.brandId)]
    if (ids?.length > 0) constraints.push(where('id', 'in', ids))
    if (skus?.length > 0) constraints.push(where('brand_style_id', 'in', skus))

    try {
      const querySnapshot = await this.firebase.getDocs('styles', constraints)

      const styles: Map<number, types.FirestoreStyle> = new Map()
      querySnapshot.forEach((doc) => {
        const FirestoreStyle = doc.data() as types.FirestoreStyle
        styles.set(FirestoreStyle.id, FirestoreStyle)
      })

      return styles
    } catch (error) {
      return getFirebaseError(error)
    }
  }

  private awaitColorwaySizeAssetFrames(colorwaySizeAssetSKU: string) {
    if (!this.isLoggedIn) throw new Errors.UserNotLoggedInError()

    return this.getColorwaySizeAssetFrames(colorwaySizeAssetSKU)
  }

  private async requestThenGetColorwaySizeAssetFrames(colorwaySizeAssetSku: string) {
    const [error, colorwaySizeAsset] = await asyncTry(this.getColorwaySizeAssetFromSku(colorwaySizeAssetSku))
    if (error) throw error

    try {
      await this.requestColorwaySizeAssetFrames(colorwaySizeAsset.id)

      return this.awaitColorwaySizeAssetFrames(colorwaySizeAssetSku)
    } catch (error) {
      if (!error.recommended_size_id) throw new Error(error)

      const errorOutsideRecommended = error as Errors.ErrorOutsideRecommendedSizes

      const styles = await this.getStyles([colorwaySizeAsset.style_id], null)
      const style = styles.get(colorwaySizeAsset.style_id)
      if (!style?.sizes) throw new Errors.NoStylesFoundError()

      const recommendedSize =
        style.sizes[errorOutsideRecommended.recommended_size_id]?.label ||
        style.sizes[errorOutsideRecommended.recommended_size_id]?.size

      const availableSizes = errorOutsideRecommended.available_size_ids
        .filter((id) => style.sizes[id]?.size !== recommendedSize)
        .map((id) => style.sizes[id]?.label || style.sizes[id]?.size)

      throw new Errors.RecommendedAvailableSizesError(recommendedSize, availableSizes)
    }
  }

  private async getColorwaySizeAssetFromSku(colorwaySizeAssetSku: string) {
    const assets = await this.getColorwaySizeAssets(null, [colorwaySizeAssetSku])
    if (!assets?.size) throw new Errors.NoColorwaySizeAssetsFoundError()

    return Array.from(assets.values())[0]
  }

  private async getColorwaySizeAssets(styleId?: number, skus?: string[]) {
    const constraints: QueryFieldFilterConstraint[] = [where('brand_id', '==', this.brandId)]
    if (styleId) constraints.push(where('style_id', '==', styleId))
    if (skus?.length > 0) constraints.push(where('sku', 'in', skus))

    try {
      const querySnapshot = await this.firebase.getDocs('colorway_size_assets', constraints)

      const colorwaySizeAssets: Map<number, types.FirestoreColorwaySizeAsset> = new Map()
      querySnapshot.forEach((doc) => {
        const colorwaySizeAsset = doc.data() as types.FirestoreColorwaySizeAsset
        colorwaySizeAssets.set(colorwaySizeAsset.id, colorwaySizeAsset)
      })

      return colorwaySizeAssets
    } catch (error) {
      return getFirebaseError(error)
    }
  }

  private async requestColorwaySizeAssetFrames(colorwaySizeAssetId: number) {
    if (!this.isLoggedIn) throw new Errors.UserNotLoggedInError()

    await Fetcher.Post(this.user, `/colorway-size-assets/${colorwaySizeAssetId}/frames`)
  }

  private async getColorwaySizeAssetFrames(colorwaySizeAssetSKU: string) {
    const userProfile = await this.user.getUserProfile()

    const frames = userProfile?.vto?.[this.brandId]?.[colorwaySizeAssetSKU]?.frames || []
    if (!frames.length) throw new Errors.NoFramesFoundError()

    const testedImage = await TestImage(frames[0])
    if (!testedImage) throw new Errors.NoFramesFoundError()

    return frames as types.TryOnFrames
  }
}

export const initShop = (brandId: number) => new TfrShop(brandId, new Firebase())
