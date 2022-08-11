import { useEffect, useState } from "react"
import {marked, Renderer} from 'marked'
import styles from "../styles/markdownReader.module.css";


export default function MarkdownReader({ url, title = "" }) {
    const [content, setContent] = useState(<span>loading...</span>)
    // fetch
    useEffect(_ => {
        marked.setOptions({
            renderer: new Renderer(),
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
        <h2 hidden={title?.length < 1}>{title}</h2>
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
    </section>
}