import { center, makeScheduler, spring, springGoToEnd, springStep } from "./midui"

// === constant layout metrics. The rest is dynamic
const rowSizeX = 320
const windowPaddingTop = 50

// === state
let dragged = null
let lastDragged = null
/** @type 'down' | 'up' | 'firstDown' */
let pointerState = 'up'
let pointer = [{ x: 0, y: 0, time: 0 }] // circular buffer. Btw, on page load, there's no way to render a first cursor state =(
let data = []; {
  const windowSizeX = document.documentElement.clientWidth // excludes scroll bar & invariant under safari pinch zoom
  for (let i = 0; i < 5; i++) {
    let node = document.createElement("div")
    const sizeY = 30 + Math.random() * 150 // [30, 180)
    node.className = "row"
    node.innerHTML = "Drag Me " + i
    node.style.width = rowSizeX
    node.style.height = sizeY
    const rand = Math.random() * 40 + 40 // Range: [40, 80]
    node.style.outline = `1px solid hsl(205, 100%, ${rand}%)` // blue hue
    node.style.backgroundColor = `hsl(205, 100%, ${rand + 10}%)` // lighter blue hue
    data.push({
      id: i + '', // gonna drag rows around so we can't refer to a row by index. Assign a stable id
      sizeY,
      x: spring(center(rowSizeX, windowSizeX)),
      y: spring(0),
      scale: spring(1),
      node: node,
    })
    document.body.appendChild(node)
  }
}
function springForEach(f) {
  for (let d of data) {
    f(d.x); f(d.y); f(d.scale) // no different than [a, b, c].forEach(f)
  }
}

// === hit testing logic. Boxes' hit area should be static and not follow their current animated state usually (but we can do either). Use the dynamic area here for once
function hitTest(data, pointer) {
  for (let d of data) {
    let { x, y, sizeY } = d
    if (x.pos <= pointer.x && pointer.x < x.pos + rowSizeX && y.pos <= pointer.y && pointer.y < y.pos + sizeY) return d // pointer on this box
  }
}

// pointermove doesn't work on android, pointerdown isn't fired on Safari on the first left click after dismissing context menus, mousedown doesn't trigger properly on mobile, pointerup isn't triggered when pointer panned (at least on iOS), don't forget contextmenu event. Tldr there's no pointer event that works cross-browser that can replace mouse & touch events.
const scheduleRender = makeScheduler(['mouseup', 'touchend', 'mousemove', 'touchmove', 'pointerdown'], (now, events, animationSteps) => {
  // === step 0: process events
  // mouseup/touchend
  if (events.mouseup || events.touchend) pointerState = 'up'
  // move
  // when scrolling (which might schedule a render), a container's pointermove doesn't trigger, so the pointer's local coordinates are stale
  // this means we should only use pointer's global coordinates, which is always right
  if (events.mousemove) pointer.push({ x: events.mousemove.pageX, y: events.mousemove.pageY, time: performance.now() })
  if (events.touchmove) pointer.push({ x: events.touchmove.touches[0].pageX, y: events.touchmove.touches[0].pageY, time: performance.now() })
  // down
  if (events.pointerdown) {
    pointerState = 'firstDown'
    pointer.push({ x: events.pointerdown.pageX, y: events.pointerdown.pageY, time: performance.now() })
  }

  // === step 1: batched DOM reads (to avoid accidental DOM read & write interleaving)
  const windowSizeX = document.documentElement.clientWidth // excludes scroll bar & invariant under safari pinch zoom
  const pointerLast = pointer.at(-1) // guaranteed non-null since pointer.length >= 1

  // === step 2: handle inputs-related state change
  let newDragged
  let releaseVelocity = null
  if (pointerState === 'down') newDragged = dragged
  else if (pointerState === 'up') {
    if (dragged != null) {
      let dragIdx = data.findIndex(d => d.id === dragged.id)
      let i = pointer.length - 1; while (i >= 0 && now - pointer[i].time <= 100) i-- // only consider last ~100ms of movements
      let deltaTime = now - pointer[i].time
      let vx = (pointerLast.x - pointer[i].x) / deltaTime * 1000 // speed over ~1s
      let vy = (pointerLast.y - pointer[i].y) / deltaTime * 1000
      data[dragIdx].x.v += vx
      data[dragIdx].y.v += vy
    }
    newDragged = null
  } else {
    const hit = hitTest(data, pointerLast)
    if (hit) newDragged = { id: hit.id, deltaX: pointerLast.x - hit.x.pos, deltaY: pointerLast.y - hit.y.pos }
  }

  // === step 3: calculate new layout & cursor
  if (newDragged) { // first, swap row based on cursor position if needed
    let dragIdx = data.findIndex(d => d.id === newDragged.id) // guaranteed non-null
    let d = data[dragIdx]
    const x = pointerLast.x - newDragged.deltaX
    const y = pointerLast.y - newDragged.deltaY
    d.x.pos = d.x.dest = x + (center(rowSizeX, windowSizeX) - x) / 1.5 // restrict horizontal drag a bit
    d.y.pos = d.y.dest = y
    d.scale.dest = 1.1
    // dragging row upward? Swap it with previous row if cursor is above the first half previous row
    while (dragIdx > 0 && pointerLast.y < data[dragIdx - 1].y.dest + data[dragIdx - 1].sizeY / 2) {
      [data[dragIdx], data[dragIdx - 1]] = [data[dragIdx - 1], data[dragIdx]] // swap
      dragIdx--
    }
    // dragging row downward? Swap it with next row if cursor is below the first half next row
    while (dragIdx < data.length - 1 && pointerLast.y > data[dragIdx + 1].y.dest + data[dragIdx + 1].sizeY / 2) {
      [data[dragIdx], data[dragIdx + 1]] = [data[dragIdx + 1], data[dragIdx]] // swap
      dragIdx++
    }
  }
  let top = windowPaddingTop
  for (let d of data) {
    if (newDragged && d.id === newDragged.id) { // already modified above
    } else {
      d.x.dest = center(rowSizeX, windowSizeX)
      d.y.dest = top
      d.scale.dest = 1
    }
    top += d.sizeY
  }
  const cursor =
    newDragged ? 'grabbing' // will be "grabbing" even if cursor isn't on the card! Try dragging to left/right extremes
      : hitTest(data, pointerLast) ? 'grab'
        : 'auto'

  // === step 4: run animation
  let stillAnimating = false
  springForEach(s => {
    for (let i = 0; i < animationSteps; i++) springStep(s)
    if (Math.abs(s.v) < 0.01 && Math.abs(s.dest - s.pos) < 0.01) springGoToEnd(s) // close enough, done
    else stillAnimating = true
  })

  // === step 5: render. Batch DOM writes
  for (let i = 0; i < data.length; i++) {
    let d = data[i], style = d.node.style
    style.transform = `translate3d(${d.x.pos}px,${d.y.pos}px,0) scale(${d.scale.pos})`
    style.zIndex =
      newDragged && d.id === newDragged.id ? data.length + 2
        : lastDragged && d.id === lastDragged.id ? data.length + 1 // last dragged and released row still needs to animate into place; keep it high
          : i
    if (newDragged && d.id === newDragged.id) {
      style.boxShadow = "rgba(0, 0, 0, 0.2) 0px 16px 32px 0px"
      style.opacity = 0.7
    } else {
      style.boxShadow = "rgba(0, 0, 0, 0.2) 0px 1px 2px 0px"
      style.opacity = 1.0
    }
  }
  document.body.style.cursor = cursor

  // === step 6: update state & prepare for next frame
  if (pointerState === 'firstDown') pointerState = 'down'
  if (dragged && newDragged == null) lastDragged = dragged
  dragged = newDragged
  if (pointerState === 'up') pointer = [{ x: 0, y: 0, time: 0 }]
  if (pointer.length > 20) pointer.shift() // keep last ~20

  return stillAnimating
})

scheduleRender()
