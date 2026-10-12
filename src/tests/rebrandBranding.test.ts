import rebrandBranding from '@/helpers/string/rebrandBranding';

describe('rebrandBranding', () => {
  it('rebrands the word but keeps functional domains and usernames', () => {
    expect(rebrandBranding('Telegram Web is unavailable, see telegram.org, ads.telegram.org and @TelegramBot')).toBe('Soneta is unavailable, see telegram.org, ads.telegram.org and @TelegramBot');
  });

  it('rewrites Telegram promo channel links to the Soneta channel', () => {
    expect(rebrandBranding('https://t.me/TelegramTips')).toBe('https://t.me/thesoneta');
    expect(rebrandBranding('https://t.me/TelegramTipsDE')).toBe('https://t.me/thesoneta');
    expect(rebrandBranding('https://t.me/TelegramTipsAR/128')).toBe('https://t.me/thesoneta');
    expect(rebrandBranding('https://t.me/Telegram')).toBe('https://t.me/thesoneta');
    expect(rebrandBranding('see t.me/TelegramTips in prose')).toBe('see t.me/thesoneta in prose');
    expect(rebrandBranding('[Features](https://t.me/TelegramTips)')).toBe('[Features](https://t.me/thesoneta)');
  });

  it('keeps functional t.me links and the Soneta channel itself', () => {
    expect(rebrandBranding('https://t.me/botfather')).toBe('https://t.me/botfather');
    expect(rebrandBranding('https://t.me/TelegramBot')).toBe('https://t.me/TelegramBot');
    expect(rebrandBranding('https://t.me/thesoneta')).toBe('https://t.me/thesoneta');
    expect(rebrandBranding('foo.t.me/TelegramTips stays')).toBe('foo.t.me/TelegramTips stays');
  });
});
