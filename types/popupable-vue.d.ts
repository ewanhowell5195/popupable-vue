import type { DefineComponent, ObjectDirective } from "vue"

export interface PopupableEventDetail {
  popup: HTMLElement
}

export interface PopupableSwitchDetail extends PopupableEventDetail {
  previous: HTMLElement | undefined
  index: number
}

export type PopupableOrderItem = "counter" | "image" | "content" | "thumbnails"

export interface PopupableGroupOptions {
  src?: string | false
  title?: string | number | false
  description?: string | number | false
  content?: string | false
  fixedContentHeight?: boolean
  transparent?: boolean
  maintainAspect?: boolean
  noUpscale?: boolean
  zoomable?: boolean
  anim?: string | false
  group?: string | false
  looping?: boolean
  counter?: boolean
  thumbnails?: boolean
  thumb?: string | false
  order?: string | PopupableOrderItem[] | false
  type?: "image" | "video" | false
  poster?: string | false
  attr?: string | Record<string, string | number | boolean> | false
}

export interface PopupableOptions extends PopupableGroupOptions {
  popupId?: string
  disabled?: boolean
}

export type PopupableEmits = {
  open: (detail: PopupableEventDetail) => void
  switch: (detail: PopupableSwitchDetail) => void
  close: (detail: PopupableEventDetail) => void
}

export type PopupableDirectiveValue = string | number | boolean | null | undefined | PopupableOptions

export type PopupableGroupDirectiveValue = string | false | null | undefined | PopupableGroupOptions

export const vPopupable: ObjectDirective<HTMLElement, PopupableDirectiveValue>

export const vPopupableGroup: ObjectDirective<HTMLElement, PopupableGroupDirectiveValue>

export function popupableAttrs(options?: PopupableOptions): Record<string, string | undefined>

export function setPopupableDefaults(options?: Omit<PopupableGroupOptions, "group">): void

declare const Popupable: DefineComponent<PopupableOptions, {}, {}, {}, {}, {}, {}, PopupableEmits>

export default Popupable
