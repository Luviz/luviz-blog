import NavBar from "./navBar"
import Head from "next/head"

export default function Master({ children }) {
    return <div className={"container"}>
        <Head>
            <title>Bardia Jedi</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <meta name="description" content="The blog of Bardia Jedi Software developer" />
            <html lang={"en"} />
        </Head>
        <NavBar />
        <main className={"main"}>
            {children}
        </main >
    </div >

}