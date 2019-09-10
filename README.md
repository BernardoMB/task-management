<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://api.travis-ci.org/nestjs/nest.svg?branch=master" alt="Travis" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://img.shields.io/travis/nestjs/nest/master.svg?label=linux" alt="Linux" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#5" alt="Coverage" /></a>
<a href="https://gitter.im/nestjs/nestjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge"><img src="https://badges.gitter.im/nestjs/nestjs.svg" alt="Gitter" /></a>
<a href="https://opencollective.com/nest#backer"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
  <a href="https://twitter.com/nestframework"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## Database

This project uses TypeORM in order to query and manage the data. See official documentation [here](https://typeorm.io).

Install the following packages:

```bash
$ npm install @nestjs/typeorm typeorm pg --save
```

- **@nestjs/typeorm**: The bridge NestJS has created to work with TypeORM.
- **typeorm**: Actual TypeORM NPM module.
- **pg**: Database driver for Postgres.

## Tokens

This project is using the following packages for authentication mechanism:

```bash
$ npm install @nestjs/jwt @nestjs/passport passport passport-jwt --save
```

- **@nestjs/jwt**: NestJS module for working with Json Web Tokens (JWT).
- **@nestjs/passport**: NestJS wrapper for implementing Passport middleware.
- **passport**: Pasport library. It is an authentication middleware for NodeJs and it supports mutiple authentication strategies. It helps implementing authentication in a very easy way doing lots for us under the hood based on the token, the user and the resquest object.
- **passport-jwt**: Configuring Passport to use jwt tokens.

The authentication module may be adepted to work in a similary way the Finero Core Server's authentication module does.

## Logs

Using @nestjs/common logger. See official NestJS documentation on logging.

## Configuration

The environment is the mode in which the application will run (development, staging, production, etc). Applications should be configured accordingly to the desired environment in which they are intended to run on.

### Environment Variables

Environment variables are used to configure the application accordingly to its desired environment.

These variables are set up via NPM scripts. This is not supported in Windows by default. To overcome this, install the win-node-env NPM package globally:

```bash
$ npm install -g win-node-env
```

NODE_ENV is an environment variable and it is used to determine the mode in which the application will run (development, staging, production, etc).

### Configuration

Configuration is the central way of defining values that are loaded upon starting the application (should not be changed during runtime).

Special configuration may be set per environment:

- **development**: configuration specific to the development environment.
- **staging**: configuration specific to the staging environment.
- **production**: configuration specific to the production environment.

Configuration can be defined in the code base (code inside the repository). This is useful when working with multiple developers via version control. Your configuration should always work for the code it ships with.

To define configuration in the code base this repository uses the following package:

```bash
$ npm install config --save
```

Configuration can also be defined in many ways (JSON, YAML, XML, Environment variables, etc), using custom solutions or open-source libraries.

By default, NodeJS applications are run with the environment variable NODE_ENV set to undefined. If NODE_ENV is set to undefined, then the Config package will load the development configuration and the rest of the environment and configuration variables should be set accordingly.

### Codebase VS Environment Variables for configuration

Configuration may be defined in the code base of the application. For example, in a **config** folder inside the **code base** of the repository.

Configuration may also be defined via **environment variables** (which are provided when running the application).

Which option should be used? The answer is both.

Non-sensitive information such as the port to run the application will be defined in the code base of the repository.

Sensitive information such as database username and password **production mode** will be provided via environment variables upon running the application.

The configuration is defined in _config/_.

In order to define environment variables the application will be run in the following way:

```bash
$ PORT=3001 npm run start:dev
```

Here the application will use by default the development configuration and the PORT will be set to 3001.

## CORS

This application may be consumed by a client application. The origin of the front-end application that consumes this API may be the same as the origin from which this API is served.

For example, this application may run on _localhost:3000_ and the front-end application may be served by _localhost:3001_. In this case the origin of the front-end application is not the same as the origin of this NestJS application. By default NestJs applications only allow incoming request from the same origin. To fix this, we need to allow request from different origins in this NestJS application. To do so, Cross Origin Request Sharing (CORS) should be enabled.

This application will have CORS enabled only for development mode (development environment). For production mode, this application will only allow incoming requests from the whitelisted origins, which will be the origin from which the front-end application will be served.

## Banking

The bank comunication will be handled in a similar way the Product Server's RPM service does.

## Front-end Application

The front application that consumes this API can be found [here](https://github.com/BernardoMB/task-management-frontend).

There is a front-end application using React deployed via Amazon S3 service. Please see the [video](https://www.udemy.com/nestjs-zero-to-hero/learn/lecture/15044214#overview) explaining how to host a website using Amazon S3 service.

## Deployment

Before Deploying to Production it is highly recommended to run the preprod:prod script.

There could be some minor issues with import paths that still work in development mode. This is especially common when auto-importing files.

It is very easy to catch these issues with this NPM command, as it builds the application into JavaScript. If any errors show up, they should be very easy to fix (otherwise, use the Q&A section here).

Skipping this process may cause the errors to only appear after deploying the application to AWS, it will be annoying and will take a long time to debug and understand what exactly went wrong.

Run the following command:

```batch
$ npm run prestart:prod
```

Some development dependencies need to be moved over to dependencies

- @types/express
- @types/node
- ts-node
- typescript

This application is deployed using Amazon's Elastic Beanstalk through their web interface. Elastic Beanstalk allow developers to deploy applications with multiple environment, it will configure the login, load balancer, networking, security groups automatically. It can also setup a database apart from the deployment and environment variables aport from the deployment. An application deployed using Elastic Beanstalk can make use of EC2, VPC, Cloud Watch, and a lot of AWS services that have to be configured manually. With Elastic Beanstalk everything can be configured manually and will be set up as a part of the deployment. When an instance of Elastic Beanstalk is deleted, all of its dependencies such as EC2 and load balancers will be also deleted.

The name of the Elastic Beanstalk instance is **task-management-nestjs-app**.

Please see the [video](https://www.udemy.com/nestjs-zero-to-hero/learn/lecture/15046592#overview) to deploy the application.

Passwords and sensible information is stored in secret files.

## Testing

Tests are ran using Jest. By default, the test script is run with the following command:

```bash
$ npm run test
```

The tests for this application should be ran in development mode. So the test script is modified to be

```javascript
{
  [...]
  "test": "set NODE_ENV=development& jest",
  [...]
}
```

This command will run the jest command. The jest command by default sets the NODE_ENV environment variable as undefined by default. But this applications, in order to work needs to be run with NODE_ENV=development.

## TODO tasks for further development

- HTTPS for secure communication
- NestJS Techniques - MongoDB with Mongoose
- NestJS Techniques - File Upload
- NestJS - GraphQL Quickstart
- Create a domain names for AWS Applications
- Deployment using Elastic Beanstalk CLI