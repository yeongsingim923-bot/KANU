import Lnb from "../../components/common/Lnb"
import SubVisual from "../../components/common/SubVisual"
import "../../css/pages/support/Notice.css"

function Notice() {

    return(
        <>
            <SubVisual label="공지사항" title="Notice" desc="카누의 새로운 소식을 알려드려요" />

            <Lnb
                items={[
                    { title: "공지사항", to: "/notice" },
                    { title: "1:1 문의", to: "/qna" },
                ]}
            />

            <h1>공지사항</h1>
        </>
    )
}

export default Notice