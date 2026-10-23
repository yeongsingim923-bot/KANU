import Lnb from "../../components/common/Lnb"
import SubVisual from "../../components/common/SubVisual"
import "../../css/pages/brand/BrandStory.css"

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
        
            <h1>브랜드 스토리</h1>
        </>
    )
}

export default BrandStory