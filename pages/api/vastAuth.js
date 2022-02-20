import { LocalStorage } from "node-localstorage";

const auth = async () => {
  const url = "https://api.vasttrafik.se:443/token";
  const token = process.env.TOKEN;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${token}`,
    },
    body: "grant_type=client_credentials",
  });
  return res;
};

export default async function handler(req, res) {
  const now = new Date();

  async function updateAuth() {
    console.log("UPDATE");
    const response = await auth();
    const data = await response.json();
    data.expires_at = new Date(
      now.getTime() + data.expires_in * 1000
    ).toISOString();
    if (localStore) {
      localStore.setItem("lastAuth", JSON.stringify(data));
    }
    return data;
  }

  try {
    var localStore = new LocalStorage("./store");

    let lastAuth = JSON.parse(localStore.getItem("lastAuth"));

    if (!lastAuth) {
      await updateAuth();
      lastAuth = JSON.parse(localStore.getItem("lastAuth"));
    }

    if (new Date(lastAuth?.expires_at).getTime() < now.getTime()) {
      await updateAuth();
    }

    lastAuth = JSON.parse(localStore.getItem("lastAuth"));
    res.status(200).json(lastAuth);
  } catch {
    const data = await updateAuth();
    res.status(200).json(data);
  }
}
