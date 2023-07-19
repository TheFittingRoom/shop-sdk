export type TryOnFrames = string[]

export enum AvatarState {
  NOT_CREATED = 'NOT_CREATED',
  CREATED = 'CREATED',
  PENDING = 'PENDING',
}

export interface FirestoreColorwaySizeAsset {
  id: number
  size_id: number
  style_id: number
  colorway_id: number
  colorway_name: string
  sku: string
}

export interface FirestoreGarmentMeasurement {
  id: number
  garment_measurement_location: string
  tolerance: number
  value: number
}

export interface FirestoreSize {
  id: number
  size: string
  label: string
  size_system: string
  size_value_id: string
  garment_measurements: Map<string, FirestoreGarmentMeasurement>
}

export interface FirestoreColorway {
  id: number
  name: string
}

export interface FirestoreStyle {
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

export interface FirestoreFrames {
  colorway_size_asset_id: number
  frames: TryOnFrames
}

export interface FirestoreVTO {
  [key: number]: Record<string, FirestoreFrames>
}

export interface FirestoreUser {
  avatar_frames: string[]
  avatar_status: AvatarState
  brand_id: number
  date_of_birth: string
  first_name: string
  is_admin: boolean
  is_approved: boolean
  job: string
  last_name: string
  vto: FirestoreVTO
}
