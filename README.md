[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]


<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/tguelcan/restexpress">
    <img src="https://fontmeme.com/permalink/200630/49d0f80c2242a75c9fe95ca87134c7cb.png" alt="Logo">
  </a>

  <h3 align="center">RESTexpress</h3>

  <p align="center">
    RESTexpress is a highly customizable REST backend and API generator.
    <br />
    <a href="https://github.com/tguelcan/restexpress"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/tguelcan/restexpress">View Demo</a>
    ·
    <a href="https://github.com/tguelcan/restexpress/issues">Report Bug</a>
    ·
    <a href="https://github.com/tguelcan/restexpress/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)



<!-- ABOUT THE PROJECT -->
## About The Project

RESTexpress is a highly customizable REST backend and API generator.

Here's why this is some cool shit:
* Your time should be focused on creating amazing features, not thinking about authentication, user management and project structure.
* You shouldn't have to implement simple CRUD operations over and over again.

Of course, no template will serve all projects since your needs may be different. So we made it easy to add your own mongoose plugins, services and middleware.


### Built With
* [NodeJS](https://nodejs.org)
* [Babel](https://babeljs.io)
* [ExpressJS](https://expressjs.com)
* [MongoDB](https://mongodb.com)
* [Redis](https://redis.io)


<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* [yarn](https://classic.yarnpkg.com/en/docs/install/#debian-stable)
* [mongoDB](https://docs.mongodb.com/manual/installation/)
* [redis](https://redis.io/download)

The easiest way to install mongoDB and redis is with docker. A simple docker-compose file would look like this:
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
### Installation

2. Clone the repo
```sh
git clone git@github.com:tguelcan/restexpress.git
```
3. Install dependencies
```sh
yarn
```
4. Enter your variables in `.env.example` and rename the file to `.env`


<!-- USAGE EXAMPLES -->
## Usage

Start the server with:
```sh
yarn run dev
```
If it succesfully started, the output should look like this:
[![yarn run dev screenshot][yarn-run-dev-screenshot]](http://0.0.0.0:8080)


You should now be able to see the [Documentation](http://0.0.0.0:8080/docs)


You can run tests with:
```sh
yarn run test
```
or 
```sh
yarn run test:coverage
```
to check the code coverage

## Adding routes / plugins / services

### Mongoose plugins

0. Read about [Mongoose Plugins](https://mongoosejs.com/docs/plugins.html)
1. Create your new plugin in `src/services/mongoose/plugins`
2. Make sure to export it in `src/services/mongoose/index.js`
3. Access the plugin in your model like this: 
```js
import { yourPlugin } from 's/mongoose'
```

### Adding routes

TODO: Endpoint generator


### Services
1. Create your new service in a separate folder in `src/services`
2. Import it when necessary with `s/yourservice`

<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/tguelcan/restexpress/issues) for a list of proposed features (and known issues)

Or take a look at the currently empty [project board](https://github.com/tguelcan/restexpress/projects/1)


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.


<!-- CONTACT -->
## Contact

Jonas Scholz - [@jscholz42](https://twitter.com/jscholz42)

Tayfun Gülcan - [@Tayfuuu](https://twitter.com/Tayfuuu)


<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [Img Shields](https://shields.io)
* [README Template](https://github.com/othneildrew/Best-README-Template)
* [Mongoose](https://github.com/Automattic/mongoose)
* [JWT](https://jwt.io/)
* [Swagger](https://swagger.io)
* [bodymen](https://github.com/diegohaz/bodymen)
* [querymen](https://github.com/diegohaz/querymen)
* [Jest](https://jestjs.io)
* [Sendgrid](https://sendgrid.com/)


[contributors-shield]: https://img.shields.io/github/contributors/tguelcan/restexpress.svg?style=flat-square
[contributors-url]: https://github.com/tguelcan/restexpress/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/tguelcan/restexpress.svg?style=flat-square
[forks-url]: https://github.com/tguelcan/restexpress/network/members
[stars-shield]: https://img.shields.io/github/stars/tguelcan/restexpress.svg?style=flat-square
[stars-url]: https://github.com/tguelcan/restexpress/stargazers
[issues-shield]: https://img.shields.io/github/issues/tguelcan/restexpress.svg?style=flat-square
[issues-url]: https://github.com/tguelcan/restexpress/issues
[license-shield]: https://img.shields.io/github/license/tguelcan/restexpress.svg?style=flat-square
[license-url]: https://github.com/tguelcan/restexpress/blob/master/LICENSE.txt
[yarn-run-dev-screenshot]: images/yarn-run-dev-screenshot.png
