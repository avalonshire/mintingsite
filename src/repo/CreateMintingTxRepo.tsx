import BMMultiAsset from "@/cardano/types/BMMultiAsset";
import { HumanReadableMap } from "@/cardano/types/HumanReadableMap";
import WalletContext, { WalletContextType } from "@/store/wallet-context";

interface Params {
    change_address: string | null;
    utxos: string[];
    quantity: number;
    verify?: HumanReadableMap | undefined
    request?: HumanReadableMap | undefined 
}

export default class CreateMintingTxRepo {
    private apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL! + 'create_minting_tx';
    walletCtx: WalletContextType
    qty: number
    verify: HumanReadableMap | undefined
    request: HumanReadableMap | undefined

    constructor(
        walletCtx: WalletContextType, 
        qty: number, 
        verify?: HumanReadableMap | undefined,
        request?: HumanReadableMap | undefined) {
        this.walletCtx = walletCtx
        this.qty = qty
        this.verify = verify
        this.request = request
    }

    async callCreateMintingTx() {
        console.log("calling callCreateMintingTx")
        const changeAddress = this.walletCtx.changeAddress
        const lovelace = 12_000_000
        const assetMap = { ...this.verify, ...this.request };
        console.log(assetMap)
        const requiredValue = new BMMultiAsset(lovelace, assetMap)
        console.log(requiredValue.toCborString())
        const utxos = await this.walletCtx.getUtxos(requiredValue)
        const params: Params = {
            change_address: changeAddress,
            utxos,
            quantity: this.qty,
        }
        if (this.verify) {
            params.verify = this.verify
        }
        if (this.request) {
            params.request = this.request
        }
        console.log("params", params)
        const resp = await fetch(this.apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params)
        })
        if (!resp.ok) {
            const data = await resp.json()
            throw new Error(`HTTP error! status: ${resp.status} ${data["error_message"]}`);
        }
        const data = await resp.json()
        console.log("response", data)
        const { tx_cbor: txCbor, aux } = data
        return { txCbor, aux }
    }
}