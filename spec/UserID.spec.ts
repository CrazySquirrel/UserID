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
    expect(result instanceof String).toEqual(true);

    setTimeout(
        () => {
          ID = UserID.getID();
          expect(ID instanceof String).toEqual(true);
          done();
        },
        3000,
    );
  });

  it("UserID.getAccurateID", (done) => {
    UserID.getAccurateID().then((result) => {
      expect(result instanceof String).toEqual(true);
      expect(result).toEqual(ID);
      done();
    });
  });
});
