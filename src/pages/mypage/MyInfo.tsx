import Lnb from "../../components/common/Lnb"
import SubVisual from "../../components/common/SubVisual"
import "../../css/pages/mypage/MyInfo.css"

function MyInfo() {

    return(
        <>
            <SubVisual label="마이페이지" title="My Page" desc="주문과 활동 내역을 한눈에 확인하세요" />

            <Lnb
                items={[
                    { title: "주문 내역", to: "/mypage" },
                    { title: "회원 정보 수정", to: "/mypage/info" },
                    { title: "내가 쓴 글", to: "/mypage/posts" },
                    { title: "1:1 문의 내역", to: "/mypage/qna" },
                    
                ]}
            />

            <h1>회원정보</h1>
        </>
    )
}

export default MyInfo