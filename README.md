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
shop.user.login(username, password)

// Logout current user
shop.user.logout()

// Submit telephone number for link to iOS app
// No spaces and must include country code e.g. +18005551234
shop.submitTelephoneNumber(tel)
```

#### Shop

```typescript
// returns frames: types.TryOnFrames
shop.tryOn(colorwaySizeAssetSku)

// await for the avatar creation
shop.awaitAvatarCreated()

// get recommended sizes for use
shop.getRecommendedSizes()

// get available styles by ids: number[] or skus: string[]
shop.getStyles(ids, skus)
```

#### Errors

```typescript
NoFramesFoundError
RequestTimeoutError
UserNotLoggedInError
NoColorwaySizeAssetsFoundError
NoStylesFoundError
RecommendedAvailableSizesError
```
