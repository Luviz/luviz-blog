import '../styles/globals.css'
import styles from '../styles/Home.module.css'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export function NavBar({someValue="meh"}){
  return <nav className={styles.nav}>
    hello world
  </nav>
}

export default MyApp
