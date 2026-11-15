import type { Metadata } from 'next';
import { Gamja_Flower } from 'next/font/google';
import './globals.css';

// 기본 글꼴 Gamja Flower (JavaScript Todo List와 같은 글꼴)
// next/font가 빌드 때 글꼴을 내려받아 같은 도메인에서 제공하므로 외부 요청과 레이아웃 흔들림이 없다.
const gamjaFlower = Gamja_Flower({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-gamja-flower',
});

export const metadata: Metadata = {
    title: 'TODO 리스트',
    description: 'Next.js + Supabase 회원 전용 할 일 관리',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
    return (
        <html lang="ko" className={gamjaFlower.variable}>
            <body>{children}</body>
        </html>
    );
}
