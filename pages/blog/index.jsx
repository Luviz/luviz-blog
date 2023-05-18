import Master from "../../components/master";
import BlogCard from "../../components/blogCard";
import Head from "next/head";

const blogs = [
  {
    href: "blog/dev-To-Senior-Dev",
    title: "From Developer To Senior Developer",
    description:
      "My thoughts on what a software senior developer should be. A Retrospective on my role as a senior developer.",
    thumbnail: "images/devTosDev-thumb.png",
    metadata: "2022-08-22",
  },
  {
    href: "blog/azure-func",
    title: "Azure Functions for the Faint of Heart",
    description:
      "Azure Functions is a service provided by Microsoft that allows you to create back-end code without having to deal with server management, configuration and routing. It's all packed into a simple package that takes 10 min to setup.",
    thumbnail: "images/AzFunc-thumb.png",
    metadata: "2018-09-12",
  },
  {
    href: "blog/azFunc-durOrch",
    title: "Durable Orchestration a bird's eye view",
    description:
      "The FaaS architecture is quite fascinating. Not due to its simplicity or its rapid development, but because of the way it works when it's in the cloud. How does an Azure function work in the cloud you ask?",
    thumbnail: "images/durOrch-thumb.png",
    metadata: "2019-10-23",
  },
];

export default function Blog() {
  return (
    <Master>
      <Head>
        <title>Bardia Jedi - Blog</title>
      </Head>
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* <h1>Serverless - Azure functions</h1> */}
        {blogs.map((blog, ix) => (
          <BlogCard key={ix} {...blog} />
        ))}
      </section>
    </Master>
  );
}
