"use strict";
declare var require: any;
require("./index.html");

let UserID = require("../../lib/UserID.js");
window.document.write("User ID: " + (new UserID()).getID());
