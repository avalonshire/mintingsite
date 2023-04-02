import { createContext, ReactNode, useEffect, useState } from "react";
import Wallet, { WalletType } from "@/utils/Wallet";
import BMMultiAsset from "@/cardano/types/BMMultiAsset";
import BMWalletBalance from "@/cardano/types/BMWalletBalance";
import { addressToStakeKey } from "@/utils/Utils";

declare global {
  interface Window {
    cardano: any;
  }
}

export interface WalletContextType {
  isConnecting: boolean;
  isConnected: boolean;
  wallet: WalletType | null;
  walletApi: any | undefined;
  changeAddress: string | null;
  balance: BMWalletBalance | null;
  stakeKey: string | null;
  connectWallet: (walletId: string) => Promise<void>;
  getUtxos: (multiAsset: BMMultiAsset) => Promise<string[]>;
  sync: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  isConnecting: false,
  isConnected: false,
  wallet: null,
  walletApi: undefined,
  changeAddress: null,
  balance: null,
  stakeKey: null,
  connectWallet: async (walletId: string) => { },
  getUtxos: async (multiAsset: BMMultiAsset) => [],
  sync: async () => {},
});

interface WalletContextProviderProps {
  children: ReactNode;
}


export function WalletContextProvider(props: WalletContextProviderProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [walletApi, setWalletApi] = useState<any | undefined>(undefined);
  const [changeAddress, setChangeAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<BMWalletBalance | null>(null);
  const [stakeKey, setStakeKey] = useState<string | null>(null);

  const connectWallet = async (walletId: string) => {
    setIsConnecting(true);
    try {
      const api = await window.cardano[walletId].enable();
      const changeAddress = await api.getChangeAddress();
      const cborBalanceString = await api.getBalance();
      setWallet(Wallet[walletId]);
      setWalletApi(api);
      setChangeAddress(changeAddress);
      setBalance(new BMWalletBalance(cborBalanceString));
      setIsConnecting(false);
      setStakeKey(addressToStakeKey(changeAddress))
      setIsConnected(true)
    } catch(error) {
      alert(error)
    }
    setIsConnecting(false);
  };

  const sync = async () => {
    console.log("Calling sync...")
    if (!walletApi) {
      return
    }
    setIsConnecting(true);
    try {
      const cborBalanceString = await walletApi.getBalance();
      setBalance(new BMWalletBalance(cborBalanceString))
    } catch(error) {
      alert(error)
    }
    setIsConnecting(false);
    console.log("Sync done!")
  }

  const getUtxos = async (multiAsset: BMMultiAsset): Promise<string[]> => {
    if (walletApi) {
      return await walletApi.getUtxos(multiAsset.toCborString());
    } else {
      return [];
    }
  };

  const context: WalletContextType = {
    isConnecting,
    isConnected,
    wallet,
    walletApi,
    changeAddress,
    balance,
    stakeKey,
    connectWallet,
    getUtxos,
    sync
  };

  return (
    <WalletContext.Provider value={context}>
      {props.children}
    </WalletContext.Provider>
  );
}

export default WalletContext;
