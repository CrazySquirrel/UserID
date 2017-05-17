"use strict";

require("./index.html");

import UserID from "../../lib/UserID.ts";

window["_UserID"] = new UserID({
  IPUrl: "//ssp.rambler.ru/userip",
});

window.document.write("User ID: " + window["_UserID"].getID());
