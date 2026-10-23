import { Link } from "react-router-dom"
import Lnb from "../../components/common/Lnb"
import Reveal from "../../components/common/Reveal"
import SubVisual from "../../components/common/SubVisual"
import "../../css/pages/brand/BrandStory.css"

const lineup = [
    {eng: "STICK" , name: "카누 스틱커피" , desc: "언제 어디서든 간편하게" , img: "/images/brand/lineup-stick.png" , to:"/store?cat=stick"},
    {eng: "MACHINE" , name: "카누 바리스타 머신" , desc: "기술력과 모던한 스타일" , img: "/images/brand/lineup-machine.png" , to:"/store?cat=machine"},
    {eng: "CAPSULE" , name: "카누 캡슐커피" , desc: "한층 진한 한잔" , img: "/images/brand/lineup-capsule.png" , to:"/store?cat=capsule"},
]

const valueTitle = "A Moment For You."

function BrandStory() {

    return(
        <>
            <SubVisual label="브랜드 소개" title="Our Story" desc="세상에서 가장 작은 카페, 카누" />

            <Lnb
                items={[
                    { title: "브랜드", to: "/brand" },
                    { title: "대표 제품", to: "/brand/product" },
                ]}
            />

            <section className="brand-intro brand-inner">
                <div className="brand-intro-text">
                    <Reveal>
                        <p className="brand-eyebrow">SINCE 2011</p>
                        <h3 className="brand-title">세상에서 가장 작은 카페</h3>
                        <p className="brand-intro-desc">
                            2011년, 스틱 한 봉에 카페를 담는 것에서 시작했습니다.<br/>
                            지금은 스틱부터 캡슐, 머신까지 원하는 방식대로 즐기는 커피를 만듭니다.
                        </p>
                    </Reveal>
                </div>

                <div className="brand-intro-pic">
                    <Reveal delay={0.2}>
                        <img src="/images/brand/grinder.png" alt="커피 그라인더 일러스트" className="brand-intro-img" />
                    </Reveal>
                </div>
            </section>

            <section className="brand-value">
                <Reveal>
                    <p className="brand-value-label">OUR VALUE</p>

                    <h3 className="brand-value-title">
                        {valueTitle.split("").map((char, index) => (
                            <span
                                key={index}
                                className="brand-value-char"
                                style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                            >
                                {char === " " ? "\u00A0" : char}
                            </span>
                        ))}
                    </h3>

                    <p className="brand-value-desc">바쁜 하루 속 잠시 멈추고, 나에게 집중하는 시간</p>
                </Reveal>
            </section>

            <section className="brand-lineup brand-inner">
                <div className="brand-lineup-head">
                    <div>
                        <p className="brand-eyebrow">KANU LINE-UP</p>
                        <h3 className="brand-title">원하는 방식대로 즐기는 카누</h3>
                    </div>
                    <Link to="/brand/product" className="brand-lineup-btn">제품 전체 보기</Link>
                </div>

                <ul className="brand-lineup-list">
                    {lineup.map((item) => (
                        <li key={item.eng}>
                            <Link to={item.to}>
                                <div className="brand-lineup-img"><img src={item.img} alt={item.name} /></div>
                                <p className="brand-lineup-eng">{item.eng}</p>
                                <p className="brand-lineup-name">{item.name}</p>
                                <p className="brand-lineup-desc">{item.desc}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="brand-cta">
                <div className="brand-cta-box">
                    <div>
                        <p className="brand-cta-eng">START YOUR MOMENT</p>
                        <h3 className="brand-cta-title">
                            오늘, 카누와 함께<br/>
                            나만의 순간을
                        </h3>
                    </div>
                    <Link to="/store" className="brand-cta-btn">스토어 바로가기</Link>
                </div>
            </section>
    
        </>
    )
}

export default BrandStory