import type { Action } from "./constants"

export type DialogProps = {
    author: string,
    quote: string,
    timestamp: string,
    action: Action,
    disableDialog: () => void,
    active: true
}