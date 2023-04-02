import React from "react";
import ActionButton from "../global/ActionButton";
import styles from "./Footer.module.css";

interface FooterProps {
  isVisible: boolean;
  children?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ isVisible, children }) => {
  return (
    <div
      className={styles.footer}
      style={{ display: isVisible ? "flex" : "none" }}
    >
      {/* Footer content goes here */}
      {children}
    </div>
  );
};

export default Footer;
