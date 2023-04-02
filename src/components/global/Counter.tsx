import React, { useState } from "react";
import styles from "./Counter.module.css";

interface Props {
  max: number;
  onCountChange?: (count: number) => void;
}

function Counter({ max, onCountChange }: Props) {
  const [count, setCount] = useState(1);

  const handleIncrement = () => {
    if (count < max) {
      setCount(count + 1);
      if (typeof onCountChange === "function") {
        onCountChange(count + 1);
      }
    }
  };

  const handleDecrement = () => {
    if (count > 1) {
      setCount(count - 1);
      if (typeof onCountChange === "function") {
        onCountChange(count - 1);
      }
    }
  };

  return (
    <div className={styles.counter}>
      <button className={styles["counter-button"]} onClick={handleDecrement}>
        -
      </button>
      <span className={styles["counter-value"]}>{count}</span>
      <button className={styles["counter-button"]} onClick={handleIncrement}>
        +
      </button>
    </div>
  );
}

export default Counter;
