export function FloatingMobileCTA() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#beb086] pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_20px_rgba(0,0,0,0.3)]">
      <a
        href="https://book.ctme.io/consultation?utm_content=mobile-sticky"
        className="flex items-center justify-center gap-2 w-full h-[60px] text-base font-bold text-black"
      >
        Get Your Free Quote <span>→</span>
      </a>
    </div>
  );
}
