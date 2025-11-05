import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface LabeledSelectProps<T extends string> {
  label?: string;
  value: T;
  options: { value: T; label: string }[];
  onValueChange: (value: T) => void;
  id?: string;
  orientation?: "vertical" | "horizontal";
  placeholder?: string;
  className?: string;
  labelClassName?: string;
}

export function LabeledSelect<T extends string>({
  label,
  value,
  options,
  onValueChange,
  id,
  orientation = "vertical",
  placeholder,
  className,
  labelClassName,
}: LabeledSelectProps<T>) {
  const { t } = useTranslation();

  const wrapperClasses = cn({
    "grid gap-2": orientation === "vertical" && label,
    "grid grid-cols-4 items-center gap-4": orientation === "horizontal" && label,
  });

  const labelClasses = cn(labelClassName, {
    "text-right": orientation === "horizontal",
  });

  const selectTriggerClasses = cn(className, {
    "col-span-3": orientation === "horizontal" && label,
  });

  return (
    <div className={wrapperClasses}>
      {label && (
        <Label htmlFor={id} className={labelClasses}>
          {t(label)}
        </Label>
      )}
      <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger id={id} className={selectTriggerClasses}>
          <SelectValue placeholder={t(placeholder ?? "Select an option")} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {t(option.label)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
