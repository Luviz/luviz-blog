import { Button, TextField } from "../components/input";

export default function Tibber() {
  return (
    <div style={{
        margin:'.5rem'
    }}>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          paddingBottom: "0.5rem",
          
        }}
      >
        <TextField placeholder={"Label"} onChange={(nv) => console.log(nv)} />
        <TextField
          placeholder={"Home index"}
          onChange={(nv) => console.log(nv)}
        />
        <TextField
          placeholder={"Tibber Key"}
          style={{
              flexGrow: "1"
            }}
          onChange={(nv) => console.log(nv)}
        />
      </div>
      <Button value={"Add"} />
    </div>
  );
}
