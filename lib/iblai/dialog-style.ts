/**
 * Shared sizing for full-feature dialogs (Account, Edit Agent, etc.).
 * Mirrors hq's `lib/iblai/dialog-style.ts`. `!important` variants beat
 * shadcn's built-in `sm:max-w-lg` cap on `<DialogContent>`.
 *
 * Sized as large as the viewport reasonably allows so SDK tab trees
 * (Settings, Prompts, Datasets, History, etc.) rarely need an inner
 * scrollbar on a typical desktop. `min(96vw, 1400px)` keeps a small
 * inset; `92dvh` leaves room for browser chrome / toast stack.
 */
export const STANDARD_DIALOG_CLASSNAME =
  "!max-w-[1400px] sm:!max-w-[1400px] w-[min(96vw,1400px)] " +
  "!max-h-[92dvh] h-[92dvh] p-0 gap-0 overflow-hidden border-none bg-background"
