import styles from "../styles/counter.module.css";
import { useMemo, useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  const [disable, setDisable] = useState(false);
  const [multi, setMulti] = useState(0)
  const {format} = new Intl.NumberFormat()

  return (
    <div>
      <div>
        <RenderWarning />
      </div>

      <div className={styles.container}>
        <div className={styles['input-container']}>
          <div className={styles.text}>count: {count}</div>
          <input type="number" onChange={(e) => setMulti(e.target.value)}/>
          <div className={styles.text}>{format(count * multi)}</div>
        </div>
        <div
          data-disable={disable}
          onClick={() => {
            if (!disable) {
              setDisable(true);
              setCount((ps) => ps + 1);
              if (global?.navigator?.vibrate) {
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
    </div>
  );
}

const RenderWarning = () => {
  if (!!global?.navigator?.vibrate) return <></>;
  return (
    <div className={styles["warning-text"]}>
      The vibrate api is not available on you device
    </div>
  );
};
