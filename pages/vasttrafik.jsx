import styles from "../styles/vasttrafik.module.css";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

const getUrl = (stopId) => {
  const [date, time] = new Date().toISOString().split("T");
  return `https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id=${stopId}&date=${date}&time=${time}&format=json`;
};

const getData = async () => {
  const { access_token } = await fetch("/api/vastAuth").then((res) =>
    res.json()
  );

  const headers = {
    Authorization: "Bearer " + access_token,
  };

  const stop_ids = ["9021014012163000", "9021014012162000"]; // "Gamla torget, Mölndal"
  const proms = [];
  for (const stopId of stop_ids) {
    proms.push(
      fetch(getUrl(stopId), { headers })
        .then((r) => r.json())
        .then((d) => d?.DepartureBoard?.Departure || [])
    );
  }
  const res = await Promise.all(proms);
  const ret = [];
  for (const r of res) {
    ret = [...r, ...ret];
  }

  const agg = {};
  const getETA = (timestamp) =>
    Math.round((new Date(timestamp) - new Date()) / 1000 / 60);

  for (const journey of ret.filter((re) => re.rtTime)) {
    const elem = agg[journey["stopid"]];
    const rtDateTime = `${journey.rtDate}T${journey.rtTime}`;

    if (elem) {
      elem.rtTime.push(journey.rtTime);
      elem.rtDate.push(journey.rtDate);
      elem.rtDateTime.push(new Date(rtDateTime));
      elem.ETA.push(getETA(rtDateTime));
    } else {
      agg[journey["stopid"]] = {
        ...journey,
        rtTime: [journey.rtTime],
        rtDate: [journey.rtDate],
        rtDateTime: [new Date(rtDateTime)],
        ETA: [getETA(rtDateTime)],
      };
    }
  }
  console.log(agg);
  return agg;
};

const useInterval = (callback, delay) => {
  const savedCallback = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [callback, delay]);
};

export default function VastTraffic() {
  console.log("preview");
  const [busData, setBusData] = useState({});
  useEffect(() => getData().then(setBusData), [setBusData]);
  useInterval(() => getData().then(setBusData), 30 * 1000);
  const { query } = useRouter();

  let cards = <div></div>;
  if (busData) {
    let arr = Object.values(busData);

    if (query["debug"]) {
      arr = [
        ...Object.values(busData),
        ...Object.values(busData),
        ...Object.values(busData),
      ];
    }

    cards = arr.map((b, ix) => <BusCard key={ix} card={b} number={ix} />);
  }
  // console.log("aaa");
  return (
    <div className={styles.vast}>
      <div>
        <Fade cards={cards} />
      </div>
    </div>
  );
}

function* chunks(arr, n) {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
}

const Fade = ({ cards }) => {
  const [count, setCount] = useState(0);
  const cardGroups = [...chunks(cards, 3)];

  useInterval(() => {
    setCount(count + 1);
  }, 5 * 1000);

  return (
    <div className={styles.fade}>
      {cardGroups.map((cardGroup, key) => {
        return (
          <div key={key} data-active={key == count % cardGroups.length}>
            {cardGroup}
          </div>
        );
      })}
    </div>
  );
};

const BusCard = ({ card }) => {
  return (
    <div>
      <div className={styles.card}>
        <div
          className={styles.cardName}
          style={{
            backgroundColor: card.bgColor,
            color: card.fgColor,
          }}
        >
          {card.sname}
        </div>
        <div className={styles.cardDir}> {card.direction.split(",")[0]}</div>
        <div className={styles.cardETA}>
          <span>{card.ETA[0] > 0 ? card.ETA[0] : "Nu"}</span>
          <span>{card.ETA[1] ?? ""}</span>
          <span>{card.ETA[2] ?? ""}</span>
        </div>
      </div>
    </div>
  );
};
