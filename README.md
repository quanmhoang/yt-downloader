### Prerequisites ###

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/)

## Branching and commits

- Branch names
  - Use dashes for spaces, **_NOT_** underscores.
  - All lowercase.
  - No leading directory shenanigans.
    - Please, just start the branch name with the jira issue number.
    - Pretty and neat please.
  - Naming convention: `{jira issue#}-{short-description}`
    - No issue number? Use `{dev initials}{random number}-{short-description}`
  - DO: 
    - `mws27-apply-jwt-verification`
    - `qh15-my-special-playground`
  - DO NOT: 
    - `mws15-Generic-Confusing-Names-Branch`
    - `quanminhhoang25-this-is-a-very-long-branch-name`
    - `dev\qhoang\2020-Jan\mws24-this-is-a-directory-branch-name`

- Commits
  - Follow conventional commit: https://www.conventionalcommits.org/en/v1.0.0/#specification

- Cleanup
  - Delete your branch from the repository as soon as you can after the branch has been released to production or is otherwise no longer necessary. (Infras will be automatically destroyed after branch is deleted)

## Installation

* `git clone <this-repository-url>`
* change into the new directory
* `npm install`

## Running / Development

* Go to: https://d-906742c5c1.awsapps.com/start#/

* Open myria-net-nonprod
* Click ` Command line or programmatic access`
* Setup your AWS credentials following the options provided
* `npm run dev`

Root URL  
Visit [http://localhost:8080/api/v0.1.0/auth](http://localhost:8080/api/v0.1.0/auth)

Default Route - Health check - Can be used for adding a service health check logic  
Visit [http://localhost:8080/](http://localhost:8080/)

## For debugging TS
* Enable Auto Attach by Ctrl + Shift + P => Toggle Auto Attach => Always => Restart VSCode
* `nodemon src/server.ts`
* Go To run and debug and you're good to go

## Build

`npm run build`

Uses Gulp [Gulp](https://gulpjs.com/) for TypeScript build

## Section for Automated CI/CD here

#### FOLDER STRUCTURE

```
config
└───prod
│   prod_config
└───test
│   test_config
└───uat
│   uat_config
deployment
locales
│   english-us
logger
│   winston-logger-setup  
src
└───boot
│   └───initializers
│         initializer-1
│         initializer-2
│         ...
│   boot-file
└───controllers
│     controller-1
│     controller-2
│     ...
└───middlewares
│     middleware-1
│     middleware-2
│     ...
└───models
│     model-1
│     model-2
│     ...
└───routes
│     route-1
│     route-2
│     ...
└───services
│     service-1
│     service-2
│     ...
└───utils
│     util-1
│     util-2
│     ...
└───tests
│     test-1
│     test-2
│     ...
```
