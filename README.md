# Users RESTful API
[![Build Status](https://travis-ci.org/josemigallas/users-api.svg?branch=master)](https://travis-ci.org/josemigallas/users-api)

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
Alongside unit tests, the suite also performs some testing over the API routes. For this, all you have to do is:
```
$ export ENV_NODE="development" && npm install && npm test
```

## CI / CD
Continuous integration it's been done by [Travis CI](https://travis-ci.org/josemigallas/users-api). It tracks every push and PR and un the full test suite.

Additionally, the app is being deployed on Heroku, both in development (when changes are pushed to `dev`) and production (when commits are merged into `master`).

Development deployment -> https://screener-users-api-development.herokuapp.com/
Production deployment -> https://screener-users-api-production.herokuapp.com/
