/* eslint-disable @next/next/no-img-element */
// import "../styles/blogcard.module.css"
import styles from '../styles/blogcard.module.css'

export default function BlogCard({ href, title, description, thumbnail, metadata }) {
    return <div className={styles.card} onClick={_ => window.open(href)}>
        {/* <img className={styles.img} src="images/MSAzure-functions.png" alt="" /> */}
        <img className={styles.img} src={thumbnail} alt="" />
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        <span className={styles.date}>{metadata}</span>
    </div>
}