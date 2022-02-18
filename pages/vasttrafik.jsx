import styles from "../styles/vasttrafik.module.css";
import { useState, useEffect, useRef } from "react";

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
  const [busData, setBusData] = useState({});
  useEffect(() => getData().then(setBusData), [setBusData]);
  useInterval(() => getData().then(setBusData), 30 * 1000);

  console.log({ busData });
  let cards = <div>aaa</div>;
  if (busData) {
    cards = Object.values(busData).map((b, ix) => (
      <BusCard key={ix} card={b} />
    ));
  }
  return <div className={styles.vast}>{cards || "load"}</div>;
}

const BusCard = ({ card }) => {
  return (
    <div className={styles.card}>
      <div
        className={styles.cardName}
        style={{
          backgroundColor: card.bgColor,
          color: card.fgColor,
        }}
      >
        {card.sname}{" "}
      </div>
      <div className={styles.cardDir}> {card.direction.split(",")[0]}</div>
      <div className={styles.cardETA}>
        <span>{card.ETA[0] > 0 ? card.ETA[0] : "Nu"}</span>
        <span>{card.ETA[1] ?? ""}</span>
        <span>{card.ETA[2] ?? ""}</span>
      </div>
    </div>
  );
};
