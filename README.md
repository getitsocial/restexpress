# Restexpress

Restexpress is a highly customizable REST backend and API generator.
It is based on NodeJS, expressJS, MongoDB+Mongoose and Redis

- RESTful - follows best practices
- Babel with ESLint 
- Unit/Integration tests with Jest
- Automatic documentation generation using Github Actions and JSdoc
- Config based ACL for all routes
- Fully fletched user management with E-Mail verification and password resets
- First and third party authentication
- Custom mongoose plugins, including pagination and ownership

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Docs](#api)
- [Support](#support)
- [Contributing](#contributing)

## Installation

```sh
git clone git@github.com:tguelcan/restexpress.git
cd restexpress
yarn
```
You will also need a running redis and mongo instance.
Example Docker compose file:

```yml
version: "3.8"
services:
    mongo:
        image: mongo:4.2.5
        ports:
            - "27017:27017"
    redis:
        image: redis:5.0.8
        ports:
            - "6379:6379"
```

## Todo

- More unit/integration tests
- Fix Jest to enable parallel tests
- Write documentation (jsdoc, swagger, apidoc?)
- Finish this readme:D

## Usage

TODO:

## Support

Please [open an issue](https://github.com/tguelcan/restexpress/issues/new/choose) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/tguelcan/restexpress/compare).