import Image from "next/image";
import profilePic from "../public/images/bardiajedi_profile.jpg";
import styles from "../styles/usercard.module.css";
import GithubIcon from "./icons/github.svg";
import LinkedinIcon from "./icons/linkedin.svg";
import TwitterIcon from "./icons/twitter.svg";

export const UserCard = () => {
  return (
    <div className={styles.userCard}>
      <Image
        className={styles.image}
        src={profilePic}
        alt="Picture of the author"
        width={250}
        height={261}
      />
      <div>
        <h1 className={styles.name}>Bardia Jedi</h1>
        <div className={styles.contactContainer}>
          <a href="https://github.com/luviz" target={"github"}>
            <GithubIcon className={styles.svgLinkIcons} />
          </a>
          <a
            href="https://www.linkedin.com/in/bardia-jedi-3b2699b8/"
            target={"linkedin"}
          >
            <LinkedinIcon className={styles.svgLinkIcons} />
          </a>
          <a href="https://twitter.com/bardiajedi" target={"twitter"}>
            <TwitterIcon className={styles.svgLinkIcons} />
          </a>
        </div>
      </div>
    </div>
  );
};
