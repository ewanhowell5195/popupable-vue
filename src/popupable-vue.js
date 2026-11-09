import { Comment, Fragment, Teleport, Text, cloneVNode, h, mergeProps } from "vue"
import "popupable/styles.css"
import "popupable"

const OPTIONS = ["src", "title", "description", "content", "fixedContentHeight", "transparent", "maintainAspect", "noUpscale", "zoomable", "anim", "group", "looping", "counter", "thumbnails", "thumb", "order", "type", "poster", "attr"]

let nextId = 0
const groupNames = new WeakMap()

function attrValue(value) {
  if (value == null) return undefined
  if (value === true) return ""
  if (value === false) return "false"
  if (Array.isArray(value)) return value.join(",")
  if (typeof value === "object") return Object.entries(value).map(([k, v]) => v === true ? k : `${k}=${v}`).join(",")
  return String(value)
}

function optionAttrs(options) {
  return Object.fromEntries(OPTIONS.map(option => [`data-popupable-${option.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)}`, options.disabled ? undefined : attrValue(options[option])]))
}

export function popupableAttrs(options = {}) {
  return { "data-popupable": options.disabled ? undefined : options.popupId ?? "", ...optionAttrs(options) }
}

function setAttrs(el, attrs) {
  for (const [name, value] of Object.entries(attrs)) {
    if (value === undefined) el.removeAttribute(name)
    else el.setAttribute(name, value)
  }
}

export function setPopupableDefaults(options = {}) {
  setAttrs(document.documentElement, optionAttrs({ ...options, group: undefined }))
}

function applyDirective(el, { value }) {
  if (value === false || value === null) setAttrs(el, popupableAttrs({ disabled: true }))
  else if (typeof value === "string" || typeof value === "number") setAttrs(el, popupableAttrs({ title: value }))
  else setAttrs(el, popupableAttrs(value ?? {}))
}

export const vPopupable = {
  mounted: applyDirective,
  updated: applyDirective
}

function applyGroup(el, { value }) {
  if (value === false || value === null) return setAttrs(el, optionAttrs({ disabled: true }))
  const options = typeof value === "string" ? { group: value } : value ?? {}
  if (!groupNames.has(el)) groupNames.set(el, `popupable-vue-group-${++nextId}`)
  setAttrs(el, optionAttrs({ ...options, group: options.group ?? groupNames.get(el) }))
}

export const vPopupableGroup = {
  mounted: applyGroup,
  updated: applyGroup
}

function restoreContent(e) {
  for (const content of e.detail.popup.querySelectorAll("[data-popupable-vue-content][id]")) {
    content.hidden = true
    document.body.append(content)
  }
}

document.addEventListener("popupable:open", e => {
  e.composedPath()[0].addEventListener("popupable:close", restoreContent)
  for (const copy of e.detail.popup.querySelectorAll("[data-popupable-vue-content]:not([id])")) {
    const content = document.getElementById(copy.dataset.popupableVueContent)
    if (!content) continue
    content.hidden = false
    copy.replaceWith(content)
  }
})

function rendered(nodes) {
  return nodes.flatMap(node => {
    if (node.type === Comment) return []
    if (node.type === Fragment) return rendered(node.children ?? [])
    if (node.type === Text && !String(node.children).trim()) return []
    return [node]
  })
}

const flag = { type: Boolean, default: undefined }
const text = { type: [String, Number, Boolean], default: undefined }

export default {
  name: "Popupable",
  inheritAttrs: false,
  props: {
    src: text,
    title: text,
    description: text,
    content: text,
    fixedContentHeight: flag,
    transparent: flag,
    maintainAspect: flag,
    noUpscale: flag,
    zoomable: flag,
    anim: text,
    group: text,
    looping: flag,
    counter: flag,
    thumbnails: flag,
    thumb: text,
    order: { type: [String, Array, Boolean], default: undefined },
    type: { type: [String, Boolean], default: undefined, validator: value => ["image", "video", false].includes(value) },
    poster: text,
    attr: { type: [String, Object, Boolean], default: undefined },
    popupId: String,
    disabled: Boolean
  },
  emits: ["open", "switch", "close"],
  setup(props, { attrs, emit, slots }) {
    const id = `popupable-vue-content-${++nextId}`

    function relay(name) {
      return e => {
        if (e.target === e.currentTarget) emit(name, e.detail)
      }
    }

    const listeners = {
      "onPopupable:open": relay("open"),
      "onPopupable:switch": relay("switch"),
      "onPopupable:close": relay("close")
    }

    return () => {
      const sources = rendered(slots.default?.() ?? [])
      if (!sources.length) return null
      if (sources.length > 1 || sources[0].type === Text) {
        console.warn(`popupable-vue: the default slot needs exactly one element, got ${sources.length === 1 ? "text" : sources.length}`)
        return sources
      }
      const content = props.disabled ? [] : slots.content?.() ?? []
      const hasContent = rendered(content).length > 0
      return [
        cloneVNode(sources[0], mergeProps(attrs, popupableAttrs(hasContent ? { ...props, content: id } : props), listeners)),
        hasContent ? h(Teleport, { to: "body" }, h("div", { id, hidden: true, "data-popupable-vue-content": id }, content)) : null
      ]
    }
  }
}
