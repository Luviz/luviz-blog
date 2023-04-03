import styles from "../styles/counter.module.css";
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  const [disable, setDisable] = useState(false);
  return (
    <div className={styles.container}>
      <div className={styles["warning-text"]}>
        This dose not work on Safari/IOS get a better device!
      </div>
      <div className={styles.text}>{count}</div>
      <div
        data-disable={disable}
        onClick={() => {
          if (!disable) {
            setDisable(true);
            setCount((ps) => ps + 1);
            if (navigator.vibrate) {
              navigator.vibrate([200, 50, 400]);
            }
          }
          setTimeout(() => setDisable(false), 800);
        }}
        className={styles.button}
      >
        Click Me
      </div>
    </div>
  );
}
