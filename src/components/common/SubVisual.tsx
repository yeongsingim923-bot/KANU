import "../../css/components/common/SubVisual.css";

// 서브 페이지 맨 위 갈색 배너
type SubVisualProps = {
    label: string;   // 작은 회색 글씨 (예: 브랜드 소개)
    title: string;   // 큰 제목 (예: Our Coffee) → 끝에 빨간 점이 자동으로 붙음
    desc?: string;   // 설명 (없어도 됨)
};

function SubVisual({ label, title, desc }: SubVisualProps) {
    return (
        <section className="sub-visual">
            <div className="sub-visual-inner">
                <p className="sub-visual-label">{label}</p>
                <h2 className="sub-visual-title">
                    {title}
                    <span className="sub-visual-dot">.</span>
                </h2>
                {desc && <p className="sub-visual-desc">{desc}</p>}
            </div>
        </section>
    );
}

export default SubVisual;