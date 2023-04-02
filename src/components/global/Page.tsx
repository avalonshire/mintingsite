import React from "react";
import styles from "./Page.module.css";

interface PageProps {
  backgroundImage: string;
  children: React.ReactNode;
}

const Page: React.FC<PageProps> = ({ backgroundImage, children }) => {
  return (
    <div className={styles["page-container"]}>
      <div className={styles["background-container"]}>
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `url(${backgroundImage}) no-repeat center center fixed`,
            backgroundSize: "cover",
            zIndex: -1,
          }}
        />
      </div>
      <div className={styles["content-container"]}>{children}</div>
    </div>
  );
};

export default Page;
