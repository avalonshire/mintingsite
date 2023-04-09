import React from "react";
import styles from "./TxHashModal.module.css";

interface TxHashModalProps {
  isVisible: boolean;
  mainCaption: string;
  linkText: string;
  linkUrl: string;
  onClick: () => void;
}

const TxHashModal: React.FC<TxHashModalProps> = ({
  isVisible,
  mainCaption,
  linkText,
  linkUrl,
  onClick,
}) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.open(linkUrl, "_blank");
  };

  const handleOkClick = () => {
    onClick();
  };

  return (
    <>
      {isVisible && (
        <div className={styles.modalPadding}>
          <div className={styles.modalContainer} onClick={onClick}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.caption}>{mainCaption}</div>
              <a href={linkUrl} className={styles.link} onClick={handleLinkClick}>
                {linkText}
              </a>
              <button className={styles.okButton} onClick={handleOkClick}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TxHashModal;
