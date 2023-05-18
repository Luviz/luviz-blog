import Master from '../../components/master'
import MarkdownReader from '../../components/markdownReader'

export default function Blog() {
    return (
        <Master>
            <MarkdownReader url="/md/Durable-Orchestration-a-birds-eye-view.md" />
        </Master>
    )
}