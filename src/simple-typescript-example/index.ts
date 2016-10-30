"use strict";
declare var require: any;
require("./index.html");

import UserID from "../../lib/UserID.ts";
window.document.write("User ID: " + (new UserID()).getID());
