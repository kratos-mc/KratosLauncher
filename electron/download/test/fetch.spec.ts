import { expect } from "chai";
import { fetchAsStream } from "../fetch";
import fs from "fs";
import path from "path";
import { getLauncherAppPath } from "../../launcher/file";

describe(`fetch.ts`, () => {
  it(`should create a stream `, (done) => {
    let stream = fetchAsStream(`https://www.google.com`);
    expect(stream.listeners.length).to.gt(0);

    done();
  });

  it(`should pipe to a file from stream`, function (done) {
    this.timeout(5000);
    let stream = fetchAsStream(`https://www.google.com`);
    let outputFile = fs.createWriteStream(
      path.resolve(getLauncherAppPath(), "google.html")
    );

    stream.pipe(outputFile);

    stream.on("close", () => {
      expect(fs.existsSync(getLauncherAppPath())).to.be.true;
      done();
    });
  });
});
