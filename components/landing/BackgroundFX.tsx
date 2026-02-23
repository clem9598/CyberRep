export function BackgroundFX() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(56,189,248,0.14),transparent_32%),radial-gradient(circle_at_85%_8%,rgba(147,51,234,0.18),transparent_30%),radial-gradient(circle_at_80%_75%,rgba(14,165,233,0.12),transparent_34%)]" />
      <div className="soft-glow absolute -left-24 top-24 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="soft-glow absolute -right-16 top-1/3 h-80 w-80 rounded-full bg-fuchsia-400/12 blur-3xl [animation-delay:1s]" />
      <svg
        className="absolute inset-0 h-full w-full opacity-60"
        viewBox="0 0 1440 1100"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="flowGradient" x1="0" y1="0" x2="1440" y2="1100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" stopOpacity="0.32" />
            <stop offset="1" stopColor="#C084FC" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <path
          className="data-flow"
          d="M-90 260C180 220 260 380 490 350C700 324 790 126 1010 168C1220 210 1330 350 1540 300"
          stroke="url(#flowGradient)"
          strokeWidth="1.4"
          strokeDasharray="8 16"
        />
        <path
          className="data-flow [animation-duration:20s]"
          d="M-120 540C190 590 250 470 520 500C760 530 810 710 1040 700C1270 688 1370 528 1540 560"
          stroke="url(#flowGradient)"
          strokeWidth="1.2"
          strokeDasharray="10 14"
        />
        <path
          className="data-flow [animation-duration:22s]"
          d="M-50 820C250 770 320 920 560 880C830 836 880 670 1130 700C1320 722 1390 860 1540 850"
          stroke="url(#flowGradient)"
          strokeWidth="1.2"
          strokeDasharray="6 12"
        />
        <circle cx="170" cy="200" r="2.2" fill="#7DD3FC" />
        <circle cx="480" cy="330" r="2.4" fill="#A5B4FC" />
        <circle cx="780" cy="170" r="2.1" fill="#7DD3FC" />
        <circle cx="1110" cy="250" r="2.5" fill="#C4B5FD" />
        <circle cx="350" cy="540" r="1.8" fill="#7DD3FC" />
        <circle cx="880" cy="670" r="2.2" fill="#93C5FD" />
        <circle cx="1180" cy="540" r="2.1" fill="#C4B5FD" />
        <circle cx="620" cy="860" r="2" fill="#7DD3FC" />
        <circle cx="990" cy="760" r="1.9" fill="#A5B4FC" />
      </svg>
    </div>
  );
}
