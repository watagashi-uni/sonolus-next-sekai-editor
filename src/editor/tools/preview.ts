/**
 * Preview mode tool - no editing capabilities, only view/scroll
 */
import type { Tool } from './index'

export const preview: Tool = {
    // No sidebar
    sidebar: undefined,

    // No hover effects
    hover: undefined,

    // No tap actions
    tap: undefined,

    // No drag actions (editing disabled)
    dragStart: undefined,
    dragUpdate: undefined,
    dragEnd: undefined,
}
