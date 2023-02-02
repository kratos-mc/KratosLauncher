import { expect } from "chai";
import fse from "fs-extra";
// import { DownloadedEvent, HashableDownloadItem } from "./../download";
// import { expect } from "chai";
// import { Download, DownloadItem, Progress } from "../download";

import path from "path";
import { getLauncherAppPath } from "../../launcher/file";
import { Download, DownloadedEvent } from "../download";

// import path from "path";
// import fs from "fs";
// import { getLauncherAppPath } from "../../launcher/file";

// const testOutputDir = getLauncherAppPath();

// describe(`download.ts`, () => {
//   let downloadedItems: string[] = [];

//   const createSmallSizeDownloadItem = (fileName: string, fileSize?: number) => {
//     downloadedItems.push(path.join(testOutputDir, fileName));
//     return {
//       path: path.join(testOutputDir, fileName),
//       url: "https://libraries.minecraft.net/com/mojang/blocklist/1.0.10/blocklist-1.0.10.jar",
//       size: fileSize,
//       hash: {
//         algorithm: "sha1",
//         value: "5c685c5ffa94c4cd39496c7184c1d122e515ecef",
//       },
//     };
//   };

//   // afterEach(() => {
//   //   // Clean up this if available
//   //   // Clean up - Remove the directory
//   //   let somewhereDirectory = path.join(testOutputDir, "somewhere-here");
//   //   if (fs.existsSync(somewhereDirectory)) {

//   //   }
//   // });

//   it(`should send data event`, function (done) {
//     /**
//      * Large timeout size for slow connection test
//      */
//     this.timeout(5000);
//     /**
//      * Create a promise to test async event
//      */
//     const mockPromise: Promise<{
//       buffer: Buffer;
//       downloadItem: DownloadItem;
//       downloadProgress: Progress;
//     }> = new Promise((resolve, reject) => {
//       let download = new Download(
//         createSmallSizeDownloadItem("blocklist-1.0.10.jar", 964)
//       );
//       download.on("data", (buffer, downloadItem, downloadProgress) => {
//         resolve({ buffer, downloadItem, downloadProgress });
//       });
//       download.on("error", (err) => reject(err));
//       download.start({
//         mkdirIfNotExists: true,
//       });
//     });

//     mockPromise
//       .then((response) => {
//         expect(response.buffer).not.to.be.undefined;

//         expect(response.downloadItem).not.to.be.undefined;
//         expect(response.downloadItem.path).not.to.be.undefined;
//         expect(response.downloadItem.size).not.to.be.undefined;
//         expect(response.downloadItem.url).not.to.be.undefined;

//         expect(response.downloadProgress).not.to.be.undefined;
//         expect(response.downloadProgress.getCurrentItem()).not.to.be.undefined;
//         expect(response.downloadProgress.getActualSize()).not.to.eq(0);
//         expect(response.downloadProgress.getProgressSize()).not.to.eq(0);
//         done();
//       })
//       .catch(done);
//   });

//   it(`should estimate file size from header with undefined size`, function (done) {
//     this.slow();
//     const promise: Promise<{
//       buffer: Buffer;
//       downloadItem: DownloadItem;
//       downloadProgress: Progress;
//     }> = new Promise((resolve, reject) => {
//       const download = new Download(
//         createSmallSizeDownloadItem(
//           "blocklist-1.10.1#under-estimated-size.jar",
//           undefined
//         )
//       );

//       download.on("data", (buffer, downloadItem, downloadProgress) => {
//         resolve({ buffer, downloadItem, downloadProgress });
//       });
//       download.on("error", (error) => {
//         reject(error);
//       });
//       download.start();
//     });
//     promise
//       .then(({ downloadProgress }) => {
//         expect(typeof downloadProgress.getActualSize()).to.eq("number");
//         expect(downloadProgress.getActualSize()).to.be.eq(964);
//         done();
//       })
//       .catch(done);
//   });

//   it(`should throws when starting to download empty queue`, () => {
//     expect(() => {
//       new Download().start();
//     }).to.throws(`Empty download queue`);
//   });

//   it(`should throws when stream to non-exists directory`, () => {
//     expect(() => {
//       const download = new Download({
//         path: path.join(testOutputDir, "somewhere-here", "test.jar"),
//         url: "https://libraries.minecraft.net/com/mojang/blocklist/1.0.10/blocklist-1.0.10.jar",
//         size: 964,
//         hash: {
//           algorithm: "sha1",
//           value: "5c685c5ffa94c4cd39496c7184c1d122e515ecef",
//         },
//       });

//       download.start();
//     }).to.throws();
//   });

//   it(`should create directory when options { mkdirIfNotExists }`, () => {
//     expect(() => {
//       const download = new Download({
//         path: path.join(testOutputDir, "somewhere-here", "test.jar"),
//         url: "https://libraries.minecraft.net/com/mojang/blocklist/1.0.10/blocklist-1.0.10.jar",
//         size: 964,
//         hash: {
//           algorithm: "sha1",
//           value: "5c685c5ffa94c4cd39496c7184c1d122e515ecef",
//         },
//       });

//       download.start({ mkdirIfNotExists: true });

//       expect(
//         fs.existsSync(
//           path.dirname(path.join(testOutputDir, "somewhere-here", "test.jar"))
//         )
//       ).to.be.true;
//     }).to.not.throws();
//   });

//   it(`should throws with unsupported algorithm`, () => {
//     expect(() => {
//       const download = new Download({
//         path: path.join(testOutputDir, "test.jar"),
//         url: "https://libraries.minecraft.net/com/mojang/blocklist/1.0.10/blocklist-1.0.10.jar",
//         size: 964,
//         hash: {
//           algorithm: "some-encrypt-algo-not-exists",
//           value: "5c685c5ffa94c4cd39496c7184c1d122e515ecef",
//         },
//       });

//       download.start();
//     }).to.throws(/Unsupported hash algorithm/);
//   });

//   it(`should downloaded with sha256`, (done) => {
//     let fileName = path.join(testOutputDir, "test.jar");
//     let promise: Promise<void> = new Promise((resolve) => {
//       downloadedItems.push(fileName);
//       const download = new Download({
//         path: fileName,
//         url: "https://libraries.minecraft.net/com/mojang/blocklist/1.0.10/blocklist-1.0.10.jar",
//         size: 964,
//         hash: {
//           algorithm: "sha256",
//           value:
//             "830bfd639c8db49236bbd8e45d3a2b8c96c56ff654a10118654958a6235d4c44",
//         },
//       });

//       download.setVerbose(true);

//       download.start();

//       download.on("done", () => {
//         resolve();
//       });
//     });

//     promise
//       .then(() => {
//         expect(fs.existsSync(fileName)).to.be.true;

//         done();
//       })
//       .catch(done);
//   });

//   it(`should downloaded with sha1`, (done) => {
//     let fileName = path.join(testOutputDir, "test.jar");
//     let promise: Promise<void> = new Promise((resolve) => {
//       downloadedItems.push(fileName);
//       const download = new Download({
//         path: fileName,
//         url: "https://libraries.minecraft.net/com/mojang/blocklist/1.0.10/blocklist-1.0.10.jar",
//         size: 964,
//         hash: {
//           algorithm: "sha1",
//           value: "5c685c5ffa94c4cd39496c7184c1d122e515ecef",
//         },
//       });

//       download.setVerbose(true);

//       download.start();

//       download.on("done", () => {
//         resolve();
//       });
//     });

//     promise
//       .then(() => {
//         expect(fs.existsSync(fileName)).to.be.true;

//         done();
//       })
//       .catch(done);
//   });

//   it(`should downloaded with non-hash`, (done) => {
//     let fileName = path.join(testOutputDir, "test.jar");
//     let promise: Promise<void> = new Promise((resolve) => {
//       downloadedItems.push(fileName);
//       const download = new Download({
//         path: fileName,
//         url: "https://libraries.minecraft.net/com/mojang/blocklist/1.0.10/blocklist-1.0.10.jar",
//         size: 964,
//       });

//       download.setVerbose(true);

//       download.start();

//       download.on("done", () => {
//         resolve();
//       });
//     });

//     promise
//       .then(() => {
//         expect(fs.existsSync(fileName)).to.be.true;

//         done();
//       })
//       .catch(done);
//   });

//   it(`should fetch as Buffer format (not JSON)`, function (done) {
//     let fileName = path.join(testOutputDir, `1.19.3.json`);
//     downloadedItems.push(fileName);

//     const download = new Download({
//       path: fileName,
//       url: "https://piston-meta.mojang.com/v1/packages/6607feafdb2f96baad9314f207277730421a8e76/1.19.3.json",
//       hash: {
//         algorithm: "sha1",
//         value: `5c685c5ffa94c4cd39496c7184c1d122e515ecef`,
//       },
//     });

//     download.start();
//     download.setVerbose(true);
//     download.on("done", () => {
//       done();
//     });
//   });

//   it(`should emit done after downloaded`, function (done) {
//     this.timeout(5000);

//     let fileName = path.join(testOutputDir, `1.19.3.json`);
//     downloadedItems.push(fileName);

//     const promise: Promise<DownloadedEvent[]> = new Promise((res, rej) => {
//       const download = new Download(
//         {
//           path: fileName,
//           url: `https://piston-meta.mojang.com/v1/packages/6607feafdb2f96baad9314f207277730421a8e76/1.19.3.json`,
//         },
//         {
//           path: fileName,
//           url: `https://piston-meta.mojang.com/v1/packages/6607feafdb2f96baad9314f207277730421a8e76/1.19.3.json`,
//           hash: {
//             algorithm: "sha1",
//             value: `6607feafdb2f96baad9314f207277730421a8e76`,
//           },
//         }
//       );

//       download.start();
//       download.on("done", (history) => {
//         res(history);
//       });
//       download.on("error", (err) => rej(err));
//     });

//     promise
//       .then((historyFiles) => {
//         expect(historyFiles).to.be.instanceOf(Array);
//         expect(historyFiles.length).to.eq(2);

//         expect(fs.existsSync(fileName)).to.be.true;
//       })
//       .then(done)
//       .catch(done);
//   });

//   it(`should emit progress after download single file of multiple files download`, (done) => {
//     const promise: Promise<DownloadedEvent> = new Promise((res, _rej) => {
//       const download = new Download(
//         {
//           path: path.join(testOutputDir, `1.19.3_first.json`),
//           url: `https://piston-meta.mojang.com/v1/packages/6607feafdb2f96baad9314f207277730421a8e76/1.19.3.json`,
//         },
//         {
//           path: path.join(testOutputDir, `1.19.3_second.json`),
//           url: `https://piston-meta.mojang.com/v1/packages/6607feafdb2f96baad9314f207277730421a8e76/1.19.3.json`,
//           hash: {
//             algorithm: "sha1",
//             value: `6607feafdb2f96baad9314f207277730421a8e76`,
//           },
//         }
//       );

//       downloadedItems.push(
//         path.join(testOutputDir, `1.19.3_first.json`),
//         path.join(testOutputDir, `1.19.3_second.json`)
//       );
//       download.on("progress", (history) => {
//         res(history);
//       });
//       download.on("error", (error) => {
//         _rej(error);
//       });

//       download.start();
//     });

//     promise
//       .then((progressHistory) => {
//         expect(progressHistory.item).not.to.be.undefined;
//         expect(progressHistory.status).to.eq("success");
//         expect(fs.existsSync(progressHistory.item.path)).to.be.true;
//         done();
//       })
//       .catch(done);
//   });

//   it(`should downloaded with multiple resources / files`, function (done) {
//     this.slow();
//     let sampleDownloadItem: HashableDownloadItem[] = [
//       {
//         path: path.join(testOutputDir, "blocklist-1"),
//         size: 946,
//         url: "https://libraries.minecraft.net/com/mojang/blocklist/1.0.10/blocklist-1.0.10.jar",
//         hash: {
//           value: `5c685c5ffa94c4cd39496c7184c1d122e515ecef`,
//           algorithm: "sha1",
//         },
//       },
//       {
//         path: path.join(testOutputDir, "blocklist-2"),
//         size: 946,
//         url: "https://libraries.minecraft.net/com/mojang/blocklist/1.0.10/blocklist-1.0.10.jar",
//         hash: {
//           value: `5c685c5ffa94c4cd39496c7184c1d122e515ecef`,
//           algorithm: "sha1",
//         },
//       },
//       {
//         path: path.join(testOutputDir, "blocklist-3"),
//         size: 946,
//         url: "https://libraries.minecraft.net/com/mojang/blocklist/1.0.10/blocklist-1.0.10.jar",
//         hash: {
//           value: `5c685c5ffa94c4cd39496c7184c1d122e515ecef`,
//           algorithm: "sha1",
//         },
//       },
//     ];

//     sampleDownloadItem.forEach((item) =>
//       downloadedItems.push(item.path.toString())
//     );

//     let downloader = new Download(...sampleDownloadItem);
//     downloader.on("error", (error) => done(error));
//     downloader.on("done", (historyItems) => {
//       // History items
//       expect(historyItems).to.be.instanceOf(Array);
//       expect(historyItems.length).to.eq(3);
//       expect(
//         historyItems.every(
//           (downloadedEvent: DownloadedEvent) =>
//             downloadedEvent.status === "success"
//         )
//       );
//       // Check if all items are existed
//       expect(
//         sampleDownloadItem
//           .map((item) => fs.existsSync(item.path.toString()))
//           .every((responseValue) => responseValue === true)
//       ).to.be.true;
//       done();
//     });
//     downloader.start();
//   });

//   it(`should delete corrupted (failed to check sum) resources and skip to next`, function (done) {
//     this.slow();

//     let sampleDownloadItem: HashableDownloadItem[] = [
//       {
//         path: path.join(testOutputDir, "blocklist-1"),
//         size: 946,
//         url: "https://libraries.minecraft.net/com/mojang/blocklist/1.0.10/blocklist-1.0.10.jar",
//         hash: {
//           value: `5c685c5ffa94c4cd39496c7184c1d122e515ecef`,
//           algorithm: "sha1",
//         },
//       },
//       // Corrupted file
//       {
//         path: path.join(testOutputDir, "blocklist-2"),
//         size: 946,
//         url: "https://libraries.minecraft.net/com/mojang/blocklist/1.0.10/blocklist-1.0.10.jar",
//         hash: {
//           value: ``,
//           algorithm: "sha1",
//         },
//       },
//       {
//         path: path.join(testOutputDir, "blocklist-3"),
//         size: 946,
//         url: "https://libraries.minecraft.net/com/mojang/blocklist/1.0.10/blocklist-1.0.10.jar",
//         hash: {
//           value: `5c685c5ffa94c4cd39496c7184c1d122e515ecef`,
//           algorithm: "sha1",
//         },
//       },
//     ];

//     sampleDownloadItem.forEach((item) =>
//       downloadedItems.push(item.path.toString())
//     );

//     let downloader = new Download(...sampleDownloadItem);
//     downloader.on("error", (error) => done(error));
//     downloader.on("done", (historyFiles) => {
//       // Check if all items are existed, one file has been removed by corrupted
//       expect(
//         sampleDownloadItem.map((item) => fs.existsSync(item.path.toString()))
//       ).to.be.deep.eq([true, false, true]);

//       // check history items
//       expect(historyFiles).to.be.instanceOf(Array);
//       expect(historyFiles.length).to.be.eq(3);
//       expect(
//         historyFiles.map((event: DownloadedEvent) => event.status)
//       ).to.be.deep.eq(["success", "corrupted", "success"]);
//       done();
//     });
//     downloader.start();
//   });

//   it(`should downloaded item with md5 hash`, function (done) {
//     this.slow();

//     let sampleDownloadItem: HashableDownloadItem[] = [
//       {
//         path: path.join(testOutputDir, "blocklist-1.0.10.jar"),
//         size: 946,
//         url: "https://libraries.minecraft.net/com/mojang/blocklist/1.0.10/blocklist-1.0.10.jar",
//         hash: {
//           value: `fc1420e3182dd32b4df9933f810ebebb`,
//           algorithm: "md5",
//         },
//       },
//       {
//         path: path.join(testOutputDir, "failureaccess-1.0.1.jar"),
//         size: 4617,
//         url: "https://libraries.minecraft.net/com/google/guava/failureaccess/1.0.1/failureaccess-1.0.1.jar",
//         hash: {
//           value: `091883993ef5bfa91da01dcc8fc52236`,
//           algorithm: "md5",
//         },
//       },
//     ];

//     sampleDownloadItem.forEach((item) =>
//       downloadedItems.push(item.path.toString())
//     );

//     let downloader = new Download(...sampleDownloadItem);
//     downloader.on("error", (error) => done(error));
//     downloader.on("done", (historyFiles) => {
//       expect(
//         sampleDownloadItem
//           .map((item) => fs.existsSync(item.path.toString()))
//           .every((boolean) => boolean === true)
//       ).to.be.true;

//       // check history items
//       expect(historyFiles).to.be.instanceOf(Array);
//       expect(historyFiles.length).to.be.eq(2);
//       expect(historyFiles.every((item) => item.status === "success")).to.be
//         .true;
//       done();
//     });
//     downloader.start();
//   });

//   it(`should change attempt size function works`, function (done) {
//     this.slow();

//     let attempt = 0;
//     let maxAttemptSize = 8;

//     const fileName = path.join(testOutputDir, "blocklist-1.0.10.jar");
//     const downloader = new Download({
//       path: fileName,
//       size: 946,
//       url: "https://libraries.minecraft.net/com/mojang/blocklist/1.0.10/blocklist-1.0.10.jar",
//       hash: {
//         value: `1234679`,
//         algorithm: "md5",
//       },
//     });
//     downloadedItems.push(fileName);
//     downloader.setAttemptSize(maxAttemptSize);
//     downloader.on("attempt", (item) => {
//       expect(item).not.to.be.undefined;
//       attempt++;
//     });
//     downloader.on("done", (history) => {
//       expect(attempt).to.eq(maxAttemptSize);
//       done();
//     });
//     downloader.on(`error`, (error) => done(error));
//     downloader.start();
//   });
// });

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
          expect(getFileSizeInBytes(downloadPath)).to.eq(964);

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
