// Rewrites the upstream "Telegram" branding as the product's own in any
// user-visible string. Only the capitalized standalone word matches, so
// lowercase domains (telegram.org, ads.telegram.org) and bot usernames
// without a word boundary (TelegramTips) are left functional.
const rules: [RegExp, string][] = [
  [/Telegram Web(?:\s?K)?/g, 'Soneta'],
  // "\b" would miss "Telegram" right after a source-level "\n" escape (its
  // trailing "n" is a word char), hence the explicit lookbehind alternative.
  [/(?:(?<!\w)|(?<=\\n))Telegram(?!\w)/g, 'Soneta']
];

export default function rebrandBranding(text: string) {
  if(!text) {
    return text;
  }

  for(const [regExp, replacement] of rules) {
    text = text.replace(regExp, replacement);
  }

  return text;
}
