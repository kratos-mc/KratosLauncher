import { expect } from "chai";
import fse from "fs-extra";
import path from "path";
import { resolveManifest } from "../manifest";
import { getVersionsPath } from "../versions";

describe("Version manifest ", function () {
  /**
   * The resolve function may be slow since it is fetching from server.
   */
  this.slow();

  before(() => {
    // Make a directory before executing tests
    if (!fse.existsSync(getVersionsPath())) {
      fse.mkdirSync(getVersionsPath());
    }
  });

  it(`should resolve from nothing (no cache existed)`, function (done) {
    this.slow();
    resolveManifest()
      .then((searchEngine) => {
        expect(searchEngine.get(searchEngine.getLatestRelease())).not.to.be
          .undefined;
        expect(searchEngine.get(searchEngine.getLatestSnapshot())).not.to.be
          .undefined;

        // Some major Minecraft version test
        const assertionMajorVersionList = ["1.7", "1.8", "1.9", "1.10", "1.11"];
        expect(
          assertionMajorVersionList
            .map((version) => {
              return searchEngine.has(version);
            })
            .every((value) => value)
        ).to.be.true;
      })
      .then(done)
      .catch(done);
  });

  it(`should throw error when resolve without parent`, function (done) {
    // Trying to remove the path
    if (fse.existsSync(getVersionsPath())) {
      fse.removeSync(getVersionsPath());
    }

    resolveManifest().catch((err) => {
      expect(err.message).to.be.match(/Unable to load parent directory+/);

      // Then , remake a directory
      if (!fse.existsSync(getVersionsPath())) {
        fse.mkdirSync(getVersionsPath());
      }
      done();
    });
  });
});
