import { MuiTelInputCountry } from 'mui-tel-input';

export enum Skills {
  Photography = 'Photography',
  Videography = 'Videography',
  GraphicDesign = 'Graphic Design',
  WebDesign = 'Web Design',
  ContentWriting = 'Content Writing',
  SocialMediaManagement = 'Social Media Management',
  SEO = 'SEO',
  Marketing = 'Marketing',
  Translation = 'Translation',
  VoiceOver = 'Voice Over',
  Animation = 'Animation',
  Illustration = 'Illustration',
}

export enum MediaTypes {
  Images = 'Images',
  Videos = 'Videos',
  Audio = 'Audio',
  Documents = 'Documents',
  Graphics = 'Graphics',
  Animations = 'Animations',
  WebContent = 'Web Content',
  SocialMediaContent = 'Social Media Content',
}

export enum ExperienceLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
  Expert = 'Expert',
}

export enum Regions {
  NorthAmerica = 'North America',
  Europe = 'Europe',
  Asia = 'Asia',
  Africa = 'Africa',
  SouthAmerica = 'South America',
  Australia = 'Australia',
  MiddleEast = 'Middle East',
  Caribbean = 'Caribbean',
}

export enum LanguageProficiency {
  Basic = 'Basic',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
  Native = 'Native',
}

export enum Language {
  English = 'en',
  French = 'fr',
  Spanish = 'es',
  German = 'de',
  Italian = 'it',
  Portuguese = 'pt',
  Russian = 'ru',
  Chinese = 'zh',
  Japanese = 'ja',
  Korean = 'ko',
  Arabic = 'ar',
  Hindi = 'hi',
  Turkish = 'tr',
  Dutch = 'nl',
  Polish = 'pl',
  Swedish = 'sv',
  Danish = 'da',
  Norwegian = 'no',
  Finnish = 'fi',
}

export const LanguageOptions = [
  { value: Language.English, label: 'English' },
  { value: Language.French, label: 'Français' },
  { value: Language.Spanish, label: 'Español' },
  { value: Language.German, label: 'Deutsch' },
  { value: Language.Italian, label: 'Italiano' },
  { value: Language.Portuguese, label: 'Português' },
  { value: Language.Russian, label: 'Русский' },
  { value: Language.Chinese, label: '中文' },
  { value: Language.Japanese, label: '日本語' },
  { value: Language.Korean, label: '한국어' },
  { value: Language.Arabic, label: 'العربية' },
  { value: Language.Hindi, label: 'हिन्दी' },
  { value: Language.Turkish, label: 'Türkçe' },
  { value: Language.Dutch, label: 'Nederlands' },
  { value: Language.Polish, label: 'Polski' },
  { value: Language.Swedish, label: 'Svenska' },
  { value: Language.Danish, label: 'Dansk' },
  { value: Language.Norwegian, label: 'Norsk' },
  { value: Language.Finnish, label: 'Suomi' },
];

export enum SYSTEM_LANGUAGE {
  English = 'en',
  French = 'fr',
  Spanish = 'es',
}

export const SYSTEM_LANGUAGE_OPTIONS = [
  { value: SYSTEM_LANGUAGE.English, label: 'English' },
  { value: SYSTEM_LANGUAGE.French, label: 'Français' },
  { value: SYSTEM_LANGUAGE.Spanish, label: 'Español' },
];

export const TIMEZONE_OPTIONS = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'Europe/Paris', label: 'Europe/Paris (Central European Time)' },
  { value: 'Europe/London', label: 'Europe/London (Greenwich Mean Time)' },
  { value: 'America/New_York', label: 'America/New_York (Eastern Time)' },
  { value: 'America/Chicago', label: 'America/Chicago (Central Time)' },
  { value: 'America/Denver', label: 'America/Denver (Mountain Time)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (Pacific Time)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (Japan Standard Time)' },
  { value: 'Asia/Shanghai', label: 'Asia/Shanghai (China Standard Time)' },
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (India Standard Time)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (Australian Eastern Time)' },
  { value: 'Africa/Cairo', label: 'Africa/Cairo (Eastern European Time)' },
  { value: 'Africa/Lagos', label: 'Africa/Lagos (West Africa Time)' },
  { value: 'America/Sao_Paulo', label: 'America/Sao_Paulo (Brasilia Time)' },
  { value: 'America/Mexico_City', label: 'America/Mexico_City (Central Time)' },
  // Add more as needed for full coverage
];

export const PHONE_FIELD_PREFERRED_COUNTRIES: MuiTelInputCountry[] = [
  'FR',
  'US',
  'GB',
  'DE',
  'ES',
  'IT',
];

export const PHONE_FIELD_COUNTRIES: MuiTelInputCountry[] = [
  'FR',
  'US',
  'GB',
  'DE',
  'ES',
  'IT',
  'CA',
  'AU',
  'JP',
  'CN',
  'IN',
  'BR',
  'MX',
  'AR',
  'CO',
  'PE',
  'CL',
  'VE',
  'EC',
  'BO',
  'PY',
  'UY',
  'GY',
  'SR',
  'GF',
  'FK',
  // Add more ISO country codes as needed for full coverage
];
