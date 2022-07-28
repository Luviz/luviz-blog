import Image from "next/image";
import styles from "../../styles/linkcard.module.css";

export const LinkCard = ({ text, imgSrc, link }) => {
  return (
    <a href={link}>
      <div className={styles.linkCard}>
        <Image
          className={styles.image}
          src={imgSrc}
          alt={"Who am I img"}
          layout="responsive"
          style={{ borderRadius: "5px" }}
        />
        <div className={styles.text}>{text}</div>
      </div>
    </a>
  );
};
