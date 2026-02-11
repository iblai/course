# Files to Move for "New Course Default" Page (Another Project)

Use this list when copying the **new course default page** (heading “Lets build together a great course!”, input box, and jumpstart prompt boxes) into another project.

---

## 1. Page (required)

| Path | Purpose |
|------|--------|
| `app/page.tsx` | Home page. You can trim it to only the default view (no form steps, no “creating course” state) if the other project does not need the full flow. |

---

## 2. Default UI – core (required for the centered prompt + input + templates)

| Path | Purpose |
|------|--------|
| `components/jumpstart-templates.tsx` | Prompt suggestion cards in one row. |
| `lib/utils.ts` | `cn()` and other helpers. |
| `app/globals.css` | At least the `.scrollbar-hide` rules if you use horizontal scroll on templates. |

---

## 3. Layout – full shell (required if you want sidebar + header + footer)

| Path | Purpose |
|------|--------|
| `components/platform/sidebar-learner.tsx` | Left sidebar. |
| `components/platform/header.tsx` | Top header. |
| `components/platform/platform-footer.tsx` | Bottom footer. |
| `components/chat-button.tsx` | Floating chat button (if you keep it on the page). |

**Layout dependencies (used by the above):**

- `components/ui/button.tsx`
- `components/ui/tooltip-flowbite.tsx`
- `components/account-dialog.tsx` (header)
- `components/modals/llm-provider-selection-modal.tsx` (header)
- `components/modals/invite-user-dialog.tsx` (sidebar)
- `components/modals/rename-item-dialog.tsx` (sidebar)
- `components/modals/delete-item-dialog.tsx` (sidebar)
- `components/modals/create-project-modal.tsx` (sidebar)
- `components/accessibility/floating-microphone-button.tsx` (footer)
- `components/accessibility/floating-accessibility-button.tsx` (footer)

Plus any further dependencies those components import (e.g. `components/ui/dialog.tsx`, `components/ui/input.tsx`, etc.).

---

## 4. Default view – input area and “Add Source” (required if you keep the same input UI)

| Path | Purpose |
|------|--------|
| `components/chat-input/add-sources-dialog.tsx` | “Add Source” dialog. |
| `components/ui/textarea.tsx` | Main text input. |
| `components/ui/tooltip-flowbite.tsx` | Tooltips on Add Source / Dictate / Send. |

`add-sources-dialog` will pull in things like `components/ui/button.tsx`, `components/ui/progress.tsx`, etc.

---

## 5. Minimal set (default UI only, no sidebar/header/footer)

If you only want the **centered default block** (heading + input + jumpstart row) and will wrap it in your own layout:

**Copy at least:**

1. `app/page.tsx` – then reduce it to a single view: one component that renders the centered column (heading + input + `JumpstartTemplates`) and use your own layout/wrapper.
2. `components/jumpstart-templates.tsx`
3. `lib/utils.ts`
4. `components/ui/textarea.tsx` (if you keep the same input)
5. From `app/globals.css`: the `.scrollbar-hide` block (for the templates row if it scrolls).

**Optional but used by the current default UI:**

- `components/chat-input/add-sources-dialog.tsx` + its dependencies (if you keep “Add Source”).
- `components/ui/tooltip-flowbite.tsx` + `TooltipProvider` / `TooltipFlowbite` (if you keep tooltips on the input buttons).
- Lucide icons used in `app/page.tsx`: `Plus`, `Mic`, `ArrowUp`, `FileImage`, `X`, etc.

---

## 6. Summary checklist

**Full “new course default” page (same as this app):**

- [ ] `app/page.tsx`
- [ ] `components/jumpstart-templates.tsx`
- [ ] `lib/utils.ts`
- [ ] `components/platform/sidebar-learner.tsx`
- [ ] `components/platform/header.tsx`
- [ ] `components/platform/platform-footer.tsx`
- [ ] `components/chat-button.tsx`
- [ ] `components/chat-input/add-sources-dialog.tsx`
- [ ] `components/ui/textarea.tsx`
- [ ] `components/ui/button.tsx`
- [ ] `components/ui/tooltip-flowbite.tsx`
- [ ] All modals and components imported by sidebar, header, footer, and add-sources-dialog (see sections 3 and 4).
- [ ] `.scrollbar-hide` (and any other used bits) from `app/globals.css`.

**Minimal (only the default prompt + input + templates):**

- [ ] `app/page.tsx` (trimmed to default view only) or a new page that only renders that block.
- [ ] `components/jumpstart-templates.tsx`
- [ ] `lib/utils.ts`
- [ ] `components/ui/textarea.tsx` (if you keep the same input).
- [ ] `.scrollbar-hide` from `app/globals.css`.

After copying, fix imports (e.g. `@/` paths) and install dependencies (e.g. `lucide-react`) in the target project.
