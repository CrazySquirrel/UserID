
# UserID

[![npm version](https://badge.fury.io/js/UserID.svg)](https://github.com/CrazySquirrel/UserID)
[![Code Climate](https://codeclimate.com/github/CrazySquirrel/UserID/badges/gpa.svg)](https://codeclimate.com/github/CrazySquirrel/UserID)
[![Test Coverage](https://codeclimate.com/github/CrazySquirrel/UserID/badges/coverage.svg)](https://codeclimate.com/github/CrazySquirrel/UserID/coverage)
[![Issue Count](https://codeclimate.com/github/CrazySquirrel/UserID/badges/issue_count.svg)](https://codeclimate.com/github/CrazySquirrel/UserID)
[![Donate](https://img.shields.io/badge/donate-%E2%99%A5-red.svg)](http://crazysquirrel.ru/support/)

Unique user ID generator.

## Build

The repository contains pre-compiled files, but if you want to add your
files and compile, then run the following commands in the repository folder.

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

Note that when you first start the module it needs some time to calculate
finally UID.

So initialize it in the first time as early as possible in the code.