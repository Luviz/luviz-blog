import { useReducer, useState } from "react";
import useLocalStorage from "use-local-storage";
import { Button, TextField } from "../components/input";
import { callTibberApi } from "../lib/tibber";
import { Line, LineChart, XAxis, YAxis } from "recharts";

const TibberForm = ({
  onSubmit = undefined,
  onDelete = undefined,
  defaultValues = undefined,
}) => {
  const [values, setValues] = useReducer(
    (state, act) => {
      return { ...state, ...act };
    },
    { ...defaultValues }
  );
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit && onSubmit(values);
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "1rem",
            padding: "0.25rem 0",
          }}
        >
          <TextField
            placeholder={"Label"}
            onChange={(nv) => setValues({ label: nv })}
            value={values.label}
          />
          <TextField
            placeholder={"Home index"}
            onChange={(nv) => setValues({ homeIx: nv })}
            value={values.homeIx}
          />
          <TextField
            placeholder={"Tibber Key"}
            onChange={(nv) => setValues({ key: nv || "" })}
            value={values.key}
            style={{
              flexGrow: "1",
            }}
          />
          <Button
            tabindex={-1}
            value={"Delete"}
            onClick={() => onDelete && onDelete(values)}
          />
        </div>
        <button type="submit" hidden />
      </form>
    </div>
  );
};

export default function Tibber() {
  const [errorMessage, setErrorMessage] = useState("");
  const [tibberItems, setTibberItems] = useLocalStorage("tibberKeys", []);
  const [tibberData, setTibberData] = useState([]);
  const [tibberChartData, setTibberChartData] = useState([]);
  // const client = useApolloClient({
  //   uri: "https://api.tibber.com/v1-beta/gql/",
  // });

  return (
    <div
      style={{
        margin: ".5rem",
      }}
    >
      {errorMessage && (
        <div style={{ color: "red", margin: "1rem" }}>{errorMessage}</div>
      )}
      <div>
        <Button
          value={"Fetch data"}
          onClick={async () => {
            try {
              console.log("ti", tibberItems);
              const promises = tibberItems.map(({ key, homeIx }) =>
                callTibberApi(key, { resolution: "DAILY", last: 30 })
              );

              const responses = await Promise.all(promises);

              const responsesData = responses.map((r, ix) => {
                const { homeIx } = tibberItems[ix];
                const activeHome = r.data.viewer.homes[homeIx];
                const { name } = r.data.viewer;
                return {
                  name,
                  consumption: activeHome.consumption.nodes,
                  // `${name}-consumption`: activeHome.consumption.nodes.map(n => n.),
                  chartData: activeHome.consumption.nodes.map((n) => {
                    return {
                      lineNumber: ix,
                      yLabel: new Date(n.to).getTime(),
                      yName: new Date(n.to).toDateString(),
                      label: name,
                      [`${ix}-consumption`]: n.consumption,
                      ...n,
                    };
                  }),
                };
              });

              // const aggData = [...tibberData[0].chartData, ...tibberData[1].chartData];
              // const chartData = []

              const aggData = {};

              for (const d of responsesData) {
                // console.log(d.chartData);
                const { chartData } = d;
                for (const cd of chartData) {
                  const ix = cd.to.toString().split("T")[0];
                  if (ix in aggData) {
                    aggData[ix] = {
                      ...aggData[ix],
                      ...cd,
                    };
                  } else {
                    aggData[ix] = cd;
                  }
                }
              }

              console.log(responsesData, aggData);
              console.log(Object.values(aggData));
              setTibberData(responsesData);
              setTibberChartData(Object.values(aggData))
              setErrorMessage("");
            } catch (e) {
              setErrorMessage(e.message);
            }
          }}
        />
        {tibberData.length > 0 && (
          <LineChart
            width={1700}
            height={400}
            data={tibberChartData}
          >
            <XAxis dataKey="yName" values="to" />
            <YAxis />
            <Line
              type="monotone"
              dataKey="0-consumption"
              stroke="#ff0"
            />
            <Line
              type="monotone"
              dataKey="1-consumption"
              stroke="#f0f"
            />
          </LineChart>
        )}
      </div>
      <div style={{ color: "white" }}>Items without key are removed</div>
      {[...tibberItems, { key: undefined }].map((item, ix) => {
        return (
          <TibberForm
            key={ix}
            defaultValues={{
              label: item.label,
              homeIx: item.homeIx,
              key: item.key,
            }}
            onDelete={() => {
              const tibberCopy = [...tibberItems];
              const _ = tibberCopy.splice(ix, 1);
              setTibberItems([]);
              setTibberItems(tibberCopy);
            }}
            onSubmit={(nv) => {
              setErrorMessage("");
              const newItems = [...tibberItems];
              if (nv.key) {
                newItems[ix] = nv;
              }
              setTibberItems(newItems.filter((i) => typeof i === "object"));
            }}
          />
        );
      })}
    </div>
  );
}
