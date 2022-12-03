My [MidJourney](http://midjourney.com) AI art gallery, made mostly to show shiny UI/UX details.

Features:
- Non-disruptive, interruptible transitions. The images moving around doesn't block your ability to interact with the UI.
- Layout-aware decoupled hit areas. In the gallery's line mode, the cursor hit areas on the left and right vertically extent to the window's edges, so that horizontally thin images don't have smaller hit areas. Hit areas also don't move with the images during transition, so you don't have to snipe click images. Consequently, rapidly clicking the left or right image doesn't accidentally dismiss the gallery (say, because you clicked on a gap between image, or the newly centering image itself).
- Optionally reduced motion for accessibility.
- Window resize transition. Just enough to convey which images moved where.
- Area-based responsive image size. Naive responsive layout uses the width of the items, but an image's visual impact is determined by its area. The gallery adjusts the images to be visually more equal. For the same width, square images visually appear bigger, while long images end up too thin. So we punish the formers by shrinking them, and grow the latters. Nice tangential article [here](https://www.dreamerux.com/articles/n2zhrp9ikfx2boypip3r2r9mhfy0um).
- Non-throttled cursor updates. The browser's cursor states, when specified on the UI elements themselves (e.g. `cursor: 'zoom-in'`), don't update immediately when smooth scrolling. Hover effects also don't trigger til scrolling ends.
- Occlusion culling. Only render what's in view. This puts a nice hard upper bound on many other heavy DOM manipulations. Note that even static DOM stuff outside of viewport can affect resize smoothness.
- Edge rubberbanding on first & last item.
- Filter effects. These help focusing on the middle image in the line view.
- Dynamic depth management. Proper z-index adjustments when images overlap. The center image in line view needs to be in front.
- Framerate-decoupled animation. Transitions run well and on time even when framerate is uneven, or when frames are completely dropped on lower-end devices. [Relevant article](https://www.kirupa.com/animations/fixing_frame_rate_for_consistent_animations.htm)
- Spring physics. Subtle playful bounces.
- Continous hover effect. The cursor attracts images magnetically, as opposed to a typical discrete, one-off upward lift transition.
- Seamless repositioning on image dismissal. In line view, navigating to a image and dismissing it transports you to the location of that image even if it's way further down the grid.
- Keyboard inputs & multiple inputs coordination. Concurrent keys and cursor events are resolved without pretending they're independent events.
- Pretty selections. Select-all doesn't ruin the page's look.
- Progressive image loading. Though this could be done better.
- Smoothness & performance. Works on 120fps displays, including ProMotion.
- Battery-friendly. Fewer DOM nodes & no excessive tangential computations. You'll never get the Safari tab energy consumption warning.
- Routing.
- SEO-friendly.
- Cool images =)

For developers:
- Short, dependency-free code with no hidden control flow.
- Fun debug mode with manual frame stepping.
- Guaranteed minimal render count. Renders are batched per frame. Also no multi-frames cascading rerenders from wrongly ordered state changes.
- Clean, idiomatic DOM for a great, wrapper-divs-free inspector experience.
