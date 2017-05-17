"use strict";

require("./index.html");

import UserID from "../../lib/UserID.ts";

window["_UserID"] = new UserID({
  IPUrl: "//ssp.rambler.ru/userip",
});

let ID = window["_UserID"].getID();

window.document.write("User ID: " + ID);

window["_UserID"].getAccurateID().then((_ID) => {
  window.document.write("User ID: " + ID + "<br/>User Accurate ID: " + _ID);
});