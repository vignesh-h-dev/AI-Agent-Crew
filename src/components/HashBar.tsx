const HashBar = () => {
  const hash = "0xA3F8...7B2D · BLOCK #4821 · SHA-256 · INTEGRITY ✓ · NODE VERIFIED · CHAIN ACTIVE";
  return (
    <div className="w-full overflow-hidden bg-foreground/[0.03] border-b border-border">
      <div className="animate-slide-hash whitespace-nowrap py-1.5">
        <span className="hash-text inline-block">
          {`${hash} · ${hash} · ${hash} · ${hash}`}
        </span>
      </div>
    </div>
  );
};

export default HashBar;
