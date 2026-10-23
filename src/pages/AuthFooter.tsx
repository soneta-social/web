import {For, JSX} from 'solid-js';

import {LangPackKey, i18n} from '@lib/langPack';

import styles from '@/pages/authFlow.module.scss';

const REPOSITORY_URL = 'https://github.com/soneta-social/web';

const LINKS: {text: LangPackKey, href: string}[] = [
  {text: 'Login.Footer.About', href: 'https://soneta.social'},
  {text: 'Login.Footer.GetApp', href: 'https://soneta.social/apps'},
  {text: 'Login.Footer.News', href: 'https://t.me/thesoneta'},
  {text: 'Login.Footer.Terms', href: 'https://soneta.social/tos'},
  {text: 'Login.Footer.Privacy', href: 'https://soneta.social/privacy'},
  {text: 'Login.Footer.Developers', href: 'https://t.me/soneta_devs'},
  {text: 'Login.Footer.SourceCode', href: REPOSITORY_URL},
  {text: 'Login.Footer.Issues', href: `${REPOSITORY_URL}/issues`}
];

/** Link row at the bottom of the auth screens. */
export default function AuthFooter(): JSX.Element {
  return (
    <footer>
      <nav class={styles.footer}>
        <For each={LINKS}>
          {(link) => (
            <span class={styles.footerItem}>
              <a class={styles.footerLink} href={link.href} target="_blank" rel="noopener noreferrer nofollow">
                {i18n(link.text)}
              </a>
            </span>
          )}
        </For>
        <span class={styles.footerItem}>{i18n('Login.Footer.Copyright', [new Date().getFullYear()])}</span>
      </nav>
    </footer>
  );
}
