# tram_finder

This is a simple finder for each tram cars (with car no.) in Hong Kong Tramways. The mechanism is simple, by getting the estimated time of arrival (ETA) of each stop, and determine the "next stop" position of each tram car by looking at the car number in the ETA XML.

However, as the ETA provided by HK Tramways has found to be unrealiable (as reported by some users), this finder has become unusable. This project is placed in Github solely for studying purpose.

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```