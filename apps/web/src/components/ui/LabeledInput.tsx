import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

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
}: LabeledInputProps) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{t(label)}</Label>
      <Input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        type={type}
        placeholder={placeholder}
        required={required}
        className={className}
      />
    </div>
  );
}
