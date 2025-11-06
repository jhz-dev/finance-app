import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type LabeledInputProps = {
  label: string;
  id: string;
  name?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  orientation?: "vertical" | "horizontal";
};

export function LabeledInput({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  type = "text",
  placeholder,
  required,
  className,
  labelClassName,
  orientation = "vertical",
}: LabeledInputProps) {
  const { t } = useTranslation();

  const wrapperClasses = cn({
    "grid gap-2": orientation === "vertical",
    "grid grid-cols-4 items-center gap-4": orientation === "horizontal",
  });

  const labelClasses = cn(labelClassName, {
    "text-right": orientation === "horizontal",
  });

  const inputClasses = cn(className, {
    "col-span-3": orientation === "horizontal",
  });

  return (
    <div className={wrapperClasses}>
      <Label htmlFor={id} className={labelClasses}>
        {t(label)}
      </Label>
      <Input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        type={type}
        placeholder={placeholder}
        required={required}
        className={inputClasses}
      />
    </div>
  );
}
