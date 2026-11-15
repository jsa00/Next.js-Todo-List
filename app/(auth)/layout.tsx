// 로그인·회원가입 공통 레이아웃 (라우트 그룹이라 주소에는 (auth)가 붙지 않는다.)
export default function AuthLayout({
    children,
}: {
    children: React.ReactNode; // 로그인 또는 회원가입 페이지
}) {
    return (
        <main className="mx-auto max-w-xl pt-10">
            <p className="mb-6 text-center text-gray-500">
                할 일을 관리하려면 로그인이 필요합니다.
            </p>
            {children}
        </main>
    );
}
