"use strict";

require("./index.html");

let UserID = require("../../lib/UserID.ts");

window["_UserID"] = new UserID({
  IPUrl: "//ssp.rambler.ru/userip",
});

window.document.write("User ID: " + window["_UserID"].getID());
