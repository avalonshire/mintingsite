import BMWalletBalance from "@/cardano/types/BMWalletBalance";
import { Asset } from "@/components/global/AssetList";
import AssetsOfPolicyId from "./AssetsOfPolicyId";
import { PolicyIds } from "./PolicyIds";

// interface Lookup {
//   [key: string]: { [key: string]: any };
// }
// export const NftCollectionLookup = NftCollection as Lookup;

export default class MintingSiteAssets {
  verifiedAssets: Asset[];
  requestedAssets: Asset[];

  private lookupByPolicyId(
    assetNames: string[],
    // lookup: Lookup,
    // policyId: string
  ) {
    return assetNames.map((assetName) => {
      // const metadata = lookup["721"][policyId][assetName];
      return {
        id: assetName,
        assetName: assetName,
        imageUrl: "https://picsum.photos/200",
      };
    });
  }

  constructor(balance: BMWalletBalance) {
    this.verifiedAssets = this.lookupByPolicyId(
      AssetsOfPolicyId.fromBalance(balance, PolicyIds.VERIFIED).assetNames,
      // NftCollectionLookup,
      // PolicyIds.VERIFIED
    );
    this.requestedAssets = this.lookupByPolicyId(
      AssetsOfPolicyId.fromBalance(balance, PolicyIds.REQUESTED).assetNames,
      // NftCollectionLookup,
      // PolicyIds.VERIFIED
    );
  }
}
