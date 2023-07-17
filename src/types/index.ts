export type TryOnFrames = string[]

export enum AvatarState {
  NOT_CREATED = 'NOT_CREATED',
  CREATED = 'CREATED',
  PENDING = 'PENDING',
}

export type FirestoreColorwaySizeAsset = {
  id: number
  size_id: number
  style_id: number
  colorway_id: number
  colorway_name: string
  sku: string
}

export type FirestoreGarmentMeasurement = {
  id: number
  garment_measurement_location: string
  tolerance: number
  value: number
}

export type FirestoreSize = {
  id: number
  size: string
  label: string
  size_system: string
  size_value_id: string
  garment_measurements: Map<string, FirestoreGarmentMeasurement>
}

export type FirestoreColorway = {
  id: number
  name: string
}

export type FirestoreStyle = {
  id: number
  brand_id: number
  brand_style_id: string
  name: string
  description: string
  garment_category: string
  is_published: boolean
  sale_type: string
  colorways: { [key: number]: FirestoreColorway }
  sizes: { [key: number]: FirestoreSize }
}
