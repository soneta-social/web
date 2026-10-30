import {createEffect, createMemo, createRoot, createSignal} from 'solid-js';
import {ScreenSize, useMediaSizes} from '@helpers/mediaSizes';
import {setCenterSection, setLeftRail} from '@helpers/updateColumnWidths';

// RAW user preference (mirrors settings.tabsInSidebar): whether the user has
// the folders sidebar turned ON. Independent of viewport — it stays true even
// when the panel is hidden because the window is too narrow. This is NOT "is
// the panel on screen right now"; for that use useFoldersSidebarShown(), which
// gates this by width. Reach for the RAW value only when you genuinely mean the
// preference (e.g. a setting toggle), not the on-screen state.
const hasFoldersSidebarSignal = createRoot(() => {
  const [hasFoldersSidebar, setHasFoldersSidebar] = createSignal(false);
  return [hasFoldersSidebar, setHasFoldersSidebar] as const;
});

export default function useHasFoldersSidebar() {
  return hasFoldersSidebarSignal;
};

// Whether the social navigation sidebar (components/socialNav) is on screen:
// it docks to the left of #column-left whenever the viewport is wide enough
// for a docked layout (>925px). Below that the messenger layout is unchanged.
const socialNavShownSignal = createRoot(() => {
  const mediaSizes = useMediaSizes();
  const shown = createMemo(() => !mediaSizes.isLessThanFloatingLeftSidebar);
  return [shown] as const;
});

export function useSocialNavShown() {
  return socialNavShownSignal;
}

// The section of the social navigation the left sidebar shows: the chat list
// (with or without its search open), or a tab opened from the navigation —
// pushed in by AppSidebarLeft from its tab stack.
export type SocialSection = 'messages' | 'search' | 'contacts' | 'calls' | 'stories' | 'settings';
const CHAT_LIST_SECTIONS: Set<SocialSection> = new Set(['messages', 'search']);

const socialSectionSignal = createRoot(() => {
  const [section, setSection] = createSignal<SocialSection>('messages');
  return [section, setSection] as const;
});

export function useSocialSection() {
  return socialSectionSignal;
}

// Derived: whether #column-left moves to the centre of the page and shows the
// current section in place of the chat. The chat list sections keep the
// messenger layout, and so does every width without the social navigation.
// The single source for the `body.has-center-section` class and
// updateColumnWidths' centred-column math.
const isCenterSectionSignal = createRoot(() => {
  const [section] = socialSectionSignal;
  const [socialNavShown] = socialNavShownSignal;
  const isCenter = createMemo(() => socialNavShown() && !CHAT_LIST_SECTIONS.has(section()));

  createEffect(() => {
    document.body.classList.toggle('has-center-section', isCenter());
    setCenterSection(isCenter());
  });

  return [isCenter] as const;
});

export function useIsCenterSection() {
  return isCenterSectionSignal;
}

// Derived: whether the folders sidebar is ACTUALLY visible — the RAW preference
// AND a viewport wide enough to fit it (the panel is hidden by SCSS at <=925px)
// AND the social navigation not taking that slot (both dock in the same place;
// while the navigation is shown folders render as horizontal tabs).
// This is what UI should key off of when it cares about the on-screen panel.
// Also the single source for the `body.has-folders-sidebar` class.
const foldersSidebarShownSignal = createRoot(() => {
  const [hasFoldersSidebar] = hasFoldersSidebarSignal;
  const [socialNavShown] = socialNavShownSignal;
  const mediaSizes = useMediaSizes();
  const shown = createMemo(() => hasFoldersSidebar() && !mediaSizes.isLessThanFloatingLeftSidebar && !socialNavShown());

  createEffect(() => {
    document.body.classList.toggle('has-folders-sidebar', shown());
  });

  return [shown] as const;
});

export function useFoldersSidebarShown() {
  return foldersSidebarShownSignal;
}

// Derived: whether a rail docks to the left of #column-left — the folders
// sidebar or the social navigation. Either one carries the main menu trigger,
// so the in-sidebar burger steps aside. The single source for the
// `body.has-left-rail` class and updateColumnWidths' reserved-space math.
const leftRailShownSignal = createRoot(() => {
  const [foldersSidebarShown] = foldersSidebarShownSignal;
  const [socialNavShown] = socialNavShownSignal;
  const shown = createMemo(() => foldersSidebarShown() || socialNavShown());

  createEffect(() => {
    document.body.classList.toggle('has-left-rail', shown());
    setLeftRail(socialNavShown() ? 'social' : (foldersSidebarShown() ? 'folders' : undefined));
  });

  return [shown] as const;
});

export function useLeftRailShown() {
  return leftRailShownSignal;
}

const hasFoldersSignal = createRoot(() => {
  const [hasFolders, setHasFolders] = createSignal(false);
  return [hasFolders, setHasFolders] as const;
});

export function useHasFolders() {
  return hasFoldersSignal;
}

const isSidebarCollapsedSignal = createRoot(() => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = createSignal(false);
  return [isSidebarCollapsed, setIsSidebarCollapsed] as const;
});

export function useIsSidebarCollapsed() {
  return isSidebarCollapsedSignal;
}

// Whether something is open inside the left sidebar (a tab — settings,
// archive, etc., search input focused, or a forum). Mirrors the
// `has-open-tabs` class on `#column-left`; pushed in from
// AppSidebarLeft.onSomethingOpenInsideChange so reactive consumers (e.g.
// the collapsed-search-trigger button) can drive their visibility from a
// signal instead of CSS selectors that combine three sidebar classes.
const hasOpenLeftTabsSignal = createRoot(() => {
  const [hasOpenLeftTabs, setHasOpenLeftTabs] = createSignal(false);
  return [hasOpenLeftTabs, setHasOpenLeftTabs] as const;
});

export function useHasOpenLeftTabs() {
  return hasOpenLeftTabsSignal;
}

// Whether the left sidebar's search input is focused / search panel is open.
// Drives the burger element's "back-arrow vs menu icon" state via a Solid
// effect so the class wiring stays in one place — combined with
// useHasFoldersSidebar, which pins the back state on permanently when the
// folders panel provides the main menu trigger.
const isLeftSearchActiveSignal = createRoot(() => {
  const [isLeftSearchActive, setIsLeftSearchActive] = createSignal(false);
  return [isLeftSearchActive, setIsLeftSearchActive] as const;
});

export function useIsLeftSearchActive() {
  return isLeftSearchActiveSignal;
}

createRoot(() => {
  const [hasFolders] = hasFoldersSignal;
  const [foldersSidebarShown] = foldersSidebarShownSignal;
  const [isSidebarCollapsed] = isSidebarCollapsedSignal;
  const mediaSizes = useMediaSizes();
  createEffect(() => {
    const hasFolders$ = hasFolders();
    // Folders render as horizontal tabs unless the vertical panel is actually
    // shown — `!foldersSidebarShown()` is exactly the old
    // `!hasFoldersSidebar() || isLessThanFloatingLeftSidebar`.
    const hasHorizontal = (!isSidebarCollapsed() || mediaSizes.activeScreen < ScreenSize.medium) &&
      !foldersSidebarShown();
    const hasVertical = !hasHorizontal;
    document.body.classList.toggle(
      'has-horizontal-folders',
      hasFolders$ && hasHorizontal
    );
    document.body.classList.toggle(
      'has-vertical-folders',
      hasFolders$ && hasVertical
    );
  });
});
