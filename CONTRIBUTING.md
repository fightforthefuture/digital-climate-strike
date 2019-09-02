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

[TravisCI](https://travis-ci.com/fightforthefuture/digital-climate-strike/branches) is set up to build the widget and upload it to Google Cloud Storage on every commit to the master branch.

## Development Docker container

If you don't have (or don't want to use) a NodeJS environment available locally, you can use simple Docker container shipped in the repository.

Follow these steps:

1. Install `docker` tool using [instruction for you platform](https://docs.docker.com/install/)
2. Go to the project directory and start the container using `docker-compose up` command. The first start will be slower, because the container has to be built.
3. See built project at [http://127.0.0.1:8080](http://127.0.0.1:8080)

You can modify settings by editing `docker-compose.yml` file. The container needs to be rebuilt afterwards

## Localization

The widget can be localized, including the date format. Following changes are needed:

- `src/index.js`: constants `LOCALE_CODE_MAPPING` and `GLOBAL_CLIMATE_STRIKE_URLS` (only if there's relevant language version of https://globalclimatestrike.net/ site) need to be adjusted. For language codes, please refer to https://gist.github.com/wpsmith/7604842
- `webpack.common.js`: edit `plugins` array and add a new HtmlWebPackPlugin instance based on your language code
- copy file `src/translations/en.yml` to `src/translations/<your-code>.yml` and translate it
- `static/widget.js`: edit `getLanguage()` function to add default language resolution for your langcode
- `README.md`: add entry about your langcode to comment above `language` property

After the new language code is merged, `dist/index-<your-code>.html` file is built, which allows you to use the laguage via instructions in the README.md file.

# Dev Notes

- We use [BEM](http://getbem.com/) for CSS class structure
