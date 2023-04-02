import BMMultiAsset from "../types/BMMultiAsset";
import { API } from "./API";
import { guardMatchRequestedAndQty } from "./Guard";

interface TokenMap {
    [key: string]: { [key: string]: number };
}

const verifiedPolicyId: string = process.env.NEXT_PUBLIC_VERIFIED_TOKENS_POLICY_ID!;
const requestedPolicyId: string = process.env.NEXT_PUBLIC_REQUESTED_TOKENS_POLICY_ID!;

const mapVerifiedAndRequestedTokens = (verifiedTokens: string[], requestedTokens: string[]): TokenMap => {
    const verifiedMap: { [key: string]: number } = {};
    for (const token of verifiedTokens) {
        verifiedMap[token] = 1
    }
    const requestedMap: { [key: string]: number } = {};
    for (const token of requestedTokens) {
        requestedMap[token] = 1
    }
    return {
        [verifiedPolicyId]: verifiedMap,
        [requestedPolicyId]: requestedMap
    };
};

const mintEx = async (walletApi: any, qty: number, verifiedTokens: string[], requestedTokens: string[]) => {

    guardMatchRequestedAndQty(qty, requestedTokens);

    const verifiedAndRequestedTokensMap = mapVerifiedAndRequestedTokens(verifiedTokens, requestedTokens)
    const totalMintingFee = parseInt(process.env.NEXT_PUBLIC_MINTING_PRICE_LOVELACE!) * qty
    const multiAsset = new BMMultiAsset(totalMintingFee, verifiedAndRequestedTokensMap).toCborString()
    const filteredUtxos = await walletApi.getUtxos(multiAsset)
    const changeAddress = await walletApi.getChangeAddress()
    const nftRecipients = null
    const { minting_tx, session_id } = await API.create_minting_tx(
        filteredUtxos,
        changeAddress,
        qty,
        nftRecipients,
        verifiedTokens.length == 0 ? null : { [verifiedPolicyId]: verifiedAndRequestedTokensMap[verifiedPolicyId] },
        requestedTokens.length == 0 ? null : { [requestedPolicyId]: verifiedAndRequestedTokensMap[requestedPolicyId] }
    )
    const witness = await walletApi.signTx(minting_tx)
    const serverSignedTx = await API.sign_and_compose_tx(session_id, witness)
    await walletApi.submitTx(serverSignedTx)
}

export const mint = async (walletApi: any, qty: number, verifiedTokens: string[], requestedTokens: string[]) => {
    const startTime = performance.now();
    await mintEx(walletApi, qty, verifiedTokens, requestedTokens);
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(`The function took ${duration} milliseconds to execute.`);
}


