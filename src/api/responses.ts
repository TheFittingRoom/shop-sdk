// Code generated by tygo. DO NOT EDIT.

//////////
// source: avatar.go

export interface BodyMeasurement {
  id: number /* int64 */;
  position: number /* int64 */;
  value: number /* float64 */;
}
export interface Avatar {
  id: number /* int64 */;
  user_id?: string;
  brand_id?: number /* int64 */;
  recorded_video_storage_path?: string;
  height_cm?: number /* float64 */;
  weight_kg?: number /* float64 */;
  gender?: string;
  skin_tone_hex?: string;
  skin_tone_fac?: number /* float64 */;
  body_measurements?: BodyMeasurement[];
}

//////////
// source: brand.go

export interface Brand {
  id: number /* int64 */;
  name: string;
  business_number: string;
  logo_storage_path: string;
  country_code: string;
  about: string;
  why_tfr: string;
  specialty: string;
  phone_number: string;
}

//////////
// source: collection.go

export interface Collection {
  id: number /* int64 */;
  brand_id: number /* int64 */;
  external_id: string;
  name: string;
  description: string;
}

//////////
// source: colorway.go

export interface Colorway {
  id: number /* int64 */;
  sku: string;
  size_id: number /* int64 */;
  folder_storage_path: string;
  obj_file_name: string;
  mtl_file_name: string;
  texture_folder_name: string;
}

//////////
// source: common.go

export interface ID {
  id: number /* int64 */;
}
export interface UserID {
  user_id: string;
}
export interface UpdatedAt {
  updated_at: any /* time.Time */;
}
export interface PublishedAt {
  published_at: any /* time.Time */;
}

//////////
// source: invitation.go

export interface Invitation {
  email: string;
  first_name: string;
  last_name: string;
  expires_at?: any /* time.Time */;
}

//////////
// source: size_recommendation.go

export interface SizeRecommendationIDs {
  recommended_size_id: number /* int64 */;
  available_size_ids: number /* int64 */[];
}
export interface SizeRecommendation {
  recommended_sizes: Size;
  available_sizes: Size[];
}

//////////
// source: style.go

export interface GarmentMeasurement {
  id: number /* int64 */;
  garment_measurement_location: string;
  value: number /* float64 */;
  tolerance: number /* float64 */;
}
export interface Size {
  id: number /* int64 */;
  size_value: SizeValue;
  label?: string;
  garment_measurements?: GarmentMeasurement[];
}
export interface SizeValue {
  id: any /* enums.SizeValueID */;
  size: string;
  size_system: string;
}
export interface GarmentCategory {
  id: number /* int64 */;
  garment_category: string;
  garment_subcategory: string;
}
export interface Style {
  id: number /* int64 */;
  brand_id?: number /* int64 */;
  brand_style_id: string;
  collection_id: number /* int64 */;
  name?: string;
  description?: string;
  sale_type?: string;
  garment_category?: GarmentCategory;
  sizes: Size[];
}

//////////
// source: user.go

export interface User {
  id: string;
  brand_id: number /* int64 */;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: any /* time.Time */;
  job: string;
}