export const CLOSE_LEARNER_TOOL_SIDEBARS_EVENT = "ibl:close-learner-tool-sidebars"
export const LOGOUT_CLOSE_SIDE_PANELS_EVENT = "ibl:logout-close-side-panels"
export const OPEN_CHAT_WIDGET_EVENT = "ibl:open-chat-widget"

export type OpenChatWidgetDetail = {
  mentor: {
    name: string
    image?: string
  }
  activeBottomTab?: string
  startVoice?: boolean
}
