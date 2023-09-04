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

// await for the avatar creation
// Returns boolean on whether the avatar is created or not after the configured `avatarTimeout` period
shop.awaitAvatarCreated()
```

#### Shop

We'll make references to `sku` several times here. This is the unique identifier that matches a styles particular size
from your inventory to our system.

```typescript
// A good first step would be to ensure your style and size exists in the fitting room system before executing any of the
// following functions. You'll get back some data about the style(s), such as the ID of the style, which you can use
// for the getRecommendedSizes function below.
// ids: number[] or skus: string[]
// At least one parameter must not be null
shop.getStyles(ids, skus)

// get recommended sizes for a particular style
// The styleID can be extracted from the previous getStyles function call.
const sizeRecommendation = shop.getRecommendedSizes(styleID)

// get recommended sizes label for a particular style
// returns: { recommendedSizeLabel, availableSizeLabels }
// recommendedSizeLabel: string
// availableSizeLabels: string[]
const { recommendedSizeLabel, availableSizeLabels } = shop.getRecommendedSizesLabels(styleID)

// Once the user has downloaded the mobile application and has created an avatar, they may now virtually try on a size.
// The size they try on must be one of the recommended sizes from the previous function call. or an error will get returned.
// returns frames: types.TryOnFrames
// These `frames` are images that can be used to cycle through the VTO 360 degrees.
// NOTE: this process can take a minute or two
const frames = await this.shop.tryOn(sku)
```

#### Errors

```typescript
NoFramesFoundError
RequestTimeoutError
UserNotLoggedInError
NoColorwaySizeAssetsFoundError
NoStylesFoundError
RecommendedAvailableSizesError
BrandUserIdNotSetError
```
