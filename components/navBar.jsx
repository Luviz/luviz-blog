/* eslint-disable @next/next/no-img-element */
import styles from "../styles/navBar.module.css"
import Link from "next/link"

export default function NavBar() {
    const li = [
        { text: "Home", value: "/" },
        { text: "Blog", value: "/blog" },
        { text: "About", value: "/About" },
    ].map((l, ix) => <li key={ix}><Link href={l.value} passHref>{l.text}</Link></li>)

    return <nav className={styles.nav}>
        <Link href="/" passHref>
            <img src="/Icon-BJ.svg" alt="Bardia Jedi Logo" className={styles.bannerIcon} />
        </Link>
        <ul>
            {li}
        </ul>
    </nav>
}
