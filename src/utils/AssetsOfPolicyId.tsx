import BMWalletBalance from "@/cardano/types/BMWalletBalance";

export default class AssetsOfPolicyId {
  assetNames!: string[];
  quantityMap!: { [key: string]: number };
  static fromBalance(
    balance: BMWalletBalance,
    policyId: string
  ): AssetsOfPolicyId {
    const instance = new AssetsOfPolicyId();
    instance.initFromBalance(balance, policyId);
    return instance;
  }

  private initFromBalance(balance: BMWalletBalance, policyId: string): void {
    const [lovelace, humanReadableMap] = balance.toHumanReadable();
    const assetInfo = humanReadableMap[policyId];
    if (!assetInfo) {
      this.assetNames = [];
      this.quantityMap = {};
    } else {
      this.assetNames = Object.keys(assetInfo);
      this.quantityMap = assetInfo;
    }
  }
}
