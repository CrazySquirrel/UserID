"use strict";
declare let require: any;
require("./index.html");

let UserID = require("../../lib/UserID.ts");
window.document.write("User ID: " + (new UserID()).getID());
