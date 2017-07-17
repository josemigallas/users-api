# Users RESTful API[ ![Codeship Status for josemigallas/users-api](https://app.codeship.com/projects/017055e0-4b1b-0135-9499-6a83b1829c88/status?branch=master)](https://app.codeship.com/projects/232759)

> :warning: :alien: Due to [this Request issue](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18074) transpilation is failing. It is necessary to fix the bug manually in node_modules/@types/request/typings.d.ts first time after doing an npm install. This is what's causing the failure at deployment on Heroku and testing with Codeship.

This API allows all CRUDL operations over the dataset hosted in https://gist.githubusercontent.com/jasonmadigan/009c15b5dc4b4eccd32b/raw/34759c44e77d2f3515e20ed561cdd7a5e8345585/users.json.

## Reference
You can find a complete reference to the API in [our awesome Apiary](http://docs.users226.apiary.io/#).

## Usage
For normal production behaviour, first set ENV_NODE and then simply install dependencies and start it up by running the next command. Typescript transpilation is taken care of right after installation.
```
$ export ENV_NODE="production" && npm install && npm start
```
You should see this message:
```
Users API listening on port 3000 in production mode
```
In case you would like a fresh start, cleaning all generated files files run:
```
$ npm run clean
```

## Test Suite
Alongside unit tests, the suite also performs some testing over the API routes. For this, it is needed to start the app manually in development mode. Open a terminal and run:
```
$ export ENV_NODE="development" && npm install && npm start
```
You should see this message:
```
Users API listening on port 3000 in development mode
```
Then, open a different terminal and simply run:
```
$ npm test
```
