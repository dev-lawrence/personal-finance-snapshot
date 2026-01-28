import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function Filters({
  category,
  onCategory,
}: {
  category: string;
  onCategory: (c: string) => void;
}) {
  return (
    <Select value={category} onValueChange={onCategory}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="All categories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="food">Food</SelectItem>
        <SelectItem value="rent">Rent</SelectItem>
        <SelectItem value="transport">Transport</SelectItem>
        <SelectItem value="entertainment">Entertainment</SelectItem>
        <SelectItem value="other">Other</SelectItem>
        <SelectItem value="income">Income</SelectItem>
      </SelectContent>
    </Select>
  );
}
