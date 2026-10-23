import "../../css/pages/brand/BrandProduct.css"
import SubVisual from "../../components/common/SubVisual"
import Lnb from "../../components/common/Lnb";

function BrandProduct() {

    return(
        <>
            <SubVisual label="브랜드 소개" title="Our Coffee" desc="언제 어디서나, 원하는 방식대로" />

            <Lnb
                items={[
                    { title: "브랜드", to: "/brand" },
                    { title: "대표 제품", to: "/brand/product" },
                ]}
            />

            <h1>브랜드 대표제품</h1>
        </>
    )
}

export default BrandProduct