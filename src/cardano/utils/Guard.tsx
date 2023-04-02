export class GuardError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "GuardError";
    }
}

export const guardNetwork = async (walletApi: any) => {
    const networkId = await walletApi.getNetworkId();
    if (process.env.NEXT_PUBLIC_NETWORK != networkId) {
        throw new GuardError(`Wrong network detected! Please move to ${(process.env.NEXT_PUBLIC_NETWORK! == "1") ? "Mainnet" : "Testnet"}.`);
    }
}

export const guardMatchRequestedAndQty = (qty: number, requestedTokens: string[]) => {
    if (requestedTokens.length != qty) {
        throw new GuardError("Requested Tokens and Minting Quantity must Match.");
    }
}