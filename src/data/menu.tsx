export const menus = [
    {
        title: "카누 소개",
        to: "/brand",
        subs: [
            { title: "브랜드", to: "/brand" },
            { title: "대표 제품소개", to: "/brand/product" },
        ],
    },

    {
        title: "스토어",
        to: "/store",
        subs: [
            { title: "전체 상품", to: "/store" },
            { title: "스틱커피", to: "/store?cat=stick" },
            { title: "머신", to: "/store?cat=machine" },
            { title: "캡슐커피", to: "/store?cat=capsule" },
        ],
    },

    {
        title: "게시판",
        to: "/board",
        subs: [
            { title: "자유게시판", to: "/board" },
            { title: "글쓰기", to: "/board/write" },
        ],
    },

    {
        title: "고객지원",
        to: "/notice",
        subs: [
            { title: "공지사항", to: "/notice" },
            { title: "1:1 문의", to: "/qna" },
        ],
    },

];