import NavBar from "./navBar";
import Head from "next/head";

export default function Master({ children }) {
  return (
    <div className={"container"}>
      <Head>
        <title>Bardia Jedi</title>
      </Head>
      <NavBar />
      <main className={"main"}>{children}</main>
    </div>
  );
}