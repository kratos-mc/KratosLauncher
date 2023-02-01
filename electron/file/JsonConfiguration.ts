import { JsonDuplex } from "./JsonDuplex";

export class JsonConfiguration {
  public configuration: Map<string, any>;
  private duplex: JsonDuplex<object>;

  constructor(duplex: JsonDuplex<object>, defaultObject?: object) {
    this.duplex = duplex;
    if (!duplex.hasFile()) {
      if (!defaultObject) {
        throw new Error(
          "The file has not exist and defaultObject has no declared"
        );
      }
      this.configuration = this.parseObjectAsMap(defaultObject);

      // Save the file for first load
      this.save();
    } else {
      this.configuration = this.parseObjectAsMap(duplex.readFile() as object);
    }
  }

  public parseObjectAsMap(object: object) {
    const map = new Map<string, any>();
    for (const item of Object.entries(object)) {
      map.set(item[0], item[1]);
    }
    return map;
  }

  public get(key: string) {
    return this.configuration.get(key);
  }

  public set(key: string, value: any) {
    this.configuration.set(key, value);
  }

  public getConfigurationMap() {
    return this.configuration;
  }

  public save() {
    const _ = Object.fromEntries(this.configuration.entries());
    this.duplex.writeFile(_);
  }
}
