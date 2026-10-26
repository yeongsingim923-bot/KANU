import SubVisual from "../../components/common/SubVisual"
import "../../css/pages/member/Join.css"

function Join() {

    return(
        <>
            <SubVisual label="회원가입" title="Join Us" desc="카누 회원이 되어 다양한 혜택을 받아보세요" />
            <div className="join">
                <form>
                    <div className="agreement">
                        <span>약관동의</span>
                        <ul>
                            <li>
                                <input type="checkbox" id="agree-all" />
                                <span>전체 동의합니다.</span>
                            </li>
                            <li>
                                <input type="checkbox" className="agree required"/>
                                <div className="agree-text">    
                                    <span>[필수] 이용약관 동의</span>
                                    <span className="hidden" hidden>약관에 동의해주세요</span>
                                </div>
                            </li>
                            <li>
                                <input type="checkbox" className="agree required"/>
                                <div className="agree-text">
                                    <span>[필수] 개인정보 수집 · 이용 동의</span>
                                    <span className="hidden" hidden>약관에 동의해주세요</span>
                                </div>
                            </li>
                            <li>
                                <input type="checkbox" className="agree required"/>
                                <div className="agree-text">
                                    <span>[필수] 만 14세 이상입니다</span>
                                    <span className="hidden" hidden>약관에 동의해주세요</span>
                                </div>
                            </li>
                            <li>
                                <input type="checkbox" className="agree"/>
                                <span>[선택] 마케팅 정보 수신 동의 (이메일 · SMS)</span>
                            </li>
                        </ul>
                    </div>
                    <div className="id">
                        <label>
                            <span>아이디</span>
                            <input id="username" placeholder="영문, 숫자 4~16자" required pattern="[A-Za-z0-9]{4,16}" autoComplete="username" />
                            <span className="hidden" id="id-format-msg" hidden>아이디를 영문, 숫자 4~16자로 입력해주세요.</span>
                            <span className="hidden" id="id-msg" hidden></span>
                        </label>
                        <button type="button" id="check-id">중복확인</button>
                    </div>
                    <div>
                        <label>
                            <span>비밀번호</span>
                            <input id="password" type="password" required minLength={8} autoComplete="new-password"/>
                            <span className="hidden" id="ps-msg" hidden>비밀번호는 8자리 이상 입력해주세요</span>
                        </label>
                        <label>
                            <span>비밀번호 확인</span>
                            <input id="passwordCheck" type="password" required autoComplete="new-password"/>
                            <span className="hidden" id="ps-check-msg" hidden>입력하신 비밀번호가 일치하지 않습니다.</span>
                        </label>
                    </div>
                    <div>
                        <label>
                            <span>성함</span>
                            <input/>
                        </label>
                        <label>
                            <span>생년월일 확인</span>
                            <input id="birth" placeholder="00.00.00" required pattern="\d{2}\.\d{2}\.\d{2}" inputMode="numeric" maxLength={8} 
                            title="생년월일 6자리 (예: 99.01.31)" />
                            <span className="hidden" id="birth-msg" hidden>6자리로 입력해주세요.</span>
                        </label>
                    </div>
                    <div>
                        <label>
                            <span>휴대폰 번호</span>
                            <input id="phone" placeholder="010-0000-0000" required pattern="010-\d{4}-\d{4}" inputMode="numeric" maxLength={13} 
                            title="010-0000-0000"/>
                            <button type="button" className="hidden-btn" id="phone-btn" hidden>인증요청</button>
                        </label>
                        <label>
                            <span>인증번호</span>
                            <input/>
                        </label>
                    </div>
                    <div>       {/* 기능상 아무의미 없지만 스타일통일때문에 */}
                        <label>
                            <span>이메일</span>
                                <input id="email" type="email" placeholder="you@example.com" autoComplete="email"/>
                            <span className="hidden" id="email-format-msg" hidden>올바른 이메일 형식이 아닙니다.</span>
                            <span className="hidden" id="email-msg" hidden>이미 가입된 이메일입니다.</span>
                        </label>
                    </div>
                    <button>회원 가입하기</button>
                </form>
            </div>
            
        </>
    )
}

export default Join