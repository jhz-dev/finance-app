import { useLanguageStore } from '@/domain/language/language.store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-[100%]">
        <SelectValue placeholder={t('Language')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="es">Español</SelectItem>
      </SelectContent>
    </Select>
  );
}
