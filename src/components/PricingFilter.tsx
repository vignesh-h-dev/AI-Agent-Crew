import { cn } from "@/lib/utils";

interface PricingFilterProps {
  options: readonly string[];
  selected: string;
  onSelect: (val: string) => void;
}

const PricingFilter = ({ options, selected, onSelect }: PricingFilterProps) => {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
            selected === opt
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
};

export default PricingFilter;
