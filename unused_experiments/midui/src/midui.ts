// === generic scheduler & its debugger
export function makeScheduler<K extends keyof WindowEventMap>(
  events: Array<K>,
  render: ((now: number, events: { [K in keyof WindowEventMap]: WindowEventMap[K] | null }, animationSteps: number) => boolean),
) {
  let scheduledRender = false

  let initEvents = {} as { [K in keyof WindowEventMap]: WindowEventMap[K] | null }
  for (const key of events) {
    initEvents[key] = null
    window.addEventListener(key, (e) => { initEvents[key] = e; scheduleRender() })
  }

  let animatedUntilTime: number | null = null

  function scheduleRender() {
    if (scheduledRender) return
    scheduledRender = true

    requestAnimationFrame(function renderAndMaybeScheduleAnotherRender(now) { // eye-grabbing name. No "(anonymous)" function in the debugger & profiler
      scheduledRender = false

      let newAnimatedUntilTime = animatedUntilTime ?? now
      const animationSteps = Math.floor((now - newAnimatedUntilTime) / msPerAnimationStep) // run x animation steps. Decouple physics simulation from framerate!
      newAnimatedUntilTime += animationSteps * msPerAnimationStep
      const stillAnimating = render(now, initEvents, animationSteps)
      animatedUntilTime = stillAnimating ? newAnimatedUntilTime : null

      for (const key of events) initEvents[key] = null
      if (stillAnimating) scheduleRender()
    })
  }

  return scheduleRender
}

// === generic spring physics
// 4ms/step for the spring animation's step. Typically 4 steps for 60fps (16.6ms/frame) and 2 for 120fps (8.3ms/frame). Frame time delta varies, so not always true
// could use 8ms instead, but 120fps' 8.3ms/frame means the computation might not fit in the remaining 0.3ms, which means sometime the simulation step wouldn't even run once, giving the illusion of jank
export const msPerAnimationStep = 6
export type Spring = { pos: number, dest: number, v: number, k: number, b: number }
// function spring(pos: number, v = 0, k = 290, b = 30): SpringConfig {
export function spring(pos: number, v = 0, k = 333, b = 33): Spring {
  return { pos, dest: pos, v, k, b } // k = stiffness, b = damping. Try https://chenglou.me/react-motion/demos/demo5-spring-parameters-chooser/
}
export function springStep(config: Spring) {
  // https://blog.maximeheckel.com/posts/the-physics-behind-spring-animations/
  // this seems inspired by https://github.com/chenglou/react-motion/blob/9e3ce95bacaa9a1b259f969870a21c727232cc68/src/stepper.js
  const t = msPerAnimationStep / 1000 // convert to seconds for the physics equation
  const { pos, dest, v, k, b } = config
  // for animations, dest is actually spring at rest. Current position is the spring's stretched/compressed state
  const Fspring = -k * (pos - dest) // Spring stiffness, in kg / s^2
  const Fdamper = -b * v // Damping, in kg / s
  const a = Fspring + Fdamper // a needs to be divided by mass, but we'll assume mass of 1. Adjust k and b to change spring curve instead
  const newV = v + a * t
  const newPos = pos + newV * t

  config.pos = newPos; config.v = newV
}
export function springGoToEnd(config: Spring) {
  config.pos = config.dest
  config.v = 0
}
export function springMostlyDone(s: Spring) {
  return Math.abs(s.v) < 0.01 && Math.abs(s.dest - s.pos) < 0.01
}

// === generic helpers
export function center(containee: number, container: number, containerInsetStart = 0, containerInsetEnd = 0) {
  // assuming container size already includes containerInsetStart and containerInsetEnd
  return containerInsetStart + (container - containerInsetStart - containerInsetEnd - containee) / 2
}

export function remap(value: number, oldMin: number, oldMax: number, newMin: number, newMax: number): number {
  if (oldMin === oldMax) return (newMin + newMax) / 2 // avoid divide by 0
  return (value - oldMin) / (oldMax - oldMin) * (newMax - newMin) + newMin
}

export function length(x: number, y: number) {
  return Math.sqrt(x * x + y * y)
}
export function lessEqual(a: number, b: number, c: number) {
  return a <= b && b <= c
}

export function insideInclusive(
  x1: number, y1: number,
  x2: number, y2: number, sizeX: number, sizeY: number,
) {
  return x2 <= x1 && x1 <= x2 + sizeX && y2 <= y1 && y1 <= y2 + sizeY
}

export function overlapInclusive(
  x1: number, y1: number, sizeX1: number, sizeY1: number,
  x2: number, y2: number, sizeX2: number, sizeY2: number,
) {
  return x1 <= x2 + sizeX2 && x2 <= x1 + sizeX1 && y1 <= y2 + sizeY2 && y2 <= y1 + sizeY1
}

export function fit(ar: number, containerSizeX: number, containerSizeY: number) {
  // returns max size x that fits in the container without changing aspect ratio
  return Math.min(containerSizeX, containerSizeY * ar) // returns fitted sizeX. Get fitted sizeY with sizeX / ar
}

export function clamp(min: number, v: number, max: number) {
  return v > max ? max : v < min ? min : v
}

export function easeOutQuad(x: number): number {
  return 1 - (1 - x) ** 2
}
export function easeOutQuart(x: number): number {
  return 1 - (1 - x) ** 4
}

export function rem(x: number) {
  return x * 16
}

export function minIndex(arr: number[]) {
  let min = Infinity
  let minIndex = 0
  for (let i = 0; i < arr.length; i++) {
    const value = arr[i]!
    if (value < min) {
      minIndex = i
      min = value
    }
  }
  return minIndex
}

export function fract(x: number) {
  return x - Math.floor(x)
}

// export function hash12(a: number, b: number) {
//   let aa = fract(a * .1031)
//   let bb = fract(b * .1031)
//   let p3_0 = aa * .1031, p3_1 = bb * .1031, p3_2 = aa * .1031
//   let q3_0 = p3_0 + 33.33, q3_1 = p3_1 + 33.33, q3_2 = p3_2 + 33.33
//   let dotted = p3_2 * q3_0 + p3_0 * q3_1 + p3_1 * q3_2
//   p3_2 += dotted; p3_0 += dotted; p3_1 += dotted
//   return fract((p3_2 + p3_0) * p3_1)
// }

// convenient types
export type XY = { x: number, y: number }
