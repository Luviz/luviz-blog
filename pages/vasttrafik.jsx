import styles from "../styles/vasttrafik.module.css";
import { useState, useEffect } from "react";

export default function VastTraffic() {
  const [accessToken, setAccessToken] = useState();
  useEffect(() => {
    fetch("./api/vastAuth").then(async (res) => {
      const data = await res.json();
      setAccessToken(data["access_token"]);
    });
  });
  if (accessToken) {
    const url =
      "https://api.vasttrafik.se/bin/rest.exe/v2/location.name?input=ols&format=json";
    fetch(url, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }).then(console.log);
  }
  return <div className={styles.vast}>{accessToken}</div>;
}
