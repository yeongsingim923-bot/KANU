import "../../css/pages/brand/BrandProduct.css"
import SubVisual from "../../components/common/SubVisual"
import Lnb from "../../components/common/Lnb";
import { useState, type CSSProperties } from "react";
import Reveal from "../../components/common/Reveal";
import { Link } from "react-router-dom";

/*대표 제품 데이터*/
const productData = {
    stick: {
        tab: "스틱커피",
        title: "카누 스틱커피",
        intro: "집에서도, 사무실에서도, 이동 중에도. 카누 한 봉이면 그곳이 나만의 카페가 됩니다.",
        slogan: "어디서든 나를 위한 커피 한 잔",
        points: [
            { title: "최적의 블렌딩", desc: "전문가들이 오랜 연구로 찾은 비율" },
            { title: "저온 추출 공법", desc: "커피 본연의 향을 섬세하게 담아냄" },
            { title: "취향대로 4가지", desc: "아메리카노 · 스위트 · 시그니처 · 라떼" },
        ],
        items: [
            { eng: "AMERICANO", name: "카누 아메리카노", desc: "풍부하고 깔끔한 기본의 맛", img: "/images/brand/product/stick-americano.png", to: "/store?cat=stick" },
            { eng: "LATTE", name: "카누 라떼", desc: "부드러운 우유와 진한 커피의 조화", img: "/images/brand/product/stick-latte.png", to: "/store?cat=stick" },
        ],
    },
    machine: {
        tab: "바리스타 머신",
        title: "카누 바리스타 머신",
        intro: "버튼 하나로 완성되는 홈카페. 카누 캡슐을 넣으면 매일 같은 맛의 커피가 내려집니다.",
        slogan: "버튼 하나로 시작하는 나만의 카페",
        points: [
            { title: "원터치 추출", desc: "버튼 하나로 간편하게" },
            { title: "컴팩트 디자인", desc: "어디에 두어도 어울리는 크기" },
            { title: "빠른 예열", desc: "기다림 없이 바로 한 잔" },
        ],
        items: [
            { eng: "BARISTA MINI", name: "카누 바리스타 미니", desc: "작지만 충실한 한 잔", img: "/images/brand/product/machine-mini.jpg", to: "/store?cat=machine" },
            { eng: "BARISTA CLASSIC", name: "카누 바리스타 클래식", desc: "모던한 디자인, 깊은 추출", img: "/images/brand/product/machine-classic.jpg", to: "/store?cat=machine" },
        ],
    },
    capsule: {
        tab: "캡슐 커피",
        title: "카누 캡슐커피",
        intro: "캡슐 하나에 담긴 카페의 한 잔. 머신에 넣기만 하면 언제나 일정한 맛을 즐길 수 있습니다.",
        slogan: "한층 진한 한 잔",
        points: [
            { title: "신선한 밀봉", desc: "한 잔씩 개별 포장" },
            { title: "균일한 맛", desc: "언제 내려도 같은 맛" },
            { title: "강도별 선택", desc: "라이트 · 미디엄 · 다크" },
        ],
        items: [
            { eng: "LIGHT ROAST", name: "카누 캡슐 라이트", desc: "산뜻하고 부드러운 맛", img: "/images/brand/product/capsule-light.jpg", to: "/store?cat=capsule" },
            { eng: "DARK ROAST", name: "카누 캡슐 다크", desc: "묵직하고 진한 맛", img: "/images/brand/product/capsule-dark.jpg", to: "/store?cat=capsule" },
        ],
    },
}

type TabKey = keyof typeof productData
const tabKeys: TabKey[] = ["stick", "machine", "capsule"]

function BrandProduct() {

    const [active, setActive] = useState<TabKey>("stick")
    const data = productData[active]

    return(
        <>
            <SubVisual label="브랜드 소개" title="Our Coffee" desc="언제 어디서나, 원하는 방식대로" />

            <Lnb
                items={[
                    { title: "브랜드", to: "/brand" },
                    { title: "대표 제품", to: "/brand/product" },
                ]}
            />

            <div className="product-inner">
                <ul className="product-tabs">
                    {tabKeys.map((tap) => (
                        <li key={tap}>
                            <button
                                type="button"
                                className={active === tap ? "product-tab is-active" : "product-tab"}
                                onClick={ () => setActive(tap)}
                            >
                                {productData[tap].tab}
                            </button>
                        </li>
                    ))}
                </ul>

                <section className="product-intro">
                    <h3 className="product-title">{data.title}</h3>
                    <p className="product-intro-desc">{data.intro}</p>
                    <p className="product-slogan">{data.slogan}</p>
                </section>

                {/* POINT 3개: 선이 늘어나고 → 글자가 순서대로 톡톡 */}
                <Reveal className="product-points-reveal">
                    <ul className="product-points">
                        {data.points.map((point, index) => (
                            <li key={point.title} style={{ "--i": index } as CSSProperties}>
                                <p className="product-point-num">POINT 0{index + 1}</p>
                                <p className="product-point-title">{point.title}</p>
                                <p className="product-point-desc">{point.desc}</p>
                            </li>
                        ))}
                    </ul>
                </Reveal>
                
                <div className="product-list">
                    {data.items.map((item) => (
                        <Reveal key={item.eng} className="product-item">
                            <div className="product-img">
                                <img src={item.img} alt={item.name} />
                            </div>
                            <div className="product-text">
                                <p className="product-eng">{item.eng}</p>
                                <h4 className="product-name">{item.name}</h4>
                                <p className="product-desc">{item.desc}</p>
                                <Link to={item.to} className="product-btn">구매하러 가기</Link>
                            </div>
                        </Reveal>
                    ))}
                </div>

            </div>
        </>
    )
}

export default BrandProduct