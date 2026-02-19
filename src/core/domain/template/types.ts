export interface TemplatePreview {
  id: string;
  category: string;
  subcategory?: string;
  name: {
    en: string;
    ua: string;
    ru: string;
  };
  description: {
    en: string;
    ua: string;
    ru: string;
  };
  icon: string;
  tags: string[];
  isPopular?: boolean;
  color?: string;
  categoryInfo?: {
    id: string;
    name: {
      en: string;
      ua: string;
      ru: string;
    };
    icon: string;
  };
}