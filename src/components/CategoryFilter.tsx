import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: readonly string[];
  selected: string;
  onSelect: (cat: string) => void;
}

const CategoryFilter = ({ categories, selected, onSelect }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2" id="categories">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            selected === cat
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
