import React, { useState } from "react";
import Image from "next/image";
import styles from "./AssetList.module.css";

export interface Asset {
  id: string;
  assetName: string;
  imageUrl?: string;
}

interface AssetListProps {
  assets: Asset[];
  itemsPerPage?: number;
  maxSelectedAssets?: number;
  onAssetSelect?: (assets: Asset[]) => void;
  emptyStateText: string;
}

const AssetList: React.FC<AssetListProps> = ({ assets, itemsPerPage = 10, maxSelectedAssets = Infinity, onAssetSelect, emptyStateText }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);

  const totalPages = Math.ceil(assets.length / itemsPerPage);

  const handleClick = () => setCurrentPage(currentPage + 1);

  const handleAssetClick = (asset: Asset) => {
    const isAlreadySelected = selectedAssets.some((a) => a.id === asset.id);
  
    if (maxSelectedAssets === 1) {
      if (isAlreadySelected) {
        // If the clicked item is already selected, deselect it
        setSelectedAssets([]);
      } else {
        // If a new item is selected, deselect the previously selected item (if any)
        const newSelectedAssets = [asset];
        setSelectedAssets(newSelectedAssets);
      }
    } else {
      // If maxSelectedAssets is greater than 1, toggle the selected state of the item
      if (isAlreadySelected) {
        setSelectedAssets(selectedAssets.filter((a) => a.id !== asset.id));
      } else if (selectedAssets.length < maxSelectedAssets) {
        setSelectedAssets([...selectedAssets, asset]);
      }
    }
  };
  

  const renderLoadMoreButton = () => {
    if (currentPage >= totalPages) {
      return null;
    }
    return (
      <div className={styles.card}>
        <button onClick={handleClick}>Load More</button>
      </div>
    );
  };

  const renderAssetCard = (asset: Asset) => {
    const matches = asset.assetName.match(/\d+/);
    const numberPart = matches ? matches[0] : "";

    const renderImage = () => {
      if (!asset.imageUrl) {
        return <p style={{ margin: 0, textAlign: "center" }}>{numberPart}</p>;
      }
      const isSelected = selectedAssets.some(a => a.id === asset.id);
      return (
        <div
          className={isSelected ? `${styles.cardImageContainer} ${styles.selected}` : styles.cardImageContainer}
          onClick={() => handleAssetClick(asset)}
        >
          <div className={styles.cardImageWrapper}>
            <Image
              alt={asset.assetName}
              src={asset.imageUrl}
              width={200}
              height={200}
              className={styles.cardImage}
              loading={"lazy"}
              crossOrigin={"anonymous"}
            />
            <p className={styles.cardImageName}>#{numberPart}</p>
          </div>
        </div>
      );
    };

    return (
      <div key={asset.id} className={styles.card}>
        {renderImage()}
      </div>
    );
  };

  const renderAssetList = () => {
    if (assets.length === 0) {
      return <p style={{ textAlign: "center" }}>{emptyStateText}</p>;
    } else {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const renderedAssets = assets.slice(0, endIndex).map(renderAssetCard);
      return (
        <div className={styles.container}>
          {renderedAssets}
          {renderLoadMoreButton()}
        </div>
      );
    }
  };

  React.useEffect(() => {
    if (onAssetSelect) {
      onAssetSelect(selectedAssets);
    }
  }, [selectedAssets]);

  return (
    <div>
      {renderAssetList()}
    </div>
  );
};

export default AssetList;
