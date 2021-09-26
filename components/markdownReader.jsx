/* eslint-disable @next/next/no-script-in-head */
/* eslint-disable @next/next/no-css-tags */
import { useEffect, useState } from "react"
const marked = require('marked');
import Head from "next/head";
import styles from "../styles/markdownReader.module.css";
import Script from "next/script";

export default function MarkdownReader({ url, title = "" }) {
    const [content, setContent] = useState(<span>loading...</span>)
    // fetch
    useEffect(_ => {
        marked.setOptions({
            renderer: marked.Renderer(),
            highlight: function (code, lang) {
                const hljs = require('highlight.js');
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, { language }).value;
            },
            langPrefix: 'hljs language-',
            pedantic: false,
            gfm: true,
            breaks: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            xhtml: false
        })

        fetch(url).then(res => res.text()).then(async (src) => {
            const xml = marked(src)
            setContent(xml)
        })
    }, [url])


    return <section className={styles.container}>
        <Head>
            <link rel="stylesheet" href="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.2.0/build/styles/vs2015.min.css" />
        </Head>
        <h2 hidden={title?.length < 1}>{title}</h2>
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
    </section>
}