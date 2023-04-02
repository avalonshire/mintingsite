import BMAssetName from "./BMAssetName";
import { HumanReadableMap } from "./HumanReadableMap";

const CBOR = require('cbor')

type Uint8ArrayMap = Map<Uint8Array, Map<Uint8Array, number>>

export default class BMWalletBalance {

    balanceCborString: string

    constructor(balanceCborString: string) {
        this.balanceCborString = balanceCborString
    }

    private bytesToHexString(arr: Uint8Array): string {
        let hex = '';
        for (let i = 0; i < arr.length; i++) {
            let hexByte = arr[i].toString(16);
            hexByte = hexByte.length === 1 ? '0' + hexByte : hexByte;
            hex += hexByte;
        }
        return hex;
    }

    private parseMultiAsset(multiasset: Uint8ArrayMap): HumanReadableMap {
        const map: HumanReadableMap = {}
        multiasset.forEach((innerMap, policyIdHexBytes) => {
            const _inner: { [key: string]: number } = {}
            innerMap.forEach((quantity, assetNameHexBytes) => {
                const assetNameHexString = this.bytesToHexString(assetNameHexBytes)
                const humanReadableName = BMAssetName.fromHexStringName(assetNameHexString).humanReadableName
                _inner[humanReadableName] = quantity
            })
            const hexStringPolicyId = this.bytesToHexString(policyIdHexBytes)
            map[hexStringPolicyId] = _inner
        })
        return map
    }

    toHumanReadable(): [number, HumanReadableMap] {
        const decoded = CBOR.decode(this.balanceCborString)
        const lovelace = decoded[0]

        if (decoded[1]) {
            const multiasset = this.parseMultiAsset(decoded[1])
            return [lovelace, multiasset]
        }

        return [lovelace, {}]
    }

}