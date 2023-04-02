import React, { useContext, useEffect, useState } from "react";
import styles from "./Dropdown.module.css";
import DropdownItem from "./DropdownItem";
import WalletContext from "@/store/wallet-context";

interface DropdownButtonProps {
  values: string[];
}

const DropdownButton: React.FC<DropdownButtonProps> = ({ values }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const walletCtx = useContext(WalletContext);

  const handleOnClick = () => {
    setDropdownOpen((prevValue) => {
      return !prevValue;
    });
  };

  const handleWalletSelection = async (walletId: string) => {
    setDropdownOpen(false);
    try {
      await walletCtx.connectWallet(walletId);
    } catch {

    }
  };

  let content = <div>CONNECT WALLET</div>;

  if (walletCtx.isConnecting) {
    content = <div>Connecting wallet...</div>;
  }

  if (walletCtx.wallet) {
    content = <div>USING: {walletCtx.wallet.name}</div>;
  }

  return (
    <div className={styles.dropdown}>
      <button
        className={`${styles.toggleButton} ${dropdownOpen ? styles.open : ""}`}
        onClick={handleOnClick}
      >
        {content}
      </button>
      <div className={`${styles.menu} ${dropdownOpen ? styles.open : ""}`}>
        <ul className={styles.list}>
          {values.map((value) => (
            <DropdownItem
              key={value}
              value={value}
              onClick={() => handleWalletSelection(value)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DropdownButton;
