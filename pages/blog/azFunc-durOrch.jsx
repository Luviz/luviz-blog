import Head from 'next/head'
import MyApp from '../_app'
import Master from '../../components/master'
import MarkdownReader from '../../components/markdownReader'

export default function Blog1() {
    return (
        <Master>
            <MarkdownReader url="/md/Durable-Orchestration-a-birds-eye-view.md" />
        </Master>
    )
}