export default function Footer() {
  return (
    <footer className="bg-forestDeep mt-24 pt-12 pb-8">
      <div className="max-w-site mx-auto px-8 text-cream/65">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-3.5">
          <div className="font-serif font-black text-lg text-cream">냥사주</div>
          <div className="flex gap-5 text-xs">
            <span className="cursor-pointer hover:text-cream">이용약관</span>
            <span className="cursor-pointer hover:text-cream">개인정보처리방침</span>
            <span className="cursor-pointer hover:text-cream">문의하기</span>
          </div>
        </div>
        <p className="text-[12.5px] mb-5">우리 냥이의 오늘을 가장 먼저 만나는 곳</p>
        <p className="text-[11px] opacity-70 border-t border-cream/10 pt-5">
          © 2026 Cat4ever. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
