## Contributing to this repository

The widget is made of two parts:

1. [widget.js](https://github.com/global-climate-strikes/digital-climate-strike/blob/master/static/widget.js) is injected into the host site and handles loading the widget iframe, ideally with minimal changes to the parent frame. This file is intentionally unminified, so it's easy for hosts to read and understand it.
2. The main widget iframe, which is compiled by webpack from the files in [src](https://github.com/global-climate-strikes/digital-climate-strike/tree/master/src). The iframe gets all babeled up and minified into a single file, with the goal of keeping the final asset as small as possible. 

## Requirements 

- (NodeJS)[https://nodejs.org/en/download/]. The project has been built on Node version 10.16.*

## Build Setup

```
# install dependencies
$ npm install

# serve with hot reload at localhost:8080. Test the iFram with localhost:8080/demo.html.
$ npm run dev

# build for production
$ npm run build
```

## Linting

We have basic linting configured to run on `src/index.js` as part of the Travis CI build. You can check this locally before pushing with:

```
$ npm run lint
```

## Automated Deploys

[TravisCI](https://travis-ci.com/global-climate-strikes/digital-climate-strike/branches) is set up to build the widget and upload it to Google Cloud Storage on every commit to the master branch.

# Dev Notes

- We use [BEM](http://getbem.com/) for CSS class structure
