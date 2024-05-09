# Facebook Instant Game with react

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Make sure to create your game on https://developers.facebook.com/apps and get to the point of having an Instant Game with an app ID. You will also need to create an upload token.

## Installation

1. Make sure `yarn` is installed on your machine.

2. `yarn install`

3. Update `.env` with your app's ID

## Running tests

`yarn test`

## Running locally with mocked facebook API

TODO: remove the manual process for this - can this be a script?

1. In `index.html`, replace

   ```html
   <script src="https://connect.facebook.net/en_US/fbinstant.7.1.js"></script>
   ```

   with

   ```html
   <script src="mock/fbinstant.6.2.mock.js"></script>
   ```

   (don't check this in to version control!)

2. `yarn start` - this opens http://localhost:3000

## Running locally with real facebook API

TODO: remove the manual process for this - can this be a script?

1. Make sure `index.html` is using the real version of fbinstant, not the mock (see above).

2. `HTTPS=true yarn start` - this opens https://localhost:3000 (but that window won't have access to the FBInstant API)

3. (Only need to do once) Tell your browser to unsafely allow connection to https://localhost:3000

4. Open https://www.facebook.com/embed/instantgames/your_app_ID_here/player?game_url=https://localhost:3000 (with your app ID instead of "your_app_ID_here")

## Uploading to facebook web hosting

1. Create `env.local` in this directory:

   ```
   FB_UPLOAD_TOKEN="[token goes here]"
   ```

   Never check this into version control - this is a secret!

2. Run `yarn upload`

## Advanced usage

This was created with create-react-app, and therefore it has babel, webpack and eslint configured automatically. If you need to customize these things, you may need to eject with `yarn eject`. Make sure to read [the documentation](https://create-react-app.dev/docs/available-scripts#npm-run-eject) first.

## Limitations

### Some issue with strip-ansi

In package.json we had to add

```
  "resolutions": {
    "strip-ansi": "6.0.0"
  },
```

to work around an issue. Maybe there's a nicer fix?
