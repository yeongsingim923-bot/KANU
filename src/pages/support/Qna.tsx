import Lnb from "../../components/common/Lnb"
import SubVisual from "../../components/common/SubVisual"
import "../../css/pages/support/Qna.css"

function Qna() {

    return(
        <>
            <SubVisual label="1:1 문의" title="Contact Us" desc="궁금한 점을 남겨주시면 빠르게 답변드릴게요" />

            <Lnb
                items={[
                    { title: "공지사항", to: "/notice" },
                    { title: "1:1 문의", to: "/qna" },
                ]}
            />
            <h1>1:1 문의</h1>
        </>
    )
}

export default Qna