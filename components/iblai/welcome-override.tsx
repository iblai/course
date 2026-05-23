"use client";

import { useEffect } from "react";

const WELCOME_TEXT = "Let’s build a great course together!";

// The SDK's WelcomeChat (web-containers/dist/next/index.esm.js:217196)
// renders this exact structure when no prompts are configured:
//
//   <div class="mb-6 flex items-center gap-4">     ← parent
//     <Avatar … "h-14 w-14 border-2 border-blue-500" />
//     <div>
//       <h1 class="text-xl font-bold text-gray-800">{mentorName}</h1>
//       <Markdown class="mt-1 text-[14px] text-gray-600">{welcomeMessage}</Markdown>
//     </div>
//   </div>
//
// We swap that whole block out for a single blue gradient heading that
// says "Let's build a great course together!" — agent name + avatar
// gone, welcome rewritten + restyled.
const SDK_PARENT_SELECTOR =
  "div.mb-6.flex.items-center.gap-4:has(h1.text-xl.font-bold.text-gray-800)";

const COURSEAI_HEADING_CLASS =
  "courseai-welcome-heading text-center text-base sm:text-lg md:text-xl font-medium bg-gradient-to-r from-[#00A3EC] to-[#6988FF] bg-clip-text text-transparent px-1";

const SENTINEL = "data-courseai-welcome-override";

/**
 * Replaces the SDK Chat's welcome block (avatar + agent name + AI
 * proactive prompt) with a single branded heading. The SDK has no
 * host-side prop for this in `@iblai/web-containers@1.7.0` -- the
 * `welcomeChat` slot is not implemented. We mutate the rendered DOM
 * instead.
 *
 * Mount this once next to `<Chat>`. Renders nothing.
 */
export function ChatWelcomeOverride() {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const buildOverride = () => {
      const wrapper = document.createElement("div");
      wrapper.className = "mb-6 flex w-full justify-center";
      wrapper.setAttribute(SENTINEL, "done");
      const h = document.createElement("h2");
      h.className = COURSEAI_HEADING_CLASS;
      h.textContent = WELCOME_TEXT;
      wrapper.appendChild(h);
      return wrapper;
    };

    const replace = () => {
      // `:has(...)` is supported in all modern browsers; the SDK only
      // targets evergreen anyway. Wrapped in try/catch in case a host
      // ships an older runtime.
      let nodes: NodeListOf<HTMLElement>;
      try {
        nodes = document.querySelectorAll<HTMLElement>(SDK_PARENT_SELECTOR);
      } catch {
        return;
      }
      nodes.forEach((node) => {
        if (node.getAttribute(SENTINEL) === "done") return;
        const override = buildOverride();
        node.replaceWith(override);
      });
    };

    replace();
    const observer = new MutationObserver(() => replace());
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, []);

  return null;
}

export const COURSEAI_WELCOME_TEXT = WELCOME_TEXT;
