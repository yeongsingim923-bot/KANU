import { Link } from "react-router-dom"
import type { Product } from "../../data/products"
import "../../css/components/common/CartModal.css"
import { won } from "../../utils/format"

// 장바구니 담기 누르면 뜨는 팝업
type CartModalProps = {
    item: Product          // 담은 제품
    qty: number            // 담은 수량
    onClose: () => void    // 닫기 (부모가 넘겨줌)
}

function CartModal({ item, qty, onClose }: CartModalProps) {
    return (
        // 어두운 배경: 누르면 닫힘
        <div className="cart-modal-dim" onClick={onClose}>
            {/* 흰 박스: 안쪽을 눌렀을 땐 안 닫히게 막기 */}
            <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="cart-modal-close" onClick={onClose}>X</button>

                <h3 className="cart-modal-title">장바구니에 담았어요</h3>

                <div className="cart-modal-item">
                    <div className="cart-modal-img">
                        <img src={item.img} alt={item.name} />
                    </div>
                    <div>
                        <p className="cart-modal-name">{item.name}</p>
                        <p className="cart-modal-info">{qty}개 · {won(item.price * qty)}</p>
                    </div>
                </div>

                <div className="cart-modal-btns">
                    <button type="button" className="cart-modal-continue" onClick={onClose}>계속 쇼핑하기</button>
                    <Link to="/cart" className="cart-modal-go">장바구니 가기</Link>
                </div>
            </div>
        </div>
    )
}

export default CartModal