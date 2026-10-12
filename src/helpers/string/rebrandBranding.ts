// Rewrites the upstream "Telegram" branding as the product's own in any
// user-visible string. Only the capitalized standalone word matches, so
// lowercase domains (telegram.org, ads.telegram.org) and bot usernames
// without a word boundary (TelegramBot) are left functional.
const rules: [RegExp, string][] = [
  // Promo channel links come first: the server lang packs point them at
  // Telegram's own channels ("TelegramFeaturesUrl" ships t.me/TelegramTips,
  // localized packs use t.me/TelegramTipsDE and deep links like ...AR/128),
  // shadowing the Soneta ones — the same destinations the word rules below
  // rename, so the links follow along to the product's channel. Before the
  // word rules, so a bare t.me/Telegram maps to the Soneta channel and not
  // the dead t.me/Soneta. Functional links (botfather, TelegramBot) stay.
  // The lookbehind keeps subdomains like foo.t.me out; deep-link paths are
  // swallowed too, since a post id from another channel is meaningless here.
  [/(?<![\w.])t\.me\/(?:TelegramTips\w*|Telegram(?!\w))(?:\/\w+)*/gi, 't.me/thesoneta'],
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
