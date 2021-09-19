import NavBar from "./navBar"

export default function Master({ children }) {
    return <div className={"container"}>
        <NavBar text="hello" />
        <main className={"main"}>
            {children}
        </main >
    </div >

}