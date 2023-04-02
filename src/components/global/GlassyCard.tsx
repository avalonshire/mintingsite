import React, { ReactNode, useRef, useEffect } from "react";
import styles from "./GlassyCard.module.css";

interface GlassyCardProps {
  children: ReactNode;
  width?: string;
  height?: string; // add a height prop with optional string type
}

function GlassyCard({ children, width = "100%", height }: GlassyCardProps): JSX.Element {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.card} style={{ width, height }} ref={cardRef}>
      <div className={styles.overlay}></div>
      {children}
    </div>
  );
}

export default GlassyCard;
