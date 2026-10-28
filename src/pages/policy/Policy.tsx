import { useLocation } from "react-router-dom"
import Lnb from "../../components/common/Lnb"
import SubVisual from "../../components/common/SubVisual"
import "../../css/pages/policy/Policy.css"

// 약관 한 조항
type Clause = { title: string; body: string }

// ===== 이용약관 =====
const TERMS: Clause[] = [
    { title: "제1조 (목적)", body: "이 약관은 KANU 리디자인 사이트(이하 '사이트')가 제공하는 스토어, 커뮤니티, 고객지원 서비스의 이용 조건과 절차를 정합니다." },
    { title: "제2조 (회원가입)", body: "회원가입은 이용약관과 개인정보 수집·이용에 동의하고, 만 14세 이상인 경우에 할 수 있습니다.\n아이디, 이메일, 휴대폰 번호는 다른 회원과 중복될 수 없습니다." },
    { title: "제3조 (회원정보 변경과 탈퇴)", body: "회원은 마이페이지에서 언제든지 정보를 바꾸거나 탈퇴할 수 있습니다.\n탈퇴하면 주문 기록, 작성한 글과 댓글, 1:1 문의가 함께 삭제되며 되돌릴 수 없습니다." },
    { title: "제4조 (주문과 배송)", body: "주문 금액은 주문 시점의 판매가로 계산되며, 할인가 합계 30,000원 이상이면 배송비가 무료입니다.\n주문은 '결제 완료' 상태일 때만 마이페이지에서 취소할 수 있습니다." },
    { title: "제5조 (게시물)", body: "회원이 작성한 글과 댓글의 책임은 작성자에게 있습니다.\n광고, 욕설, 개인정보가 담긴 게시물은 예고 없이 삭제될 수 있습니다." },
    { title: "제6조 (금지 행위)", body: "다른 사람의 정보를 도용하거나, 사이트 운영을 방해하거나, 다른 회원에게 피해를 주는 행위를 해서는 안 됩니다." },
]

// ===== 개인정보처리방침 (이 사이트가 실제로 저장하는 정보 기준) =====
const PRIVACY: Clause[] = [
    { title: "1. 수집하는 개인정보", body: "회원가입: 아이디, 비밀번호(암호화하여 저장), 성함, 생년월일, 휴대폰 번호, 이메일(선택), 마케팅 정보 수신 동의 여부\n주문: 받는 분, 연락처, 배송지, 배송 요청사항\n1:1 문의: 성함, 연락처, 이메일(선택), 문의 내용과 첨부 사진" },
    { title: "2. 이용 목적", body: "회원 확인과 로그인 유지, 주문 처리와 배송 안내, 1:1 문의 답변, (동의한 경우) 이벤트·혜택 안내에 사용합니다." },
    { title: "3. 보관 기간", body: "회원 탈퇴 시 회원 정보와 주문 기록, 작성한 글·댓글, 1:1 문의를 즉시 삭제합니다." },
    { title: "4. 브라우저에 저장되는 정보", body: "로그인 상태 유지를 위한 쿠키, 장바구니와 최근 검색어는 이용하는 브라우저에만 저장되며 서버로 보내지 않습니다.\n브라우저 설정에서 언제든지 지울 수 있습니다." },
    { title: "5. 회원의 권리", body: "회원은 마이페이지에서 자신의 정보를 확인·수정하고, 마케팅 수신 동의를 바꾸거나 탈퇴할 수 있습니다." },
    { title: "6. 문의", body: "개인정보와 관련된 문의는 고객지원 > 1:1 문의로 남겨주세요." },
]

// 이용약관(/terms) · 개인정보처리방침(/privacy): 같은 화면을 주소에 따라 내용만 바꿔서 씀
function Policy() {
    const { pathname } = useLocation()
    const isPrivacy = pathname === "/privacy"
    const clauses = isPrivacy ? PRIVACY : TERMS

    return (
        <>
            <SubVisual
                label={isPrivacy ? "개인정보처리방침" : "이용약관"}
                title={isPrivacy ? "Privacy" : "Terms"}
                desc="KANU 서비스 이용에 필요한 내용을 안내해드려요"
            />
            <Lnb
                items={[
                    { title: "이용약관", to: "/terms" },
                    { title: "개인정보처리방침", to: "/privacy" },
                ]}
            />
            <article className="policy">
                <p className="policy-note">이 문서는 웹퍼블리셔 과정 학습용 리디자인 시안의 예시 문서입니다.</p>
                {clauses.map((c) => (
                    <section key={c.title} className="policy-clause">
                        <h3>{c.title}</h3>
                        <p>{c.body}</p>
                    </section>
                ))}
            </article>
        </>
    )
}

export default Policy
