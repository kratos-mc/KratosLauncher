import { expect } from "chai";
import fse from "fs-extra";
import path from "path";
import { resetManifestCache, resolveManifest } from "../manifest";
import { getVersionsPath } from "../versions";

describe("Version manifest with existed parent", function () {
  /**
   * The resolve function may be slow since it is fetching from server.
   */
  this.timeout(10000);

  before(() => {
    // Make a directory before executing tests
    if (!fse.existsSync(getVersionsPath())) {
      fse.mkdirSync(getVersionsPath());
    }
  });

  after(async () => {
    await resetManifestCache();
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

  it(`should using from cache (global manifest)`, () => {
    return resolveManifest().then((searchEngine) => {
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
    });
  });
});

describe("Version manifest with no parent path exist", function () {
  /**
   * The resolve function may be slow since it is fetching from server.
   */
  this.timeout(10000);

  before(() => {
    // Trying to remove the path
    if (fse.existsSync(getVersionsPath())) {
      fse.emptyDir(getVersionsPath());
      fse.rmdirSync(getVersionsPath(), { recursive: true });
    }

    expect(fse.existsSync(getVersionsPath())).to.be.false;

    resetManifestCache();
  });

  it(`should throw error when resolve without parent`, function () {
    return resolveManifest()
      .then(() => {})
      .catch((err) => {
        expect(err.message).to.includes("Unable to load");
      });
  });
});
