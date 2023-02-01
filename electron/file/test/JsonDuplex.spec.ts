import { expect } from "chai";
import fse from "fs-extra";
import { createDuplexFromFileName, JsonDuplex } from "./../JsonDuplex";
import path from "path";
import { getLauncherAppPath } from "../../launcher/file";

describe("JsonDuplex test", () => {
  const assertionPath = path.join(getLauncherAppPath(), "settings.json");

  after(() => {
    if (fse.existsSync(assertionPath)) {
      fse.rmSync(assertionPath, { force: true, recursive: true });
    }
  });

  it("should function work fine", (done) => {
    let duplex = createDuplexFromFileName<{ versions: number }>(assertionPath);
    expect(duplex).to.not.be.undefined;
    // Write file function
    duplex.writeFile({ versions: 1 });
    expect(fse.existsSync(assertionPath)).to.not.be.false;

    // Read file function
    const targetFromFile = duplex.readFile();
    expect(targetFromFile).to.have.property("versions");
    expect(targetFromFile.versions).to.eq(1);

    expect(duplex.hasFile()).to.be.true;

    duplex.deleteFile();
    expect(duplex.hasFile()).to.be.false;

    done();
  });

  it(`should throws exception`, () => {
    const duplex = createDuplexFromFileName(assertionPath);
    // Read non-existed file
    expect(() => {
      duplex.readFile();
    }).to.throws(/Unable to read file+/);

    // Delete non-existed file
    expect(() => {
      duplex.deleteFile();
    }).to.throws(/Unable to delete file+/);

    const duplexWithoutParent = createDuplexFromFileName(
      path.join(getLauncherAppPath(), "fake", "item.json")
    );

    // Write a file without make parent directory
    expect(() => {
      duplexWithoutParent.writeFile({ any: "thing" });
    }).to.throws(/Unable to write file+/);
  });
});
