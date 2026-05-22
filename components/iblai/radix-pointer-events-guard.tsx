"use client";

import { useEffect } from "react";

/**
 * Recovery for the SDK PromptGalleryModal teardown bug. The bundled
 * Radix dialog leaves `body { pointer-events: none }` and
 * `inert`/`aria-hidden` on siblings after close -- the whole app
 * becomes unclickable. The `promptGalleryModal` slot override doesn't
 * exist in this SDK version (web-containers@1.6.x), so it can't be
 * replaced via API. This component watches the DOM and clears the
 * stuck lock when no Radix dialog is legitimately open. No-op while a
 * modal is open, so it doesn't fight live dialogs.
 *
 * Mount once near the providers root.
 */
const OPEN =
  '[role="dialog"][data-state="open"],[role="alertdialog"][data-state="open"],[data-radix-popper-content-wrapper]';

function recover() {
  if (document.querySelector(OPEN)) return;
  if (document.body.style.pointerEvents === "none") {
    document.body.style.pointerEvents = "";
  }
  for (const el of Array.from(document.body.children)) {
    if (el.hasAttribute("inert")) el.removeAttribute("inert");
    if (el.getAttribute("aria-hidden") === "true") {
      el.removeAttribute("aria-hidden");
    }
  }
}

export function RadixPointerEventsGuard() {
  useEffect(() => {
    recover();
    const mo = new MutationObserver(recover);
    mo.observe(document.body, {
      attributes: true,
      attributeFilter: ["style", "inert", "aria-hidden"],
      childList: true,
      subtree: true,
    });
    const onDown = () => recover();
    document.addEventListener("pointerdown", onDown, true);
    return () => {
      mo.disconnect();
      document.removeEventListener("pointerdown", onDown, true);
    };
  }, []);
  return null;
}
