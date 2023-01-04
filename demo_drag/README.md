[Draggable cards demo](https://chenglou.me/demo_drag/), showing shiny UI/UX details using the same architecture as the main image gallery. As seen in the [tweet](https://twitter.com/_chenglou/status/1609862082882863104)

[![Demo](https://user-images.githubusercontent.com/1909539/210219177-6b9147d6-1bac-4579-a109-6281c685cec8.jpg)](https://youtu.be/iycK9nq1jf0)

## Features
- **Non-disruptive, interruptible transitions**. Animations don't block your ability to interact with the UI.
- **Dynamic depth management**. Proper z-index adjustments when cards overlap and when a card's being lifted.
- **[Framerate-decoupled animation](https://www.kirupa.com/animations/fixing_frame_rate_for_consistent_animations.htm)**. Transitions run well and on time even when framerate is uneven, or when frames are completely dropped on lower-end devices.
- **Spring physics**. Just like in the image gallery.
- **Card flick**. Releasing a card preserves the flick's velocity and throws it into place.
- **Smoothness & performance**. Works on 120fps displays, including ProMotion.

## Architecture

Same as [image gallery's chart](https://github.com/chenglou/chenglou.github.io/tree/b168386a23ccdffd2ff21c71d2a9e0871471c836#architecture).
