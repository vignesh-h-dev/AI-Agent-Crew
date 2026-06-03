import { Shield, Lock, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlockchainBadgeProps {
  variant?: "verified" | "secured" | "chained";
  size?: "sm" | "md";
  className?: string;
}

const variants = {
  verified: { icon: Shield, label: "Verified", color: "text-chain bg-chain/10 border-chain/30" },
  secured: { icon: Lock, label: "Secured", color: "text-primary bg-primary/10 border-primary/30" },
  chained: { icon: Link2, label: "On-Chain", color: "text-chain bg-chain/10 border-chain/30" },
};

const BlockchainBadge = ({ variant = "verified", size = "sm", className }: BlockchainBadgeProps) => {
  const v = variants[variant];
  const Icon = v.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-mono font-medium",
        v.color,
        size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-3 py-1",
        className
      )}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {v.label}
    </span>
  );
};

export default BlockchainBadge;
