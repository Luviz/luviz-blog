import styles from '../styles/Home.module.css'

export function NavBar({ someValue = "meh" }) {
    const li = [
        { text: "Home", value: "#" },
        { text: "Blog", value: "#" },
        { text: "About", value: "#" },
        // eslint-disable-next-line react/jsx-key
    ].map(l => <li><a href={l.value}>{l.text}</a></li>)

    return <nav className={styles.nav}>
        <img src="/Icon-BJ.svg" alt="Bardia Jedi Logo" className={styles.icon} />
        <ul>
            {li}
        </ul>
    </nav>
}
