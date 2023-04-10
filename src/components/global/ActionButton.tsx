import React from "react";
import styles from "./ActionButton.module.css";

type ActionButtonProps = {
  title: string;
  width?: number;
  height?: number;
  disabled?: boolean;
  onClick?: () => void;
};

const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  width = 200,
  height = 50,
  disabled = false,
  onClick = undefined
}) => {
  return (
    <button className={styles.actionButton}  onClick={onClick} disabled={disabled}>
      {title}
    </button>
  );
};

export default ActionButton;

/*style={{ width, height }}*/