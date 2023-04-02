import * as csl from "@emurgo/cardano-serialization-lib-asmjs"; // eslint-disable-line no-console
import BMAssetName from "./BMAssetName";
import BMPolicyId from "./BMPolicyId";
import { HumanReadableMap } from "./HumanReadableMap";

export default class BMMultiAsset {

    lovelace: number;
    humanReadableAssetMap?: HumanReadableMap;

    constructor(lovelace: number, humanReadableAssetMap?: HumanReadableMap) {
        this.lovelace = lovelace
        this.humanReadableAssetMap = humanReadableAssetMap
    }

    toCborString(): string {
        const _lovelace = csl.BigNum.from_str(this.lovelace.toString())
        let _multiAsset = csl.MultiAsset.new()
        for (const policyId in this.humanReadableAssetMap) {
            let assetsOfPolicyIdMap = this.humanReadableAssetMap[policyId]
            let bmPolicyId = new BMPolicyId(policyId)
            let scriptHash = csl.ScriptHash.from_bytes(bmPolicyId.hexBytesValue)
            let assets = csl.Assets.new()
            for (const humanReadableAssetName in assetsOfPolicyIdMap) {
                let qty = assetsOfPolicyIdMap[humanReadableAssetName]
                let bmAssetname = BMAssetName.fromHumanReadableName(humanReadableAssetName)
                assets.insert(csl.AssetName.new(bmAssetname.hexBytesName), csl.BigNum.from_str(qty.toString()))
            }
            _multiAsset.insert(scriptHash, assets)
        }
        const val = csl.Value.new(_lovelace)
        if (_multiAsset.len() != 0) {
            val.set_multiasset(_multiAsset)
        }
        return this.bytesToHexString(val.to_bytes())
    }

    private bytesToHexString(bytes: Uint8Array): string {
        return Array.prototype.map.call(bytes, function (byte) {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('');
    }

}