import path from "path";
import fse from "fs-extra";
import { expect } from "chai";
import {
  createMd5Stream,
  createSha1HashStream,
  createSha256Stream,
} from "../security";
import { getLauncherAppPath } from "../../launcher/file";

describe(`Hash file testing`, () => {
  const dummyTextPathName = path.join(
    getLauncherAppPath(),
    "hashes",
    "buffer.txt"
  );

  before(() => {
    /**
     * Create a new text file contains a string with value "a"
     */
    if (!fse.pathExistsSync(path.dirname(dummyTextPathName))) {
      fse.emptyDirSync(path.dirname(dummyTextPathName));
    }
    fse.writeFileSync(dummyTextPathName, "a", "utf-8");
  });

  it(`should match with provided sha1 file`, function (done) {
    let inBuffer = fse.createReadStream(dummyTextPathName);
    let hash = createSha1HashStream(inBuffer);

    /**
     * The buffer must be close before using
     */
    inBuffer.on("close", () => {
      expect(hash.digest("hex")).to.be.eq(
        `86f7e437faa5a7fce15d1ddcb9eaeaea377667b8`
      );
      done();
    });
  });

  it("should match with provided sha256 file", function (done) {
    let inBuffer = fse.createReadStream(dummyTextPathName);
    let hash = createSha256Stream(inBuffer);

    inBuffer.on(`close`, () => {
      expect(hash.digest("hex")).to.eq(
        `ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb`
      );

      done();
    });
  });

  it("should match with provided md5 file", function (done) {
    let inBuffer = fse.createReadStream(dummyTextPathName);
    let hash = createMd5Stream(inBuffer);

    inBuffer.on(`close`, () => {
      expect(hash.digest("hex")).to.eq(`0cc175b9c0f1b6a831c399e269772661`);

      done();
    });
  });
});
