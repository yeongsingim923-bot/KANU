import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

import BrandStory from "./pages/brand/BrandStory";
import BrandProduct from "./pages/brand/BrandProduct";

import Store from "./pages/store/Store";
import Detail from "./pages/store/Detail";
import Cart from "./pages/store/Cart";
import Checkout from "./pages/store/Checkout";
import OrderComplete from "./pages/store/OrderComplete";

import Search from "./pages/search/Search";

import Login from "./pages/member/Login";
import Join from "./pages/member/Join";

import MyOrders from "./pages/mypage/MyOrders";
import MyOrderDetail from "./pages/mypage/MyOrderDetail";
import MyInfo from "./pages/mypage/MyInfo";
import MyPosts from "./pages/mypage/MyPosts";
import MyQna from "./pages/mypage/MyQna";

import Board from "./pages/board/Board";
import BoardWrite from "./pages/board/BoardWrite";
import BoardView from "./pages/board/BoardView";

import Notice from "./pages/support/Notice";
import Qna from "./pages/support/Qna";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        {/* 카누 소개 */}
        <Route path="/brand" element={<BrandStory />} />
        <Route path="/brand/product" element={<BrandProduct />} />

        {/* 스토어 */}
        <Route path="/store" element={<Store />} />
        <Route path="/store/:id" element={<Detail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-complete" element={<OrderComplete />} />

        {/* 검색 결과 */}
        <Route path="/search" element={<Search />} />

        {/* 회원 */}
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />

        {/* 마이페이지 */}
        <Route path="/mypage" element={<MyOrders />} />
        <Route path="/mypage/order/:id" element={<MyOrderDetail />} />
        <Route path="/mypage/info" element={<MyInfo />} />
        <Route path="/mypage/posts" element={<MyPosts />} />
        <Route path="/mypage/qna" element={<MyQna />} />

        {/* 게시판 */}
        <Route path="/board" element={<Board />} />
        <Route path="/board/write" element={<BoardWrite />} />
        <Route path="/board/:id" element={<BoardView />} />

        {/* 고객지원 */}
        <Route path="/notice" element={<Notice />} />
        <Route path="/qna" element={<Qna />} />        
      </Route>

      {/* 없는 주소 → 404 */}
        <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;