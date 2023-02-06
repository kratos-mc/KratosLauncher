import { expect } from "chai";
import fse from "fs-extra";
// import { DownloadedEvent, HashableDownloadItem } from "./../download";
// import { expect } from "chai";
// import { Download, DownloadItem, Progress } from "../download";

import path from "path";
import { getLauncherAppPath } from "../../launcher/file";
import { Download, DownloadedEvent } from "../download";

describe("DownloadedEvent", () => {
  it("should using appropriate constructor which provides item", () => {
    let firstTest = new DownloadedEvent(
      { path: "a", url: "b", size: 0 },
      "success"
    );
    expect(firstTest.item).to.have.property(`path`).and.be.a.string;
    expect(firstTest.item).to.have.property(`url`).and.be.a.string;
    expect(firstTest.item).to.have.property(`size`).and.be.a.string;
    expect(firstTest).to.have.property(`status`).and.be.a.string;
    expect(firstTest.status).to.eq("success");
  });
});

function getFileSizeInBytes(file: fse.PathLike) {
  var stats = fse.statSync(file);
  var fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}

describe("Download-core", function () {
  /**
   * The download core can be very slow, in order to omit download test,
   * run test with environment OMIT_DOWNLOAD_TEST
   */
  this.timeout(10000);

  before(function () {
    if (process.env.OMIT_DOWNLOAD_TEST) {
      console.log(`Disable download test due to the environment`);
      this.skip();
    }
  });

  describe("General test", () => {
    it(`should throw on empty download queue`, () => {
      const download = new Download();
      expect(() => {
        download.start();
      }).to.throws(/Empty download queue/);
    });

    it("should create and download without error", function (done) {
      const downloadPath = path.join(
        getLauncherAppPath(),
        "first-download.jar"
      );
      const download = new Download();
      const assertPromise = new Promise<DownloadedEvent[]>(
        (resolve, reject) => {
          // Download the blocklist library from mc server
          download.addItem({
            url: `https://libraries.minecraft.net/com/mojang/blocklist/1.0.10/blocklist-1.0.10.jar`,
            path: downloadPath,
            size: 964,
            hash: {
              algorithm: "sha1",
              value: "5c685c5ffa94c4cd39496c7184c1d122e515ecef",
            },
          });

          download.start({ mkdirIfNotExists: true });
          download.on("error", (error) => reject(error));
          download.on("done", (downloadEventItems: DownloadedEvent[]) => {
            // console.log(downloadEventItems);
            resolve(downloadEventItems);
          });
        }
      );

      assertPromise
        .then((downloadEventItems) => {
          expect(fse.existsSync(downloadPath)).to.be.true;
          expect(Array.isArray(downloadEventItems)).to.be.true;
          expect(downloadEventItems.length).to.eq(1);
          expect(getFileSizeInBytes(downloadPath)).to.eq(964);
        })
        .then(done)
        .catch(done);
    });

    it(`should make a directory when parent directory is empty`, function (done) {
      const downloadPath = path.join(
        getLauncherAppPath(),
        "downloads",
        "second-download.jar"
      );

      const successMakeDirectoryDownloadPromise = new Promise<void>(
        (resolve, reject) => {
          const download = new Download();
          // Download the blocklist library from mc server
          download.addItem({
            url: `https://libraries.minecraft.net/com/mojang/blocklist/1.0.10/blocklist-1.0.10.jar`,
            path: downloadPath,
            size: 964,
            hash: {
              algorithm: "sha1",
              value: "5c685c5ffa94c4cd39496c7184c1d122e515ecef",
            },
          });

          download.start({ mkdirIfNotExists: true });
          download.on("error", (error) => reject(error));
          download.on("done", () => {
            // expect(fse.pathExistsSync(path.basename(downloadPath))).to.be.true;
            // Assert download
            resolve();
          });
        }
      );

      successMakeDirectoryDownloadPromise
        .then(() => {
          expect(fse.pathExistsSync(path.dirname(downloadPath))).to.be.true;
          expect(fse.existsSync(downloadPath)).to.be.true;
          expect(getFileSizeInBytes(downloadPath)).to.eq(964);

          done();
        })
        .catch(done);
    });

    it(`should throw when parent directory is empty`, () => {
      const unrealPathDownload = path.join(
        getLauncherAppPath(),
        "downloads-with-unreal-path",
        "file.jar"
      );

      const download = new Download({
        url: `https://libraries.minecraft.net/com/mojang/blocklist/1.0.10/blocklist-1.0.10.jar`,
        path: unrealPathDownload,
        size: 946,
        hash: {
          algorithm: "sha1",
          value: "5c685c5ffa94c4cd39496c7184c1d122e515ecef",
        },
      });

      expect(() => {
        download.start();
      }).to.throws(/Unable to find directory/);
    });

    it(`should estimate the size header from resources if size has not provided `, (done) => {
      const downloadPath = path.join(
        getLauncherAppPath(),
        "first-download.jar"
      );
      const assertPromise = new Promise<DownloadedEvent[]>(
        (resolve, reject) => {
          const download = new Download();

          // Download the blocklist library from mc server without size
          download.addItem({
            url: `https://libraries.minecraft.net/com/mojang/blocklist/1.0.10/blocklist-1.0.10.jar`,
            path: downloadPath,
            hash: {
              algorithm: "sha1",
              value: "5c685c5ffa94c4cd39496c7184c1d122e515ecef",
            },
          });

          download.start({ mkdirIfNotExists: true });
          download.on("error", (error) => reject(error));
          download.on("done", (downloadEventItems: DownloadedEvent[]) => {
            resolve(downloadEventItems);
          });
        }
      );

      assertPromise
        .then((downloadEventItems: DownloadedEvent[]) => {
          expect(fse.existsSync(downloadPath)).to.be.true;
          expect(Array.isArray(downloadEventItems)).to.be.true;
          expect(downloadEventItems.length).to.eq(1);
          // expect(getFileSizeInBytes(downloadPath)).to.eq(964);

          done();
        })
        .catch(done);
    });
  });

  describe("Multiple test", () => {
    it(`should download multiple files`, (done) => {
      const outputFiles = ["first-download", "second-download"];
      const assertPromise = new Promise<DownloadedEvent[]>(
        (resolve, reject) => {
          const download = new Download();

          // Download multiple blocklist libraries from mc server
          // download.addItem();
          outputFiles.forEach((fileName) => {
            download.addItem({
              url: `https://libraries.minecraft.net/com/mojang/blocklist/1.0.10/blocklist-1.0.10.jar`,
              path: path.join(
                getLauncherAppPath(),
                "multiple-downloads",
                fileName
              ),
              size: 964,
              hash: {
                algorithm: "sha1",
                value: "5c685c5ffa94c4cd39496c7184c1d122e515ecef",
              },
            });
          });

          download.start({ mkdirIfNotExists: true });
          download.on("error", (error) => reject(error));
          download.on("done", (downloadEventItems: DownloadedEvent[]) => {
            resolve(downloadEventItems);
          });
        }
      );

      assertPromise
        .then((downloadEventItems: DownloadedEvent[]) => {
          expect(Array.isArray(downloadEventItems)).to.be.true;
          // Check every items exist
          expect(
            [...outputFiles]
              .map((fileName) => {
                return path.join(
                  getLauncherAppPath(),
                  "multiple-downloads",
                  fileName
                );
              })
              .map((absolutePath) => fse.existsSync(absolutePath))
              .every((assertion) => assertion)
          ).to.be.true;
          expect(downloadEventItems.length).to.eq(2);
          // expect(getFileSizeInBytes(downloadPath)).to.eq(964);
          done();
        })
        .catch(done);
    });
  });
});
