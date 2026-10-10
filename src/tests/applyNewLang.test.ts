import {EventEmitter} from 'node:events';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {runInNewContext} from 'node:vm';
import {getInvalidPluralKeys} from '@/scripts/lib/validatePluralStrings';
import rebrandBranding from '@/helpers/string/rebrandBranding';

const source = readFileSync('src/scripts/apply_new_lang.js', 'utf8');

function createImport() {
  const files = {
    'lang.ts': `const lang = {
  'Gift': {
    'one_value': '%2$s sent %1$d gift',
    'other_value': '%2$s sent %1$d gifts'
  }
};`,
    'langSign.ts': `const lang = {
  'Greeting': 'Hello'
};`
  };
  const response = Object.assign(new EventEmitter(), {
    headers: {'content-disposition': 'attachment; filename="lang_v1.strings"'}
  });
  const writeFileSync = vi.fn((file: string, text: string) => {
    files[path.basename(file) as keyof typeof files] = text;
  });
  const modules = {
    https: {
      get: (_url: string, callback: (response: EventEmitter) => void) => {
        callback(response);
        return new EventEmitter();
      }
    },
    fs: {readFileSync: (file: string) => files[path.basename(file) as keyof typeof files], writeFileSync},
    path,
    './lib/validatePluralStrings.ts': {getInvalidPluralKeys},
    '../helpers/string/rebrandBranding.ts': {rebrandBranding}
  };
  runInNewContext(source, {
    __dirname: path.resolve('src/scripts'),
    require: (name: keyof typeof modules) => modules[name],
    console: {log: vi.fn()}
  });

  return {
    files,
    writeFileSync,
    apply: (text: string) => {
      response.emit('data', text);
      response.emit('end');
    }
  };
}

describe('translation import', () => {
  it('rejects incompatible plural forms before writing either language file', () => {
    const {apply, files, writeFileSync} = createImport();
    const original = {...files};

    expect(() => apply([
      '"Greeting" = "Welcome";',
      '"Gift_one" = "%s sent %d gift";',
      '"Gift_other" = "%2$s sent %1$d gifts";'
    ].join('\n'))).toThrow('Translation import would move the plural count out of argument 1: Gift');
    expect(writeFileSync).not.toHaveBeenCalled();
    expect(files).toEqual(original);
  });

  it('imports compatible translations and ignores keys the client does not use', () => {
    const {apply, files, writeFileSync} = createImport();

    apply([
      '"Greeting" = "Welcome";',
      '"Gift_one" = "%2$s bought %1$d gift";',
      '"Gift_other" = "%2$s bought %1$d gifts";',
      '"Unused_other" = "%s bought %d gifts";'
    ].join('\n'));

    expect(writeFileSync).toHaveBeenCalledTimes(2);
    expect(files['lang.ts']).toContain('%2$s bought %1$d gifts');
    expect(files['langSign.ts']).toContain('\'Greeting\': \'Welcome\'');
  });

  it('rebrands Telegram mentions in imported values but keeps their links', () => {
    const {apply, files} = createImport();

    apply('"Greeting" = "Telegram Web is unavailable, see telegram.org and t.me/TelegramTips";');

    expect(files['langSign.ts']).toContain('\'Greeting\': \'Soneta is unavailable, see telegram.org and t.me/TelegramTips\'');
  });
});
