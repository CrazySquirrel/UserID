# UserID
[![npm version](https://badge.fury.io/js/UserID.svg)](https://github.com/CrazySquirrel/UserID)
[![Github All Releases](https://img.shields.io/github/downloads/CrazySquirrel/UserID/total.svg)](https://github.com/CrazySquirrel/UserID)
[![Travis branch](https://img.shields.io/travis/CrazySquirrel/UserID/master.svg)](https://github.com/CrazySquirrel/UserID)
[![license](https://img.shields.io/github/license/CrazySquirrel/UserID.svg)](https://github.com/CrazySquirrel/UserID)
[![npm version](https://img.shields.io/badge/donate-%E2%99%A5-red.svg)](http://crazysquirrel.ru/support/)

Unique user ID generator.

## Build
The repository contains pre-compiled files, but if you want to add your files and compile, then run the following commands in the repository folder.
* npm install
* npm run production

or

* npm run development

The build required NodeJs version 6 or higher.

## Usage

```TypeScript
import UserID from "UserID.ts";

let ID = (new UserID()).getID();
```

or

```JavaScript
let UserID = required("UserID.js");

let ID = (new UserID()).getID();
```

Note that when you first start the module it needs some time to calculate finally UID. So initialize it in the first
time as early as possible in the code.