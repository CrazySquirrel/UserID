"use strict";

require("./index.html");

let UserID = require("../../lib/UserID.ts");

window["_UserID"] = new UserID();

window.document.write("User ID: " + window["_UserID"].getID());
