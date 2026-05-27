"use client";

import { useEffect } from "react";

// Exact v0 reference (`v0-ibl-ai-wink-bimsara/app/home/page.tsx:789`).
// Plain ASCII apostrophe-less spelling on purpose — match v0 byte-for-byte.
const WELCOME_TEXT = "Let’s build a great course together.";

// The SDK ships TWO welcome surfaces depending on version:
//
//   Legacy (≤ web-containers@1.6.x, `WelcomeChat`):
//
//     <div class="mb-6 flex items-center gap-4">     ← parent
//       <Avatar … "h-14 w-14 border-2 border-blue-500" />
//       <div>
//         <h1 class="text-xl font-bold text-gray-800">{mentorName}</h1>
//         <Markdown class="mt-1 text-[14px] text-gray-600">{welcomeMessage}</Markdown>
//       </div>
//     </div>
//
//   New (web-containers@1.7.x, `WelcomeChatNew`):
//
//     <div class="mb-6 flex items-center gap-3">     ← agent-name parent
//       <h1 class="bg-gradient-to-r from-[#38A1E5] to-[#7284FF] bg-clip-text
//                  text-center text-3xl font-bold text-transparent">
//         {mentorName}
//       </h1>
//     </div>
//     <div class="mb-6 text-center">                 ← welcome-message sibling
//       <WelcomeMessage aiWelcomeMessage={…} … />
//     </div>
//
// Both end up swapped for a single blue-gradient heading — agent
// name + avatar + AI welcome message gone, replaced by the courseai
// pitch line. We support both selectors so a downgrade or a
// hot-fixed branch of the SDK keeps working.
const SDK_PARENT_SELECTORS = [
  // New (SDK 1.7+): gap-3 container holding the gradient h1.
  'div.mb-6.flex.items-center.gap-3:has(h1.bg-clip-text.text-3xl.font-bold)',
  // Legacy (SDK 1.6 and earlier): gap-4 container with avatar + bold h1.
  'div.mb-6.flex.items-center.gap-4:has(h1.text-xl.font-bold.text-gray-800)',
] as const;

// The new welcome surface renders the AI welcome message in a sibling
// element AFTER the agent-name container. After we swap the agent
// name, we also remove this sibling so only our gradient heading is
// left.
const SDK_WELCOME_MSG_SIBLING_SELECTOR = 'div.mb-6.text-center';

const COURSEAI_HEADING_CLASS =
  'courseai-welcome-heading text-center text-base sm:text-lg md:text-xl font-medium bg-gradient-to-r from-[#00A3EC] to-[#6988FF] bg-clip-text text-transparent px-1';

const SENTINEL = 'data-courseai-welcome-override';
const SIBLING_SENTINEL = 'data-courseai-welcome-removed';
const STYLE_ID = 'courseai-welcome-override-style';

// CSS that visually hides the SDK welcome elements until our JS swap
// runs. Without this, the agent name + welcome message can paint for
// one frame before the MutationObserver removes them.
//
// We use `visibility: hidden` (not `display: none`) so the layout
// stays stable — the heading we drop in afterwards lands in the same
// vertical position.
const HIDE_ORIGINAL_CSS = `
${SDK_PARENT_SELECTORS.map((s) => `${s}:not([${SENTINEL}])`).join(',\n')} {
  visibility: hidden !important;
}
${SDK_PARENT_SELECTORS.map(
  (s) => `${s}:not([${SENTINEL}]) + ${SDK_WELCOME_MSG_SIBLING_SELECTOR}`,
).join(',\n')} {
  display: none !important;
}
`;

function injectHidingStyle() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = HIDE_ORIGINAL_CSS;
  document.head.appendChild(style);
}

function buildOverride(): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'mb-6 flex w-full justify-center';
  wrapper.setAttribute(SENTINEL, 'done');
  const h = document.createElement('h2');
  h.className = COURSEAI_HEADING_CLASS;
  h.textContent = WELCOME_TEXT;
  wrapper.appendChild(h);
  return wrapper;
}

function selectorMatches(): HTMLElement[] {
  const out: HTMLElement[] = [];
  for (const sel of SDK_PARENT_SELECTORS) {
    let nodes: NodeListOf<HTMLElement>;
    try {
      nodes = document.querySelectorAll<HTMLElement>(sel);
    } catch {
      continue;
    }
    nodes.forEach((n) => out.push(n));
  }
  return out;
}

/**
 * Replaces the SDK Chat welcome surface (avatar + agent name + AI
 * proactive prompt) with a single branded courseai heading.
 *
 * `@iblai/web-containers@1.7.5` ships `WelcomeChatNew` whose layout
 * differs from the older `WelcomeChat` (different gap value, different
 * h1 typography, separate sibling div for the welcome message). This
 * override supports both via a list of selectors.
 *
 * Steps:
 *   1. Inject a hiding CSS rule synchronously on first render so the
 *      original block never paints (no agent-name flash).
 *   2. On every DOM mutation, locate the SDK welcome parent, replace
 *      it with our gradient heading, AND remove the welcome-message
 *      sibling if present.
 *
 * Mount this ONCE next to `<Chat>`. Renders nothing.
 */
export function ChatWelcomeOverride() {
  if (typeof document !== 'undefined') injectHidingStyle();

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const replace = () => {
      selectorMatches().forEach((node) => {
        if (node.getAttribute(SENTINEL) === 'done') return;

        // Kill the welcome-message sibling first (it sits AFTER the
        // agent-name parent in the new SDK layout). Use the element
        // reference, not the selector, so we don't accidentally
        // remove every `.mb-6.text-center` on the page.
        const sibling = node.nextElementSibling as HTMLElement | null;
        if (
          sibling &&
          sibling.matches?.(SDK_WELCOME_MSG_SIBLING_SELECTOR) &&
          sibling.getAttribute(SIBLING_SENTINEL) !== 'done'
        ) {
          sibling.setAttribute(SIBLING_SENTINEL, 'done');
          sibling.remove();
        }

        node.replaceWith(buildOverride());
      });
    };

    replace();
    const observer = new MutationObserver(() => replace());
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}

export const COURSEAI_WELCOME_TEXT = WELCOME_TEXT;
