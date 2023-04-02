import { HumanReadableMap } from '@/cardano/types/HumanReadableMap';
import { Asset } from '@/components/global/AssetList';
import { Address, BaseAddress, RewardAddress } from '@emurgo/cardano-serialization-lib-asmjs';

export function addressToStakeKey(address: string): string | null {
  try {
    const addr = Address.from_hex(address);
    const baseAddr = BaseAddress.from_address(addr)!;
    const stakeCred = baseAddr.stake_cred();
    const rewardAddrBytes = new Uint8Array(29);
    rewardAddrBytes.set([0xe1], 0);
    rewardAddrBytes.set(stakeCred.to_bytes().slice(4, 32), 1);
    const rewardAddr = RewardAddress.from_address(Address.from_bytes(rewardAddrBytes));
    return rewardAddr!.to_address().to_bech32();
  } catch (error) {
    console.error(error);
    return null;
  }
}



export function assetsToAssetMap(assets: Asset[], policyId: string): HumanReadableMap | undefined {
  if (assets.length === 0) {
    return undefined
  }
  let map: HumanReadableMap = {
    [policyId]: {}
  }
  for (const asset of assets) {
    map[policyId][asset.assetName] = 1
  }
  return map
}

