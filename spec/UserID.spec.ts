"use strict";

declare let describe: any;
declare let it: any;
declare let expect: any;
declare let require: any;

import UserIDClass from "../lib/UserID";

let UserID = new UserIDClass();

describe("UserID", () => {

  it("UserID", (done) => {
    expect(typeof(UserIDClass)).toEqual("function");
    expect(typeof(UserID)).toEqual("object");

    let result = UserID.getID();
    expect(typeof(result)).toEqual("string");

    setTimeout(
        () => {
          let _result = UserID.getID();
          expect(typeof(_result)).toEqual("string");

          done();
        },
        3000
    );
  });
});
