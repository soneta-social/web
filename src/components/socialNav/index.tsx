import {Accessor, For, JSX, Show, untrack} from 'solid-js';
import {render} from 'solid-js/web';
import installColumnResize from '@helpers/installColumnResize';
import {Middleware} from '@helpers/middleware';
import classNames from '@helpers/string/classNames';
import I18n, {i18n, LangPackKey} from '@lib/langPack';
import rootScope from '@lib/rootScope';
import {FOLDER_ID_ALL} from '@appManagers/constants';
import useFolders from '@stores/folders';
import {SOCIAL_NAV_COLLAPSE_WIDTH, setUserCollapsedSocialNav} from '@helpers/updateColumnWidths';
import {SocialSection, useSocialNavShown, useSocialSection} from '@stores/foldersSidebar';
import A11yButton from '@components/a11yButton';
import {AvatarNew} from '@components/avatarNew';
import Badge from '@components/badge';
import {IconTsx} from '@components/iconTsx';
import {PeerTitleTsx} from '@components/peerTitleTsx';
import styles from '@components/socialNav/socialNav.module.scss';

export type SocialNavItem = {
  // the section the item opens; an item without one only acts (opens a chat)
  // and is never current
  section?: SocialSection,
  icon: Icon,
  text: LangPackKey,
  onClick: () => void,
  badge?: Accessor<number>
};

export type SocialNavItemOptions = Omit<SocialNavItem, 'badge'> & {
  // shows the unread count of all chats
  unreadBadge?: boolean
};

function SocialNavButton(props: {
  ref?: (el: HTMLElement) => void,
  class?: string,
  icon: Icon,
  text: LangPackKey,
  current?: boolean,
  badge?: number,
  onClick?: () => void,
  children?: JSX.Element
}) {
  const label = i18n(props.text);
  return (
    <A11yButton
      ripple
      ref={props.ref}
      class={classNames('rp-overflow', styles.item, props.current && styles.itemCurrent, props.class)}
      aria-current={props.current ? 'page' : undefined}
      onClick={props.onClick}
    >
      <span class={styles.itemIcon}>
        <IconTsx icon={props.icon} />
        <Show when={props.badge}>
          <Badge tag="span" size={18} color="primary" class={styles.itemBadge}>
            {'' + props.badge}
          </Badge>
        </Show>
      </span>
      <span class={styles.itemText}>{label}</span>
      {props.children}
    </A11yButton>
  );
}

export function SocialNav(props: {
  items: SocialNavItem[],
  mountComposeMenu: (el: HTMLElement) => void,
  mountAccountMenu: (el: HTMLElement) => void
}) {
  const [section] = useSocialSection();
  // created once, untracked: AvatarNew reads signals while it sets up, and an
  // expression in the JSX would rebuild it on their first change (dropping
  // the photo that was loading), the way components/table.tsx guards it
  const avatar = untrack(() => AvatarNew({peerId: rootScope.myId, size: 40}));

  return (
    <nav class={styles.nav} aria-label={I18n.format('SocialNav.Label', true)}>
      <div class={styles.items}>
        <For each={props.items}>{(item) => (
          <SocialNavButton
            icon={item.icon}
            text={item.text}
            current={!!item.section && section() === item.section}
            badge={item.badge?.()}
            onClick={item.onClick}
          />
        )}</For>
      </div>

      <SocialNavButton
        ref={props.mountComposeMenu}
        class={styles.compose}
        icon="newchat_filled"
        text="SocialNav.NewChat"
      />

      <A11yButton
        ripple
        ref={props.mountAccountMenu}
        class={classNames(styles.item, styles.account)}
        aria-label={I18n.format('MultiAccount.More', true)}
      >
        <span class={styles.accountAvatar}>
          {avatar.element}
        </span>
        <span class={classNames(styles.itemText, styles.accountTitle)}>
          <PeerTitleTsx peerId={rootScope.myId} />
        </span>
        <IconTsx icon="more" class={styles.accountMore} />
      </A11yButton>
    </nav>
  );
}

export function renderSocialNav(
  parentEl: HTMLElement,
  options: Omit<Parameters<typeof SocialNav>[0], 'items'> & {
    items: SocialNavItemOptions[]
  },
  middleware: Middleware
) {
  const [socialNavShown] = useSocialNavShown();
  const {folderItems} = useFolders();
  const unreadCount = () => folderItems.find((item) => item.id === FOLDER_ID_ALL)?.notifications?.count || 0;

  const container = document.createElement('div');
  container.id = 'social-nav';
  container.className = styles.container;
  parentEl.insertBefore(container, parentEl.firstChild);

  // Dragging the edge flips the navigation between wide and collapsed, the
  // way the chat list's handle collapses it. Only a section shown in place of
  // the chat offers it — beside the chat list the navigation is collapsed.
  installColumnResize({
    columnEl: container,
    side: 'left',
    onResize: (width) => setUserCollapsedSocialNav(width < SOCIAL_NAV_COLLAPSE_WIDTH)
  });

  const items: SocialNavItem[] = options.items.map(({unreadBadge, ...item}) => ({
    ...item,
    badge: unreadBadge ? unreadCount : undefined
  }));

  const dispose = render(() => (
    <Show when={socialNavShown()}>
      <SocialNav
        items={items}
        mountComposeMenu={options.mountComposeMenu}
        mountAccountMenu={options.mountAccountMenu}
      />
    </Show>
  ), container);

  middleware.onDestroy(() => {
    dispose();
    container.remove();
  });
}
