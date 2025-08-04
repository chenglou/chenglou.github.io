My [Midjourney AI art gallery](https://chenglou.me), made to show shiny UI/UX details. As seen in the [tweet](https://twitter.com/_chenglou/status/1599071638250606592).

[![Demo](https://user-images.githubusercontent.com/1909539/205446527-862d2324-a729-4de9-90d7-5fc9c1b63c9f.png)](https://youtu.be/OwzPOJnj2Vw)

## Features
- **Non-disruptive, interruptible transitions**. Animations don't block your ability to interact with the UI.
- **Optionally reduced motion for accessibility**.
- **[Layout-aware decoupled hit areas](https://youtu.be/MBSdQqZkXyc)**. In the gallery's line mode, the left & right cursor hit areas vertically extend to the window's edges, so that horizontally thin images don't have smaller hit areas than others. Hit areas also don't move with their image during transition, so you don't have to snipe click images. Consequently, rapidly clicking the left or right image doesn't accidentally dismiss the gallery (caused by clicking on a gap between image, or re-clicking on the newly centering image itself while it's still moving).
- **[Window resize transition](https://youtu.be/mfePLQ7OAEY)**. Just enough to convey what moved where.
- **[Anchor during resize](https://youtu.be/F2nawwZxy0g)**. No layout shift! Resize without losing what you're looking at.
- **[Area-based responsive image size](https://youtu.be/WkMRftTD4SA)**. Naive responsive layout uses the width of an item, but an image's visual impact is determined by its area. For the same width, square images visually appear bigger, while long images end up too thin. So we punish the formers by shrinking them, and grow the latters, to end up with more visually equal image sizes. Nice tangential article [here](https://www.dreamerux.com/articles/n2zhrp9ikfx2boypip3r2r9mhfy0um).
- **[Non-throttled cursor updates](https://youtu.be/ANgSxs0Y0Ys)**. The cursor state, when specified on the UI elements themselves (e.g. `cursor: 'zoom-in'`), doesn't update immediately during smooth scrolling. Hover effects also don't trigger til scrolling ends.
- **[Edge rubberbanding on the first & last item](https://youtu.be/K1BZcfgYGuY)**.
- **[Dynamic depth management](https://youtu.be/VKEdfOcjO1s)**. Proper z-index adjustments when images overlap. The center image in line view needs to be in front.
- **[Framerate-decoupled animation](https://www.kirupa.com/animations/fixing_frame_rate_for_consistent_animations.htm)**. Transitions run well and on time even when framerate is uneven, or when frames are completely dropped on lower-end devices.
- **[Spring physics](https://youtu.be/lmV07ZoruGA)** (exaggerated in the link for effect). Subtle playful bounces.
- **[Continous hover effect](https://youtu.be/AKmc_7groFY)**. The cursor attracts images magnetically, as opposed to a typical discrete, one-off upward lift transition trigger.
- **[Seamless repositioning on image dismissal](https://youtu.be/jyuYlebNNCg)**. In line view, navigating to a image and dismissing it transports you to the location of that image even if it's way further down the grid.
- **[Pretty selections](https://user-images.githubusercontent.com/1909539/205440816-ff666880-1acb-4ece-b548-51ad8b3af434.png)**. Select-all doesn't ruin the page's look.
- **[Routing](https://youtu.be/Sjpt65KFftg)**.
- **Occlusion culling**. Only render what's in view (sometime called virtualization). This puts a nice hard upper bound on the amount of DOM manipulations.
- **Keyboard inputs & multiple inputs coordination**. Concurrent keys and cursor events are resolved without pretending they're independent events.
- **Progressive image loading**. Though this could be done better.
- **Smoothness & performance**. Works on 120fps displays, including ProMotion.
- **Battery-friendly**. Fewer DOM nodes & no excessive tangential computations. You'll never get the Safari tab energy consumption warning.
- **Blur & brightness effects**. These help focusing on the middle image in the line view.
- **SEO-friendly**.
- Cool images =)

For developers:
- **Short, dependency-free code with no hidden control flow**.
- **Fun debug mode with manual frame stepping**.
- **Guaranteed minimum render count**. Renders are batched per frame. Also no multi-frames cascading rerenders from wrongly ordered state changes.
- **Minimal DOM nodes**. A clean, wrapper-divs-free inspector experience.

## Architecture
![IMG_6937](https://github.com/user-attachments/assets/caee340e-cc75-4611-9d81-bc31aca0457b)
