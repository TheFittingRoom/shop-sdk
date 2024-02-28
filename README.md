# The Fitting Room - Shop SDK

### Installation

```bash
npm i @thefittingroom/shop-sdk
```

or

```bash
yarn @thefittingroom/shop-sdk
```

### Build

```bash
npm run build
```

or

```bash
yarn build
```

### Development

```bash
npm run watch
```

or

```bash
yarn watch
```

## Usage

```typescript
import { initShop } from '@thefittingroom/sdk'

// Your brandId: Number
const brandId = 9001

// The environment: 'development', 'dev', 'production', 'prod'
const env = 'dev'
const shop = initShop(brandId, env)
```

### Shop API

#### Auth

```typescript
// Hook used to check authentication, return isLoggedIn Promise<boolean>
await shop.onInit()

// Login user with session
shop.user.login(email, password)

// Logout current user
shop.user.logout()

// Set the brand userId, the internal userId used by the shop/brand
// This is a required field for requesting a VTO
// string | number
shop.user.setBrandUserId(brandUserId)

// In order for the user to create an avatar, they'll need to download the mobile application.
// This will send an SMS to the given phone number with a link to the iOS app
// No spaces and must include country code e.g. +18005551234
shop.submitTelephoneNumber(tel)
```

#### Shop

We'll make references to `sku` several times here. This is the unique identifier that matches a styles particular size
from your inventory to our system.

```typescript
// get the garment measurement locations for a particular style
// This is used to pre-populate the size recommendation table with data before the user is logged into The Fitting Room
// sku: string
// returns: string[]
const locations = await shop.getMeasurementLocationsFromSku(sku)

// A good first step would be to ensure your style and size exists in the fitting room system before executing any of the
// following functions. You'll get back some data about the style, such as the ID of the style, which you can use
// for the getRecommendedSizes function below.
// sku: string
// returns: FirestoreColorwaySizeAsset
const colorwaySizeAsset = await shop.getColorwaySizeAssetFromSku(sku)

// get recommended sizes for a particular style
// The styleId can be extracted from the previous getColorwaySizeAssetFromSku function call.
// styleId: string
// returns: SizeRecommendation
const sizeRecommendation = shop.getRecommendedSizes(styleId)
```

[Types Reference](https://github.com/TheFittingRoom/shop-sdk/blob/main/src/types/index.ts)

#### Errors

```typescript
AvatarNotCreatedError
UserNotLoggedInError
NoColorwaySizeAssetsFoundError
```
