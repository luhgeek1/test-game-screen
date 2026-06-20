Original prompt: Нашёл серьёзную проблему. В main.js:252 последняя строка create(): this.add.image(0, 0, 'reference').setOrigin(0); рисует сам референсный скриншот поверх всей вёрстки на весь канвас. Из-за этого тест ничего не проверяет. Нужно вернуть честные тесты и доводить по ним.

Notes:
- Removed the self-reference overlay from main.js and removed `reference` from SPRITE_FILES.
- Current test workflow is the user's pixelmatch-based test in tests/main-screen.spec.ts. It writes actual/expected/diff to test-results/main-screen/.
- Honest baseline after removing overlay: 61149 / 1248620 pixels, 4.90%.
- Reverted top resource counters from dark counter sprites back to light hand-drawn pills: improved to 54037 pixels, 4.33%.
- Adjusted offer/play sizing: improved to 52708 pixels, 4.22%.
- Adjusted left panel, diamond plus, and collections: improved to 51120 pixels, 4.09%.
- Tried white label strokeThickness 3; worsened to 51158, reverted to 4.
- Further tuning:
  - Bank/Collections sizing: 48893 pixels, 3.92%.
  - Offer timer/play/sellout/mini label: 45347 pixels, 3.63%.
  - Tasks badge: 45191 pixels, 3.62%.
  - Level diamond/top row/play/minor left controls: final verified 42137 pixels, 3.37%.
- Tightened tests/main-screen.spec.ts threshold from 50% to MAX_DIFF_RATIO=0.035 so the old 4.90% regression fails.

TODO:
- Continue reducing diff without using reference_screenshot.png as an overlay or source layer.
- Biggest remaining regions: left menu labels/icons, top counters, offer sticker/timer, play button edges/label.

Update 2026-06-20:
- Continued honest pixel-perfect tuning with no reference overlay/source layer.
- Improved verified diff from 34327 / 1248620 pixels (2.75%) to 29639 / 1248620 pixels (2.37%).
- Kept failed experiments reverted: mainOfferTimer replacement, bg_resourcebar top counters, Mini-Events mask-fit shift, Collections label shift.
- Effective changes this pass:
  - Play arrow resized/repositioned and Play label shifted.
  - Tasks and Chat side buttons resized/repositioned.
  - Sellout label moved upward.
  - Offer +100% seal darkened, shadowed, and repositioned.
  - Top resource text colors adjusted to match the lighter reference text and blue coin timer.
- Tightened tests/main-screen.spec.ts MAX_DIFF_RATIO from 0.035 to 0.025. Final run passes at 2.37%.

TODO:
- Remaining largest contributors are mostly text anti-aliasing/stroke differences, left Tasks/Mini-Events, top counter geometry, offer timer, and Play/Sellout edge overlap.

Update 2026-06-20 continued:
- Improved verified diff from 29639 / 1248620 pixels (2.37%) to 29596 / 1248620 pixels (2.37% rounded).
- Effective changes this pass:
  - Tasks label size increased to 20.
  - Sellout red badge adjusted to x=1272, y=735, size=26.
  - Tightened tests/main-screen.spec.ts MAX_DIFF_RATIO from 0.025 to 0.024. Final run passes at 2.37%.
- Reverted failed experiments:
  - Play button mask-fit resize/reposition worsened to 32536 pixels and failed the tightened test.
  - Tasks badge size 28 worsened.
  - Mini-Events label y=470 worsened.
  - Offer timer text-only shift worsened.
  - Chat label size 20 worsened.
  - Bank badge size 24 worsened.

Update 2026-06-20 continued 2:
- Improved verified diff from 29596 / 1248620 pixels to 29297 / 1248620 pixels (2.35%).
- Effective changes this pass:
  - Added per-label stroke control.
  - Tasks label now uses stroke 1.
  - Chat label now uses stroke 2.
  - Mini-Events label uses stroke 3.
  - Tightened tests/main-screen.spec.ts MAX_DIFF_RATIO from 0.024 to 0.0235. Final run passes at 2.35%.
- Reverted failed experiments:
  - Larger red exclamation mark worsened.
  - Gradient resource bars worsened to ~2.61%.
  - Bank label stroke 3 worsened.
  - Mini-Events stroke 2 worsened.
  - Chat stroke 1 worsened.
  - Mini-Events label size 17 worsened.
  - Tasks label size 21 worsened.
- 100% exact match has not been reached. Remaining diff is dominated by asset/text antialiasing, top counter geometry, offer timer/sticker, and overlapping lower-right elements.

Update 2026-06-20 continued 3:
- Improved verified diff from 29297 / 1248620 pixels (2.35%) to 25465 / 1248620 pixels (2.04%).
- Effective changes this pass:
  - Rebuilt the top resource counter backgrounds as closer custom shapes instead of separate rounded pills.
  - Tuned top resource icon/plus sizes and positions.
  - Matched the top counter pale-body bboxes much closer: coin 1601 diff pixels, diamond 1293, energy 847 in their ROIs.
  - Adjusted offer timer text color to the yellow reference tone.
  - Tightened tests/main-screen.spec.ts MAX_DIFF_RATIO from 0.0235 to 0.0205. Final run must pass at 2.04%.
- Reverted failed experiments:
  - Wider diamond/energy resource bars worsened.
  - Weaker resource bar stroke alpha worsened.
  - Collect arrow with stem worsened.
  - Mini-Events label y=471 worsened.
  - mainOfferTimer replacement worsened to 2.07%.
- 100% exact match has still not been reached. Remaining diff is dominated by text/asset antialiasing and remaining non-identical source assets, especially left Tasks/Mini-Events, Play/Sellout, and offer badge/timer details.

Update 2026-06-20 continued 4:
- Focused on the top-left star counter pill shape from the user's screenshot.
- Improved current verified diff from 24155 / 1248620 pixels (1.93%) to 23628 / 1248620 pixels (1.89%).
- Star counter ROI improved from 1024 pixels to 497 pixels.
- Effective changes:
  - Replaced the star counter's rounded capsule-like right edge with a flatter beveled shape.
  - Moved/resized the star pill to match the reference bbox more closely.
  - Reduced the star pill outline from a heavy 2px stroke to a subtler 1px stroke at 0.8 alpha.
  - Tightened tests/main-screen.spec.ts MAX_DIFF_RATIO from 0.0205 to 0.019.
- Reverted/avoided worse variants:
  - Expanding the pill bbox by 1px around worsened the ROI.
  - Smaller cuts (4/5) worsened compared with cut=6.
  - r=4 worsened compared with r=3.
  - stroke alpha 0.6 worsened slightly compared with 0.8.
  - quadraticCurveTo on the star pill right edge broke Phaser Graphics rendering and spiked diff to 13.83%; reverted to straight line segments.
