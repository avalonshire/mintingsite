
export class API {

    static removeNullProperties(obj: { [key: string]: any }): { [key: string]: any } {
        const result: { [key: string]: any } = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key) && obj[key] !== null) {
                result[key] = obj[key];
            }
        }
        return result;
    }

    static async create_minting_tx(
        utxos: any[],
        change_address: string,
        mint_qty: number,
        nft_recipients: any | null,
        verified_tokens: { [key: string]: { [key: string]: number } } | null,
        requested_tokens: { [key: string]: { [key: string]: number } } | null
    ): Promise<any> {
        let payload = API.removeNullProperties({
            utxos,
            change_address,
            mint_qty,
            nft_recipients,
            verified_tokens,
            requested_tokens
        })
        console.log(`create_minting_tx payload`, JSON.stringify(payload))
        let url: string = process.env.NEXT_PUBLIC_MINTING_API_BASE_URL! + '/create_minting_tx';
        let res = await fetch(url,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }
        );
        return await res.json();
    }

    static async sign_and_compose_tx(session_id: string, witness: any): Promise<string> {
        let compose_tx_url: string = process.env.NEXT_PUBLIC_MINTING_API_BASE_URL! + '/compose_tx';
        let compose_tx_payload = {
            session_id,
            witness,
        };
        let compose_tx_res = await fetch(compose_tx_url,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(compose_tx_payload)
            }
        );
        let signed_tx = await compose_tx_res.json().then((o) => o.signed_tx);
        return signed_tx;
    }
}
