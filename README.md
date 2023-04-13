# tfr-library

the fitting room library

# Install node modules:

npm install

# Buid the changes

npm run build:rollup

# Build the changes in dev for each time that you save a file

npm run dev:rollup

# Serve the server

npx live-server

# Create .env file

FIREBASE_API_KEY=AIzaSyDfjBWzpmzb-mhGN8VSURxzLg6nkzmKUD8
FIREBASE_AUTH_DOMAIN=fittingroom-dev-5d248.firebaseapp.com
FIREBASE_PROJECT_ID=fittingroom-dev-5d248
FIREBASE_STORAGE_BUCKET=fittingroom-dev-5d248.appspot.com
FIREBASE_MESSAGING_SENDER_ID=2298664147
FIREBASE_APP_ID=1:2298664147:web:340bda75cd5d25f3997026
FIREBASE_MEASUREMENT_ID=G-B7GDQ1Y9LL
API_ENDPOINT = https://tfr.dev.thefittingroom.xyz/v1
LANGUAGE_URL=https://assets.dev.thefittingroom.xyz/shop-sdk/4200127/languages
ASSETS_URL=https://assets.dev.thefittingroom.xyz/shop-sdk/assets

# Access the fitting room library in your web

To access the fitting room library you have to use the minified version at: dist/cjs/main.js or dist/cjs/main.min.js. So, here are bundled all the changes of the fitting room library (read commands above to generate these changes)

You can access this library in your project by adding script tag at your html file, the code actually will be deployed here:
https://assets.dev.thefittingroom.xyz/shop-sdk/xxxxxx/main.min.js -> xxxxxx is the commit code that you can get at GitHub. For each merge in main or master a new xxxxxx will be generated and you have to update that code in your script if you want to get the latest changes. Of course this logic will be changed in the future.

If you want to access this library in your development process you have to run: "npm run dev:rollup", then open a new terminal and run "npx live-server". If this runs successfully then you can add this url: http://localhost:8080/dist/cjs/main.js?language=en or http://localhost:8080/dist/cjs/main.min.js?language=en in your script element.
Something like this: <!-- <script src="http://localhost:8080/dist/cjs/main.js?language=en" defer="defer"></script> -->

# Access the functions of the fitting room library in your web

You can access the functions of the fitting room library like this: window.thefittingroom.xxxx();

# Pass params to the functions of the fitting room library in your web

If you want to pass params at out functions you can simply do like this: window.thefittingroom.xxxx({name: 'John'});

# Modal functions of the fitting room library

window.thefittingroom.renderNoAvatarModal() -> it will render no avatar modal
window.thefittingroom.renderLoadingAvatarModal() -> it will render loading avatar modal
window.thefittingroom.renderSignInModal() -> it will render sign in modal
window.thefittingroom.renderForgotPasswordModal() -> it will render forgot password modal
window.thefittingroom.renderScanCodeModal() -> it will render scan code modal
window.thefittingroom.renderErrorModal() -> it will render erorr modal
window.thefittingroom.renderSuccessModal() -> it will render success modal
window.thefittingroom.renderResetLinkModal() -> it will render reset link modal
window.thefittingroom.closeModal() -> it will close the current modal

# Recommended size

window.thefittingroom.getRecommendedSizes({sku: 'test'}) -> it will get the results of the recommended size, and after you can use that result in your app

# Sign out

window.thefittingroom.signOut() -> it will sign out the user from the fitting room library

# Is logged in

window.thefittingroom.isLoggedIn() -> it will check if a user is logged in or not, so it return true or false

# Get user profile

window.thefittingroom.getUserProfile() -> you can get the user profile

# Listen to user profile

window.thefittingroom.listenToUserProfile() -> you can listen to user profile, which will trigger event for every time that something changes into the databse of that user

# Post frames

window.thefittingroom.virtualTryOnFrames({sku: '...'}) -> here you should pass the sku of the product and by that sku it will find the colorway id which then it will post frames with the specific colorway id

# tryOnWithTheFittingRoom

window.thefittingroom.tryOnWithTheFittingRoom({sku: '...'}) -> this is the starter function, so this function should be called when user press "Try on with The Fitting Room" button, so first it will check if user is not logged in it will open the sign in modal, if user it's already logged in it will post frames
  
# CSS classes

All our css class start with tfr-...

# tfr-element attribute

All our html elements that contains text have attribute tfr-element="true"

Apply font-family or other styles:
*[tfr-element=true] {
  font-family: "Test" !important;
}
