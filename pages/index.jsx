import { LinkCard } from "../components/cards/linkCard";
import Master from "../components/master";
import myWorkImage from "../public/images/myWork.jpg";
import blogImage from "../public/images/blog.jpg";
import whomaiImage from "../public/images/whoami.jpg";

export default function Home() {
  return (
    <Master>
      <div
        style={{
          gridArea: "content",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <LinkCard text="Blog" imgSrc={blogImage} link="/blog" />
        <LinkCard text="Who am I" imgSrc={whomaiImage} link="/about" />
        <LinkCard
          text="My work"
          imgSrc={myWorkImage}
          link="https://github.com/Luviz"
        />
      </div>
    </Master>
  );
}
