/* eslint-disable @next/next/no-img-element */

export default function NavBar() {
    const li = [
        { text: "Home", value: "#" },
        { text: "Blog", value: "#" },
        { text: "About", value: "#" },
        // eslint-disable-next-line react/jsx-key
    ].map((l, ix) => <li key={ix}><a href={l.value}>{l.text}</a></li>)

    return <nav className={"nav"}>
        <img src="/Icon-BJ.svg" alt="Bardia Jedi Logo" className={"banner-icon"} />
        <ul>
            {li}
        </ul>
    </nav>
}
