export default class BMAssetName {
  hexStringName!: string;
  hexBytesName!: Uint8Array;
  humanReadableName!: string;

  static fromHexStringName(str: string): BMAssetName {
    const instance = new BMAssetName();
    instance.initializeFromHexStringName(str);
    return instance;
  }

  private initializeFromHexStringName(str: string): void {
    if (str === '') {
      str = 'undefined';
    }
    this.hexStringName = str;
    this.hexBytesName = Uint8Array.from(
      str.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    );
    const utf8Decoder = new TextDecoder();
    this.humanReadableName = utf8Decoder.decode(this.hexBytesName);
  }

  static fromHumanReadableName(str: string): BMAssetName {
    const instance = new BMAssetName();
    instance.initializeFromHumanReadableName(str);
    return instance;
  }

  private initializeFromHumanReadableName(str: string): void {
    const utf8Encoder = new TextEncoder();
    this.humanReadableName = str;
    this.hexBytesName = utf8Encoder.encode(str);
    this.hexStringName = Array.prototype.map
      .call(this.hexBytesName, (x: number) => ("00" + x.toString(16)).slice(-2))
      .join("");
  }
}
