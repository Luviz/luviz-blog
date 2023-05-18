
import Master from '../../components/master'
import MarkdownReader from '../../components/markdownReader'

export default function Blog() {
    return (
        <Master>
            <MarkdownReader url="/md/From-Developer-To-Senior-Developer/Readme.md" />
        </Master>
    )
}