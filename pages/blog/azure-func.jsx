import Master from '../../components/master'
import MarkdownReader from '../../components/markdownReader'

export default function Blog() {
    return (
        <Master>
            <MarkdownReader url="/md/Azure-Functions-for-the-Faint-of-Heart.md" />
        </Master>
    )
}