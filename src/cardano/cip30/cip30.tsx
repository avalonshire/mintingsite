declare global {
  interface Window {
    cardano: any;
  }
}

interface CardanoWallet {
  getUtxos: (
    inputs: Array<{ txHash: string; outputIndex: number }>
  ) => Promise<Array<{ txHash: string; outputIndex: number; value: number }>>;
  getChangeAddress: () => Promise<string>;
  sendTx: (signedTx: string) => Promise<string>;
}

class Cip30 {
  private walletId: string;
  private wallet: CardanoWallet | null = null;

  constructor(walletId: string) {
    this.walletId = walletId;
  }

  private async enableWallet(): Promise<void> {
    if (!this.wallet) {
      this.wallet = await window.cardano[this.walletId].enable();
    }
  }

  public async getUtxos(
    inputs: Array<{ txHash: string; outputIndex: number }>
  ): Promise<Array<{ txHash: string; outputIndex: number; value: number }>> {
    await this.enableWallet();
    return await this.wallet!.getUtxos(inputs);
  }

  public async getChangeAddress(): Promise<string> {
    await this.enableWallet();
    return await this.wallet!.getChangeAddress();
  }

  public async sendTx(signedTx: string): Promise<string> {
    await this.enableWallet();
    return await this.wallet!.sendTx(signedTx);
  }
}

export default Cip30;
