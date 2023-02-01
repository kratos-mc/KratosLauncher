import fse from "fs-extra";
import path from "path";

export class JsonDuplex<T> {
  private filename: string;
  constructor(filename: string) {
    this.filename = filename;
  }

  public hasFile(): boolean {
    return fse.existsSync(this.filename);
  }

  public writeFile(object: T, options?: fse.JsonWriteOptions): void {
    if (!fse.existsSync(path.dirname(this.filename))) {
      throw new Error(
        `Unable to write file, path ${path.dirname(this.filename)} not existed`
      );
    }
    fse.writeJSONSync(this.filename, object, options);
  }

  public readFile(options?: fse.JsonReadOptions): T {
    if (!fse.existsSync(this.filename)) {
      throw new Error("Unable to read file. The file is empty or not existed");
    }
    return fse.readJSONSync(this.filename, options);
  }

  public deleteFile(options?: fse.RmOptions) {
    if (!fse.existsSync(this.filename)) {
      throw new Error(
        `Unable to delete file. File is not existed in file system.`
      );
    }
    return fse.rmSync(this.filename, options);
  }
}

export function createDuplexFromFileName<T>(file: fse.PathLike) {
  return new JsonDuplex<T>(file.toString());
}
