import React from "react";
import styles from "./DropdownItem.module.css";
import WalletIcons from "@/utils/Wallet";

interface DropdownItemProps {
  value: string;
  onClick: () => void;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ value, onClick }) => {
  return (
    <li
      key={value}
      className={styles.item}
      onClick={onClick}
    >
      <div>
        <img
          src={WalletIcons[value].icon.src}
          alt={value}
          width={20}
          height={20}
          className={styles.icon}
        />
        <span className={styles.text}>{WalletIcons[value].name}</span>
      </div>
    </li>
  );
};

export default DropdownItem;
