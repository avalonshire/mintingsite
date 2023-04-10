import Page from "@/components/global/Page";
import NavigationBar from "@/components/navigation_bar/NavigationBar";
import WalletContext from "@/store/wallet-context";
import { useContext, useEffect, useState } from "react";
import TxHashModal from "@/components/global/TxHashModal";
import { toast, Toaster } from "react-hot-toast";
import GlassyCard from "@/components/global/GlassyCard";
import Counter from "@/components/global/Counter";
import ActionButton from "@/components/global/ActionButton";
import CreateMintingTxRepo from "@/repo/CreateMintingTxRepo";
import LoadingOverlay from "@/components/global/LoadingOverlay";
import ComposeTxRepo from "@/repo/ComposeTxRepo";
import AssetList, { Asset } from "@/components/global/AssetList";
import MintingSiteAssets from "@/utils/MintingSiteAssets";
import { assetsToAssetMap } from "@/utils/Utils";
import { PolicyIds } from "@/utils/PolicyIds";
import DropdownButton from "@/components/navigation_bar/Dropdown";
import Wallet from "@/utils/Wallet";

function App(): JSX.Element {
  const [lastTransactionHash, setLastTransactionHash] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mintQty, setMintQty] = useState(1);
  const [verifiedAssets, setVerifiedAssets] = useState<Asset[]>([]);
  const [selectedVerifiedAssets, setSelectedVerifiedAssets] = useState<Asset[]>([]);
  const [requestedAssets, setRequestedAssets] = useState<Asset[]>([]);
  const [selectedRequestedAssets, setSelectedRequestedAssets] = useState<Asset[]>([]);

  const walletCtx = useContext(WalletContext);
  const isConnected = walletCtx.isConnected;

  useEffect(() => {
    if (walletCtx.balance) {
      const assets = new MintingSiteAssets(walletCtx.balance)
      setVerifiedAssets(assets.verifiedAssets)
      setRequestedAssets(assets.requestedAssets)
    }
  }, [walletCtx.balance]);

  const mintHandler = async () => {
    setIsLoading(true)
    try {
      console.log("running mintHandler")
      const repo = new CreateMintingTxRepo(
        walletCtx, 
        mintQty,
        assetsToAssetMap(selectedVerifiedAssets, PolicyIds.VERIFIED),
        assetsToAssetMap(selectedRequestedAssets, PolicyIds.REQUESTED)
      )
      const { txCbor, aux } = await repo.callCreateMintingTx()
      console.log("txCbor", txCbor)
      console.log("aux", aux)
      const partialSign = await walletCtx.walletApi.signTx(txCbor)
      const composeRepo = new ComposeTxRepo(txCbor, partialSign, aux)
      const { composedTx } = await composeRepo.callComposeTx()
      console.log("composedTx", composedTx)
      const txHash = await walletCtx.walletApi.submitTx(composedTx)
      console.log("hash", txHash)
      setLastTransactionHash(txHash)
    } catch (error: any) {
      console.error(error)
      toast.error(error.message)
    }
    setIsLoading(false)
  }

  return (
    <Page backgroundImage="/fable2.gif">
      <Toaster />
      <NavigationBar />
      <div className="center">
        <GlassyCard width="75%" height="90%">
          <div className="center">
            {!isConnected ? (
              <div>
                <DropdownButton values={Object.keys(Wallet)}></DropdownButton>
              </div>
            ) : (
              <>
                <h1 className="ffTitle">Fable Friends Co.</h1>
                {verifiedAssets.length !== 0 ? (
                  <GlassyCard width="100%">
                    <h2 >FFC Founders Pass</h2>
                    <AssetList
                      assets={verifiedAssets}
                      emptyStateText={"No $VERIFIED_ASSET"}
                      onAssetSelect={(assets) => setSelectedVerifiedAssets(assets)}
                      maxSelectedAssets={1} />
                  </GlassyCard>
                ): null}
                {requestedAssets.length !== 0 ? (
                  <GlassyCard width="100%">
                    <h2>Fable Friends Summoning Orbs</h2>
                    <AssetList
                      assets={requestedAssets}
                      emptyStateText={"No $REQUESTED_ASSET"}
                      onAssetSelect={(assets) => setSelectedRequestedAssets(assets)}
                      maxSelectedAssets={5} />
                  </GlassyCard>
                ): null}
                <Counter max={5} onCountChange={(count) => setMintQty(count)} />
                <ActionButton title={"Mint Fable Friends Co."} onClick={mintHandler} disabled={!isConnected || isLoading} width={400} />
              </>
            )}
          </div>
        </GlassyCard>
      </div>
      <LoadingOverlay isLoading={isLoading} />
      <TxHashModal
        isVisible={!!lastTransactionHash}
        mainCaption={'Success! You can monitor your pending transaction at:'}
        linkText={lastTransactionHash ?? '<tx-hash>'}
        linkUrl={`https://cardanoscan.io/transaction/${lastTransactionHash ?? '<tx-hash>'}`}
        onClick={() => { setLastTransactionHash(null) }}
      />
      <div className="policyId" >
        <h1 >Policy ID: 35b1c2b342d902bda3cf7c8ea9be6f9bf286acda0b797df393538fe0</h1>
      </div>
    </Page>
  );
}

export default App;
