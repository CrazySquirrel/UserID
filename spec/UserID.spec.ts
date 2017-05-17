"use strict";

declare let describe: any;
declare let it: any;
declare let expect: any;
declare let require: any;

import UserIDClass from "../lib/UserID";

const UserID = new UserIDClass();

let ID;

describe("UserID", () => {

  it("UserID", () => {
    expect(typeof(UserIDClass)).toEqual("function");
    expect(typeof(UserID)).toEqual("object");
  });

  it("UserID.getID", (done) => {
    const result = UserID.getID();
    expect(typeof(result)).toEqual("string");

    setTimeout(
        () => {
          ID = UserID.getID();
          expect(typeof(ID)).toEqual("string");
          done();
        },
        3000,
    );
  });

  it("UserID.getAccurateID", (done) => {
    UserID.getAccurateID().then((result) => {
      expect(typeof(result)).toEqual("string");
      expect(result).toEqual(ID);
      done();
    });
  });
});
