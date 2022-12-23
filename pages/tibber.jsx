import { useEffect, useReducer, useState } from "react";
import useLocalStorage from "use-local-storage";
import { Button, TextField } from "../components/input";

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

  return (
    <div
      style={{
        margin: ".5rem",
      }}
    >
      <div style={{ color: "white" }}>Items without key are removed</div>
      {[...tibberItems, {key:undefined}].map((item, ix) => {
        return (
          <TibberForm
            key={item.key}
            defaultValues={{
              label: item.label,
              homeIx: item.homeIx,
              key: item.key,
            }}
            onDelete={() => {
              const tibberCopy = [...tibberItems]
              const _ = tibberCopy.splice(ix, 1)
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

      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
    </div>
  );
}
