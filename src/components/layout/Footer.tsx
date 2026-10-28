import { Link } from "react-router-dom";
import "../../css/components/layout/Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">

                <div className="footer-top">                
                    <Link to="/" className="footer-logo">
                        <img src="/images/logo.png" alt="KANU" />
                    </Link>

                    <ul className="footer-links">
                        <li><Link to="/terms" className="footer-link">이용약관</Link></li>
                        <li><Link to="/privacy" className="footer-link footer-link-bold">개인정보처리방침</Link></li>
                        <li><Link to="/notice" className="footer-link">고객지원</Link></li>
                    </ul>

                    <div className="footer-cs">
                        <strong className="footer-cs-title">고객상담실</strong>
                        <p className="footer-cs-text">
                            스틱 · 머신 · 캡슐 문의 080-025-9114<br />
                            평일 9~17시 (점심 12~13시)
                        </p>
                    </div>
                </div>
               
                <div className="footer-line"></div>
            
                <p className="footer-copy">© KANU Redesign Concept · 웹퍼블리셔 과정 학습용 시안</p>

            </div>
        </footer>
    );
}

export default Footer;