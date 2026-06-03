import { motion } from "framer-motion";
import { ExternalLink, Sparkles, Star, Shield, Fingerprint } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BlockchainBadge from "./BlockchainBadge";
import type { AITool } from "@/data/tools";

interface ToolCardProps {
  tool: AITool;
  index: number;
}

const generateHash = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  return `0x${Math.abs(hash).toString(16).padStart(8, "0").toUpperCase().slice(0, 8)}`;
};

const ToolCard = ({ tool, index }: ToolCardProps) => {
  return (
    <motion.a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="group relative block rounded-xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
    >
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-chain/60 via-primary/40 to-chain/60" />

      <div className="p-5">
        {/* Icon row - positioned top right with security badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xl font-display glow-primary">
            {tool.name.charAt(0)}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <BlockchainBadge variant="verified" />
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Title & category */}
        <h3 className="font-semibold font-display text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5 mb-0.5">
          {tool.name}
          {tool.isFeatured && <Star className="h-3.5 w-3.5 text-primary fill-primary" />}
        </h3>
        <span className="text-xs text-muted-foreground font-mono">{tool.category}</span>

        <p className="text-sm text-muted-foreground mt-2 mb-4 line-clamp-2">{tool.description}</p>

        {/* Bottom: badges & hash */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex flex-wrap gap-1.5">
            {tool.isNew && (
              <Badge className="bg-accent text-accent-foreground text-[10px] px-2 py-0.5 hover:bg-accent/90">
                <Sparkles className="h-3 w-3 mr-1" /> New
              </Badge>
            )}
            <Badge variant="secondary" className="text-[10px] px-2 py-0.5">{tool.pricing}</Badge>
          </div>
          <span className="hash-text flex items-center gap-1">
            <Fingerprint className="h-3 w-3" />
            {generateHash(tool.name)}
          </span>
        </div>
      </div>
    </motion.a>
  );
};

export default ToolCard;
