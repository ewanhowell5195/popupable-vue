# popupable-vue

A lightweight lightbox component and directives for Vue 3, built on [popupable](https://github.com/ewanhowell5195/popupable).  
Just add `v-popupable` to any image!

[![npm version](https://badge.fury.io/js/popupable-vue.svg)](https://www.npmjs.com/package/popupable-vue)
[![License: MPL 2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)

[**Live Demo**](https://popupable.ewanhowell.com/)

## Features

* Animates open from the element's original position
* Multiple built-in animation styles, with support for custom ones
* Works with mouse, touch, and keyboard
* Gallery groups with swipe, scroll, keyboard, and button navigation
* Supports images, videos, and live-mirrored canvases
* Thumbnail strip and image counter
* Pinch-to-zoom on touch, with optional click/tap-to-zoom support
* Checkerboard background for transparent images
* Rich popup content from a slot, which stays reactive and keeps its listeners
* Adds no wrapper elements around your image
* Reactive options
* Customizable via CSS variables

## Quick Start

### Install via npm
```bash
npm install popupable-vue
```

### Add popups to your component

```vue
<script setup>
import Popupable, { vPopupable, vPopupableGroup } from "popupable-vue"
</script>

<template>
  <img src="photo.jpg" v-popupable>
  <img src="thumbnail.jpg" v-popupable="{ src: 'full-res.jpg', title: 'Sunset' }">

  <div v-popupable-group="{ counter: true, thumbnails: true }">
    <img v-for="photo in photos" :src="photo" v-popupable>
  </div>

  <Popupable zoomable>
    <img src="map.jpg">
    <template #content>
      <h3 class="popupable-title">The map</h3>
      <button @click="download">Download</button>
    </template>
  </Popupable>
</template>
```

The script and styles are imported for you. A bundler that handles CSS imports is required.

Close by clicking again, or pressing Escape, Space, Backspace, or Delete.

## Directive

`v-popupable` makes an element openable. A string or number value is the title. `false` or `null` turns the popup off:

```vue
<img src="photo.jpg" v-popupable>
<img src="photo.jpg" v-popupable="'Sunset'">
<img src="photo.jpg" v-popupable="enabled ? 'Sunset' : false">
```

It also takes an object of [options](#options):

```vue
<img src="photo.jpg" v-popupable="{ title: 'Sunset', zoomable: true }">
```

The element's events can be listened to directly. See [Events](#events).

To use it without importing it in every component, register it on your app:

```js
app.directive("popupable", vPopupable)
```

## Component

`<Popupable>` adds the popup to the single element or component in its default slot, without adding a wrapper element. Options are props, and `class`, `style` and listeners set on `<Popupable>` go on that element too.

```vue
<Popupable title="Sunset" description="Taken in July 2024" no-upscale>
  <img src="photo.jpg">
</Popupable>
```

| Slot | Description |
|---|---|
| default | The element to open. It must be one element or component. Anything else logs a warning and adds no popup. |
| `#content` | Rich popup content. It takes priority over `content`, `title` and `description`. If it renders nothing, they are used. |

The `#content` slot is rendered hidden until the popup opens. It stays reactive while open, its listeners work, and the popup resizes to fit it. The popup's keyboard shortcuts stay active, so a text input inside it won't type normally.

## Groups

`v-popupable-group` goes on a container. Every `v-popupable` or `<Popupable>` inside it becomes part of one gallery:

```vue
<div v-popupable-group>
  <img v-for="photo in photos" :src="photo" v-popupable>
</div>
```

The group is named for you. Pass a string to name it yourself, which lets several containers share a gallery:

```vue
<div v-popupable-group="'holiday'">…</div>
```

It also takes an object of [options](#options), and its members inherit them. Set an option to `false` on a member to unset an inherited value:

```vue
<div v-popupable-group="{ counter: true, thumbnails: true, looping: true }">
  <img src="photo1.jpg" v-popupable>
  <img src="photo2.jpg" v-popupable="{ counter: false }">
</div>
```

Members can also join a group without a container, with the `group` option. `group: false` takes a member out of its container's group.

Navigate with arrow buttons, swipe gestures, the scroll wheel, or the keyboard:

| Keys | Action |
|---|---|
| `→` `↓` `Page Down` `D` `S` | Next image |
| `←` `↑` `Page Up` `A` `W` | Previous image |
| `Home` | First image |
| `End` | Last image |
| `1`–`9` | Jump to image by number |

Only the slides near the active one are kept loaded, so large galleries are fine.

## Defaults

`setPopupableDefaults` sets [options](#options) for every popup on the page. A popup's own options and its group's options take priority over them:

```js
import { setPopupableDefaults } from "popupable-vue"

setPopupableDefaults({ looping: true, order: ["content", "image", "counter", "thumbnails"] })
```

Each call replaces the previous defaults. `group` can't be set as a default.

## Options

These are props on `<Popupable>`, and keys of the `v-popupable` and `v-popupable-group` objects. Use the kebab-case name of a prop in a template, eg `no-upscale`.

| Option | Description |
|---|---|
| `src` | A different image to display when the popup is open, eg a higher resolution version. |
| `title` | Title text shown alongside the image. |
| `description` | Description text shown alongside the image. |
| `content` | An element to copy as the popup content: an id, a CSS selector, or `next`/`prev` for the next/previous sibling. See [Custom content](#custom-content). |
| `fixedContentHeight` | Sizes the content area to the tallest content in the group so it doesn't resize while navigating. |
| `transparent` | Shows a checkerboard background behind transparent images. |
| `maintainAspect` | Uses the element's rendered aspect ratio instead of the image's natural dimensions. |
| `noUpscale` | Prevents the popup from scaling the image beyond its native resolution. |
| `zoomable` | Enables click/tap-to-zoom and scroll wheel zoom. See [Zoom](#zoom). |
| `anim` | The open/close animation style. See [Animation styles](#animation-styles). |
| `group` | The name of the gallery to join. |
| `looping` | Makes a group loop, from the last item to the first and back. |
| `counter` | Shows a "1 / N" counter when in a group. |
| `thumbnails` | Shows a thumbnail strip when in a group. |
| `thumb` | Image to use for this element in the thumbnail strip. Falls back to `src`, then the element's own `src`. |
| `order` | The order of the UI elements around the image. See [Custom UI order](#custom-ui-order). |
| `type` | `image` or `video`. Forces how the source is treated, regardless of its tag or file extension. |
| `poster` | Image to show before a video has loaded. It is also the video's thumbnail. |
| `attr` | Properties to set on the `<video>` element. See [Videos](#videos). |
| `popupId` | A CSS `id` for the popup. See [Custom IDs](#custom-ids). Not on `v-popupable-group`. |
| `disabled` | Turns the popup off. Not on `v-popupable-group`. |

Changing an option applies the next time the popup opens.

### Non-image elements

Any element can be made openable. Use `src` to specify the image to display:

```vue
<div style="background-image: url(photo.jpg)" v-popupable="{ src: 'photo.jpg' }"></div>
```

### Videos

A source is treated as a video if it is a `<video>` tag, if its URL ends in `.mp4`, `.m4v`, `.webm`, `.ogv`, `.mov`, `.3gp`, `.m3u8` or `.flv`, or if `type` is `video`:

```vue
<video src="clip.mp4" poster="clip.jpg" v-popupable></video>
<div v-popupable="{ type: 'video', src: '/video/clip', poster: '/preview/clip.jpg' }"></div>
```

`attr` sets properties on the popup's `<video>` element, as an object or a comma-separated string. Names are JavaScript property names, matched case-insensitively:

```vue
<video src="clip.mp4" v-popupable="{ attr: { muted: true, loop: true, autoplay: true, playbackRate: 1.5 } }"></video>
<video src="clip.mp4" v-popupable="{ attr: 'controls=false' }"></video>
```

Videos get `controls` when opened unless `attr` sets it. `zoomable` always turns it off, because click and scroll are used for zoom and pan. Videos are always rendered with `playsInline`.

A video with a `poster` or `thumb` uses an image in the thumbnail strip, which loads much faster.

### Canvases

A `<canvas>` shows as a live mirror: anything drawn to it while the popup is open is shown in the popup. `src` works the same as on images.

```vue
<canvas width="800" height="450" v-popupable></canvas>
```

### Custom content

The `#content` slot is the usual way to add rich content. The `content` option copies an existing element instead, so that copy is static and its listeners don't carry over:

```vue
<img src="photo.jpg" v-popupable="{ content: 'photo-caption' }">
<div id="photo-caption" hidden>
  <div class="popupable-title">Sunset over <em>Santorini</em></div>
</div>
```

`next` and `prev` use the sibling element, and hide it on the page. Inside a Vue template, use a hidden element rather than a `<template>`.

The `popupable-title` and `popupable-description` classes give your markup the same styling as the `title` and `description` options.

### Zoom

All images support pinch-to-zoom. `zoomable` also enables tap/click-to-zoom and scroll wheel zoom, and shows a close button in the corner. When zoomed in, pan by dragging and zoom with the scroll wheel. Click the image or background, or pinch back to scale 1, to unzoom.

### Custom UI order

`order` controls the order of the UI elements around the image, as an array or a comma-separated string. Everything before `image` goes in the header, and everything after it goes in the footer. The default is `counter,image,content,thumbnails`.

```vue
<div v-popupable-group="{ order: ['counter', 'image', 'thumbnails', 'content'] }">…</div>
```

### Custom IDs

`popupId` gives the popup a CSS `id`. In a gallery, it updates as you navigate:

```vue
<img src="red.jpg" v-popupable="{ popupId: 'theme-red' }">
```

```css
#theme-red { --popupable-background: #3a0000cc; }
```

### Animation styles

| Value | Description |
|---|---|
| `expand` | Expands from the image's original position (default) |
| `pop` | Scales up from a slightly smaller version at the final position |
| `line` | Expands vertically from a thin horizontal line at the center, like a CRT TV powering on |
| `float` | Fades in while rising upward into position |

The popup gets a `popupable-anim-{name}` class. Register your own styles on `window.popupableAnimTypes`, as described in the [popupable README](https://github.com/ewanhowell5195/popupable#custom-animation-styles).

While a popup is open, its source gets one of these classes:

| Class | Applied when |
|---|---|
| `popupable-hide` | The animation hides the source (built-in: `expand`). |
| `popupable-source-open` | The animation leaves the source visible (built-in: `pop`, `line`, `float`). |

## Events

`<Popupable>` emits these events. The payload is the popupable event's `detail`:

| Event | Fired when | Payload |
|---|---|---|
| `open` | Its popup starts opening. It fires again if a closing popup is reopened. | `{ popup }` |
| `switch` | A gallery navigates to it. | `{ popup, previous, index }` |
| `close` | Its popup has fully closed. | `{ popup }` |

```vue
<Popupable @open="paused = true" @close="paused = false">
  <img src="photo.jpg">
</Popupable>
```

`open` and `close` fire on the element the popup was opened from, even after navigating a gallery.

On a `v-popupable` element, listen to the native events:

```vue
<img src="photo.jpg" v-popupable @popupable:open="e => console.log(e.target, e.detail.popup)">
```

They bubble, so a parent can listen too.

## Render functions and JSX

`popupableAttrs` returns the attributes for a set of options, for render functions, JSX, and elements you create yourself:

```js
import { popupableAttrs } from "popupable-vue"

h("img", { src: "photo.jpg", ...popupableAttrs({ title: "Sunset" }) })

for (const [name, value] of Object.entries(popupableAttrs({ zoomable: true }))) {
  if (value !== undefined) canvas.setAttribute(name, value)
}
```

## Customization

Popups can be styled using CSS variables:

```css
:root {
  /* Overlay */
  --popupable-background: #000B;        /* Backdrop color */
  --popupable-blur: 6px;                /* Backdrop blur amount */

  /* UI elements (header, footer, buttons) */
  --popupable-ui-background: #0008;     /* Header/footer/button background */
  --popupable-text-color: #fff;         /* Text and icon color */

  /* Spacing */
  --popupable-screen-padding: 40px;     /* Minimum gap between image and viewport edge */

  /* Animation */
  --popupable-open-duration: .25s;      /* Open/close transition duration */
  --popupable-open-easing: ease;        /* Open/close transition easing */
  --popupable-switch-duration: .25s;    /* Gallery navigation transition duration */
  --popupable-switch-easing: ease;      /* Gallery navigation transition easing */
  --popupable-zoom-duration: .25s;      /* Zoom in/out transition duration */
  --popupable-zoom-easing: ease;        /* Zoom in/out transition easing */
}
```

Popups are rendered outside your component, so a `scoped` style only reaches markup from the `#content` slot. Style everything else with a global style.

## License

[MPL-2.0](LICENSE) © [Ewan Howell](https://ewanhowell.com/)
