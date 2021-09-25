import MyApp from '../_app'
import Master from '../../components/master'
import MarkdownReader from '../../components/markdownReader'

export default function Blog() {
    return (
        <Master>
            {/* <MarkdownReader url="/md/Azure-Functions-for-the-Faint-of-Heart.md" /> */}

            <ol style={{ color: "#fff" }}>
                <li><a href="blog/azure-func">Azure function</a></li>
                <li><a href="blog/azFunc-durOrch">Orch</a></li>
            </ol>
        </Master>
    )
}