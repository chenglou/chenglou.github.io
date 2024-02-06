import { makeScheduler } from "./midui"

const scheduleRender = makeScheduler(render)

window.addEventListener("resize", () => scheduleRender())

function render(now: number) {
  console.log("rendering", now)
  return false
}
