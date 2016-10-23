# Utils
Unique user ID

## Build
The repository contains pre-compiled files, but if you want to add your files and compile, then run the following commands in the repository folder.
* npm install
* npm run production

or

* npm run development

The build required NodeJs version 6 or higher.

## Usage

```TypeScript
import Utils from "Utils.ts";

let ID = (new Utils()).getID();
```

or

```JavaScript
let Utils = required("Utils.js");

let ID = (new Utils()).getID();
```