import { QueryFieldFilterConstraint, where } from 'firebase/firestore'

import { Firebase } from '../firebase/firebase'
import { getFirebaseError } from '../firebase/firebase-error'
import { Config } from '../helpers/config'
import * as Errors from '../helpers/errors'
import * as types from '../types'
import { ClassificationLocations, MeasurementLocationName, Taxonomy } from '../types/measurement'
import { Fetcher } from './fetcher'
import { SizeRecommendation } from './responses'

export class TfrShop {
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

  public async getRecommendedSizes(styleId: string) {
    if (!this.isLoggedIn) throw new Errors.UserNotLoggedInError()

    try {
      const res = await Fetcher.Get(this.user, `/styles/${styleId}/recommendation`)
      const data = (await res.json()) as SizeRecommendation

      if (!data?.fits?.length || !data?.recommended_size?.id) return null

      return data
    } catch (error) {
      if (error?.error === Errors.AvatarNotCreated) throw new Errors.AvatarNotCreatedError()

      throw error
    }
  }

  public async submitTelephoneNumber(tel: string) {
    const sanitizedTel = tel.replace(/[^\+0-9]/g, '')
    const res = await Fetcher.Post(this.user, '/ios-app-link', { phone_number: sanitizedTel }, false)
    console.log(res)
  }

  public async getColorwaySizeAssetFromSku(colorwaySizeAssetSku: string) {
    const assets = await this.getColorwaySizeAssets(null, [colorwaySizeAssetSku])
    if (!assets?.size) throw new Errors.NoColorwaySizeAssetsFoundError()

    return Array.from(assets.values())[0]
  }

  public async getMeasurementLocationsFromSku(sku: string): Promise<string[]> {
    const asset = await this.getColorwaySizeAssetFromSku(sku)
    const styleCategory = await this.getStyleCategory(asset.style_id)
    const classificationLocation = Taxonomy[styleCategory.category]?.[styleCategory.sub_category] || null

    return classificationLocation
      ? ClassificationLocations[classificationLocation].map((location) => MeasurementLocationName[location])
      : null
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

  private async getStyleCategory(styleId: number) {
    try {
      const doc = await this.firebase.getDoc('style_categories', String(styleId))

      return doc as types.FirestoreStyleCategory
    } catch (error) {
      return getFirebaseError(error)
    }
  }
}

export const initShop = (brandId: number, env: string = 'dev') => {
  if (env === 'dev' || env === 'development') console.warn('TfrShop is in development mode')

  Config.getInstance().setEnv(env)
  return new TfrShop(brandId, new Firebase())
}
