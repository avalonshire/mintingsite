export default class ComposeTxRepository {

    private apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL! + 'compose_tx';

    txCbor: string
    signature: string
    aux: string

    constructor(txCbor: string, signature: string, aux: string) {
        this.txCbor = txCbor
        this.signature = signature
        this.aux = aux
    }

    async callComposeTx() {

        console.log("calling callComposeTx")

        const params = {
            tx_cbor: this.txCbor,
            signature: this.signature,
            aux: this.aux,
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
            throw new Error(`HTTP error! status: ${resp.status}`);
        }
        
        const data = await resp.json()
        console.log("response", data)

        const { composed_tx: composedTx } = data

        return { composedTx }
    }

}