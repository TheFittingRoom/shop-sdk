# The Fitting Room – Shop SDK

Modern ESM SDK for integrating **The Fitting Room** into Shopify storefronts.

* **Production-ready** bundle published to npm and the `unpkg` CDN.
* **Type-safe** API (written in TypeScript).
* Supports both **development** and **production** environments.

---

## ✨ Quick Start

```bash
# Stable / production build
npm install @thefittingroom/shop-sdk

# Next / development build
npm install @thefittingroom/shop-sdk@next
```

```ts
import { initShop } from "@thefittingroom/shop-sdk"

const brandId = 9001
// env = "prod" | "dev"
const shop   = initShop(brandId, "prod")
```

### Via CDN

```html
<!-- Latest production build -->
<script type="module" src="https://unpkg.com/@thefittingroom/shop-sdk@latest/dist/index.mjs"></script>

<!-- Specific version (recommended) -->
<script type="module" src="https://unpkg.com/@thefittingroom/shop-sdk@1.2.3/dist/index.mjs"></script>

<!-- Development build -->
<script type="module" src="https://unpkg.com/@thefittingroom/shop-sdk@next/dist/index.mjs"></script>
```

---

## 🔖 Semantic Versioning & Release Channels

This package follows [SemVer 2.0.0](https://semver.org/): **MAJOR.MINOR.PATCH**

* **MAJOR** – Breaking changes. Partners must opt-in to upgrade.
* **MINOR** – Back-compatible feature additions.
* **PATCH** – Back-compatible bug fixes.

### Automated release pipeline (GitHub Actions)

| Trigger | Workflow | Result |
|---------|----------|--------|
| Pull request → `main` | `PR Label Guard` | PR must carry `patch`, `minor`, or `major` label – otherwise CI fails and merge is blocked. |
| Merge → `main` | `Deploy to dev` | CI bumps version (according to PR label), publishes build to npm with `next` tag, and uploads assets to dev S3 bucket. |
| GitHub Release | `Production Release` | Tag (e.g. `v2.3.0`) is published to npm with `latest` tag and assets uploaded to prod S3 bucket. |

Guidelines for consumers:

```text
^1.x   → always safe (only minor/patches)
~1.2.0 → locks to patch updates only
1.2.3  → locks to a specific publish
```

## 🛠️ Scripts

| Command | Description |
|---------|-------------|
| `npm run build`  | Create production bundle in `dist/` |
| `npm run watch`  | Re-build on change (development) |

---

## 📚 API Overview

### Authentication

```ts
await shop.onInit()                 // isLoggedIn: boolean
shop.user.login(email, password)    // start session
shop.user.logout()                  // end session
shop.user.setBrandUserId(id)        // required for VTO
shop.submitTelephoneNumber('+18005551234')
```

### Shop helpers

```ts
const locations          = await shop.getMeasurementLocationsFromSku(sku)
const colorwaySizeAsset  = await shop.getColorwaySizeAssetFromSku(sku)
const sizeRecommendation = shop.getRecommendedSizes(styleId)
```

Full type definitions live in [`src/types`](./src/types/index.ts).

### Error classes

```ts
AvatarNotCreatedError
UserNotLoggedInError
NoColorwaySizeAssetsFoundError
```
