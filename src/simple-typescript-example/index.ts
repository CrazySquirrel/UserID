"use strict";

require("./index.html");

import UserID from "../../lib/UserID.ts";

window["_UserID"] = new UserID();

window.document.write("User ID: " + window["_UserID"].getID());
