import { expect } from "chai";
import { fetchAsStream } from "../fetch";
import fs from "fs-extra";
import path from "path";
import { getLauncherAppPath } from "../../launcher/file";

describe(`fetch.ts`, function () {
  /**
   * Retains 10 seconds to download a file (for slow-speed) test
   */
  this.timeout(10000);

  it(`should create a stream `, (done) => {
    let stream = fetchAsStream(`https://www.google.com`);
    expect(stream.listeners.length).to.gt(0);

    done();
  });

  it(`should pipe to a file from stream`, function (done) {
    const output = path.resolve(getLauncherAppPath(), "google.html");
    const promise = new Promise<void>((resolve, reject) => {
      let stream = fetchAsStream(`https://www.google.com`);
      let outputFile = fs.createWriteStream(output);

      stream.pipe(outputFile);

      stream.on("close", (error) => {
        if (error) {
          return reject(error);
        } else {
          resolve();
        }
      });
    });

    promise
      .then(() => {
        expect(fs.existsSync(output)).to.be.true;
        done();
      })
      .catch(done);
  });
});
