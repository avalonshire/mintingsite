export default class BMPolicyId {
    hexStringValue: string;
    hexBytesValue: Uint8Array;

    constructor(hexStringValue: string) {
        this.hexStringValue = hexStringValue;
        this.hexBytesValue = Uint8Array.from(
            hexStringValue.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
        );
    }

}