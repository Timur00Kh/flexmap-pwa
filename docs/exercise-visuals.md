# Exercise reference artwork

Generated on 2026-11-12 using the built-in `image_gen` tool in scientific-educational mode. The accepted shoulder-flexion sheet established the person, forest-green clothing, white backdrop and realistic editorial illustration style. Other accepted full-body sheets and the two wrist closeups use that style; the final sheets were individually inspected.

## Runtime assets

`public/exercises/<exercise-id>.webp` contains five square 480 × 480 frames, ordered from level 1 to level 5. Each sprite is 2400 × 480. `Pose.tsx` selects a frame with a 500% background and 0/25/50/75/100% horizontal positions; it preserves localized exercise/level descriptions through an accessible image label. All assets load locally without a third-party image service.

Original generated sheets were split into five columns with Sharp, resized proportionally into a square, padded with white margins and encoded as WebP (quality 85). The seated knee-extension sheet uses individually inspected source crop bounds to preserve each whole chair and extended foot without including any adjacent scene; every delivered frame is still an equal square. No limbs were procedurally drawn, warped or interpolated. No clinical angle labels, scores or progress claims are baked into the artwork.

## Review and limitations

The five positions show illustrative movement ranges, not measured angles or prescribed targets. Exercise meanings, instructions and cautions remain in `src/lib/exercises.ts`. These AI-created illustrations have been visually checked for exercise direction, major joint position, complete hands/feet, no text and an ordered range. They have not been clinically validated. Scapular retraction is intentionally subtle. Hip rotation uses a deliberately modest lower-leg sweep so the thighs remain approximately stationary. A wider initial version was replaced after review. Written instructions remain the precise source of technique.

Initial shoulder/chest attempts with labels or inconsistent clothing were rejected. Two range sheets were recomposed to remove neighboring-scene bleed; an intermediate seated knee-extension image with feet on the floor was rejected, and the final accepted version preserves a raised, straight working leg. Only accepted replacements are shipped.

## Accepted generation prompts

The prompts below are the final prompts supplied to the built-in tool. The initial shoulder-flexion call generated a new image without inputs. Subsequent neck sheets were new generations; remaining accepted sheets used the initial shoulder-flexion output as a style/person reference, except final knee-extension, which edited its initial correct-geometry sheet to add spacing.

### neck-flexion

Asset: `public/exercises/neck-flexion.webp`

```text
Use case: scientific-educational. Asset: physiotherapy exercise reference sprite sheet. Premium realistic medical editorial illustration with natural detailed anatomy, soft dimensional shading and fine pencil contours, NOT a stick figure. PURE WHITE background. Same adult woman in all panels: brown hair in a bun, dark forest-green short-sleeve athletic top and matching leggings, barefoot. Exactly FIVE equal-width vertical panels in ONE horizontal row, each 20% canvas width, no gutters or borders. NO TEXT, NUMBERS, ARROWS or symbols. Identical camera, scale, body proportions, floor baseline and person across all five panels. All relevant anatomy completely within its own panel with margins. Wide landscape sheet about 3:1. Waist-up strict side view facing right. Both arms relaxed at sides, shoulders and torso perfectly upright and unchanged. Only head bends forward at the neck progressively. LEFT TO RIGHT: (1) head neutral eyes level; (2) small nod chin slightly lowers; (3) moderate neck flexion chin halfway toward chest; (4) chin approaches chest; (5) chin comfortably close to chest. Keep neck attached naturally to shoulders, do not round torso.
```

### neck-extension

Asset: `public/exercises/neck-extension.webp`

```text
Use case: scientific-educational. Asset: physiotherapy exercise reference sprite sheet. Premium realistic medical editorial illustration with natural detailed anatomy, soft dimensional shading and fine pencil contours, NOT a stick figure. PURE WHITE background. Same adult woman in all panels: brown hair in a bun, dark forest-green short-sleeve athletic top and matching leggings, barefoot. Exactly FIVE equal-width vertical panels in ONE horizontal row, each 20% canvas width, no gutters or borders. NO TEXT, NUMBERS, ARROWS or symbols. Identical camera, scale, body proportions, floor baseline and person across all five panels. All relevant anatomy completely within its own panel with margins. Wide landscape sheet about 3:1. Waist-up strict side view facing right. Both arms relaxed at sides, shoulders and torso perfectly upright and unchanged. Only head tilts back at neck progressively. LEFT TO RIGHT: (1) head neutral eyes level; (2) gaze 10 degrees upward; (3) gaze 20 degrees upward; (4) gaze 30 degrees upward; (5) gaze comfortably 40 degrees upward. Natural neck anatomy, no backward torso arch, no extreme hyperextension.
```

### neck-rotation

Asset: `public/exercises/neck-rotation.webp`

```text
Use case: scientific-educational. Asset: physiotherapy exercise reference sprite sheet. Premium realistic medical editorial illustration with natural detailed anatomy, soft dimensional shading and fine pencil contours, NOT a stick figure. PURE WHITE background. Same adult woman in all panels: brown hair in a bun, dark forest-green short-sleeve athletic top and matching leggings, barefoot. Exactly FIVE equal-width vertical panels in ONE horizontal row, each 20% canvas width, no gutters or borders. NO TEXT, NUMBERS, ARROWS or symbols. Identical camera, scale, body proportions, floor baseline and person across all five panels. All relevant anatomy completely within its own panel with margins. Wide landscape sheet about 3:1. Waist-up FRONT VIEW, shoulders fixed facing camera in all five panels, arms relaxed, torso upright. Only HEAD rotates gradually toward the woman’s left (viewer right). LEFT TO RIGHT: (1) face looks straight at camera; (2) head turned 20 degrees; (3) head turned 40 degrees; (4) head turned 60 degrees; (5) head comfortably turned 80 degrees almost profile. Shoulder line stays horizontal and unchanged, natural head and neck.
```

### shoulder-flexion

Asset: `public/exercises/shoulder-flexion.webp`

```text
Use case: scientific-educational. Asset: physiotherapy exercise reference sprite sheet. Create a premium beautifully drawn medical editorial illustration, natural detailed anatomy, soft dimensional shading and restrained pencil contours, NOT a stick figure or diagram. PURE WHITE background. One adult woman with dark hair in a bun, dark forest-green short-sleeve athletic top and matching leggings, barefoot. Exactly FIVE equal-width vertical panels in ONE horizontal row, each occupying 20% canvas width, no gutters, no borders, NO TEXT, NO NUMBERS, NO ARROWS. Whole person visible head to feet with ample margin above highest hand. Exactly the SAME camera, scale, body proportions, floor line and person in all five panels. Strict side view, woman faces right. Exercise: shoulder flexion, raise ONE straight arm forward and overhead, palm faces inward, elbow straight, other arm relaxed along body, torso and neck remain upright and fixed. From LEFT TO RIGHT, working arm is (1) straight down next to hip, (2) 45 degrees forward from down, (3) horizontal pointing forward at shoulder height, (4) 135 degrees from down diagonally upward-forward, (5) vertical straight up overhead. Anatomically coherent hands, elbows and shoulders. Wide landscape sheet, roughly 3:1 ratio. No ghosts, duplicate limbs, labels, lines, logos or watermark.
```

### shoulder-abduction

Asset: `public/exercises/shoulder-abduction.webp`

```text
Use case: scientific-educational. Create a premium realistic medical editorial illustration sprite sheet: natural detailed anatomy, soft dimensional shading, fine pencil contours. Pure WHITE background. Same adult woman as reference: dark hair bun, forest GREEN short-sleeve athletic top and full leggings, barefoot. Exactly FIVE equal-width columns in ONE horizontal row, each 20% width, no gutters/borders. NO TEXT, NO NUMBERS, NO ARROWS, NO SYMBOLS anywhere. Identical camera/scale/person/baseline across all five. Anatomy inside OWN column with margins. Wide 3:1 ratio. Supplied reference controls ONLY person, clothing and style; NEW exercise follows. FULL BODY FRONT VIEW, woman facing camera, ONE straight arm on VIEWER RIGHT raises laterally in frontal plane away from side, other arm hangs down. Use SMALLER figure so full straight arm fits in its 20% wide column even when horizontal, keep all five people equally small with ample WHITE SPACE. LEFT TO RIGHT: (1) arm down; (2) slight side lift; (3) arm halfway toward shoulder height; (4) arm horizontal sideways at shoulder height; (5) arm diagonally up sideways a little above shoulder height. Upper arm and forearm form straight line. Palm down, torso upright, no lean. ZERO angle labels or graphics.
```

### shoulder-external-rotation

Asset: `public/exercises/shoulder-external-rotation.webp`

```text
Use case: scientific-educational. Create a premium realistic medical editorial illustration sprite sheet: natural detailed anatomy, soft dimensional shading, fine pencil contours. Pure WHITE background. Same adult woman as reference: dark hair bun, forest GREEN short-sleeve athletic top and full leggings. Exactly FIVE equal-width columns in ONE horizontal row, each 20% width, no gutters/borders. NO TEXT, NO NUMBERS, NO ARROWS, NO SYMBOLS anywhere. Identical camera/scale/person/baseline across all five. Anatomy inside OWN column with margins. Wide about 3:1 ratio. Supplied reference controls ONLY person, clothing and style; NEW exercise follows. WAIST-UP FRONT view, with camera slightly above waist so forearm horizontal sweep is clear. One working upper arm on VIEWER RIGHT held VERTICAL gently touching her side, elbow bent 90 degrees, forearm HORIZONTAL at waist height. Only rotate outward at shoulder to sweep hand away to viewer right, elbow does NOT move. Other arm stays relaxed at side. LEFT TO RIGHT: (1) forearm points straight forward toward camera, foreshortened; (2) hand a little to side; (3) hand moderately to side; (4) hand further to side; (5) forearm almost sideways to viewer right. Same upper arm vertical touching torso ALL panels. NO raised upper arm, no vertical shoulder flexion, NO palm-up biceps curl, NO elbow straightening.
```

### chest-opener

Asset: `public/exercises/chest-opener.webp`

```text
Use case: scientific-educational. Create a premium realistic medical editorial illustration sprite sheet: natural detailed anatomy, soft dimensional shading, fine pencil contours. Pure WHITE background. Same adult woman as reference: dark hair bun, forest GREEN short-sleeve athletic top and full leggings. Exactly FIVE equal-width columns in ONE horizontal row, each 20% width, no gutters/borders. NO TEXT, NO NUMBERS, NO ARROWS, NO SYMBOLS anywhere. Identical camera/scale/person/baseline across all five. Anatomy inside OWN column with margins. Wide about 3:1 ratio. Supplied reference controls ONLY person, clothing and style; NEW exercise follows. WAIST-UP strict SIDE VIEW facing right, woman standing upright with arms hanging relaxed down. Gently retract shoulder blades by moving shoulders BACK without moving arms away from torso. LEFT TO RIGHT: (1) relaxed shoulders; (2) subtle draw-back; (3) modest retraction; (4) clearer comfortable retraction; (5) full comfortable retraction. Subtle progressive changes, same fixed upright head and neutral spine, NO back arch, NO chest thrust, NO arm raise. Only shoulder position changes gently backward.
```

### thoracic-rotation

Asset: `public/exercises/thoracic-rotation.webp`

```text
Use case: scientific-educational. Asset: physiotherapy exercise reference sprite sheet. Premium realistic medical editorial illustration with natural detailed anatomy, soft dimensional shading and fine pencil contours, NOT a stick figure. PURE WHITE background. Same adult woman in all panels: brown hair in a bun, dark forest-green short-sleeve athletic top and matching leggings, barefoot. Exactly FIVE equal-width vertical panels in ONE horizontal row, each 20% canvas width, no gutters or borders. NO TEXT, NUMBERS, ARROWS or symbols. Identical camera, scale, body proportions, floor baseline and person across all five panels. All relevant anatomy completely within its own panel with margins. Wide landscape sheet about 3:1. Reference image: use supplied image ONLY for consistent person, clothing, rendering style and pure-white backdrop. Create a NEW exercise: Woman sits upright on a simple pale wood armless chair, FULL BODY visible, bare feet planted, thighs horizontal and knees facing camera, hands crossed on chest. FRONT VIEW. Pelvis, knees and feet stay facing forward in every panel, only upper chest and head rotate gradually toward viewer right. LEFT TO RIGHT: (1) torso facing camera; (2) small turn; (3) moderate turn; (4) clear 45 degree torso turn; (5) comfortable 60 degree torso turn. Maintain upright spinal axis, NO side bend, no tilted shoulders.
```

### back-flexion

Asset: `public/exercises/back-flexion.webp`

```text
Use case: scientific-educational. Asset: physiotherapy exercise reference sprite sheet. Premium realistic medical editorial illustration with natural detailed anatomy, soft dimensional shading and fine pencil contours, NOT a stick figure. PURE WHITE background. Same adult woman in all panels: brown hair in a bun, dark forest-green short-sleeve athletic top and matching leggings, barefoot. Exactly FIVE equal-width vertical panels in ONE horizontal row, each 20% canvas width, no gutters or borders. NO TEXT, NUMBERS, ARROWS or symbols. Identical camera, scale, body proportions, floor baseline and person across all five panels. All relevant anatomy completely within its own panel with margins. Wide landscape sheet about 3:1. Reference image: use supplied image ONLY for consistent person, clothing, rendering style and pure-white backdrop. Create a NEW exercise: Woman sits on a simple pale wood armless chair. STRICT SIDE VIEW facing right, FULL BODY and chair visible. Feet flat under knees, hands resting lightly near knees. She hinges gently forward from HIP JOINT while keeping spine long. LEFT TO RIGHT: (1) torso vertical; (2) small 15 degree forward hinge; (3) 30 degree hinge; (4) 45 degree hinge; (5) 60 degree hinge, hands reach toward knees/shins without hanging beyond feet. Pelvis remains on chair, no arm raise or backward lean.
```

### hip-flexion

Asset: `public/exercises/hip-flexion.webp`

```text
Use case: scientific-educational. Asset: physiotherapy exercise reference sprite sheet. Premium realistic medical editorial illustration with natural detailed anatomy, soft dimensional shading and fine pencil contours, NOT a stick figure. PURE WHITE background. Same adult woman in all panels: brown hair in a bun, dark forest-green short-sleeve athletic top and matching leggings, barefoot. Exactly FIVE equal-width vertical panels in ONE horizontal row, each 20% canvas width, no gutters or borders. NO TEXT, NUMBERS, ARROWS or symbols. Identical camera, scale, body proportions, floor baseline and person across all five panels. All relevant anatomy completely within its own panel with margins. Wide landscape sheet about 3:1. Reference image: use supplied image ONLY for consistent person, clothing, rendering style and pure-white backdrop. Create a NEW exercise: FULL BODY strict SIDE VIEW facing right, plain pale wood chair just in front used with fingertips for balance. Trunk remains upright. One supporting leg stays straight and planted; the other leg lifts forward with its KNEE BENT, foot naturally below knee. LEFT TO RIGHT: (1) both feet down working knee slightly bent; (2) low knee lift; (3) knee halfway to hip height; (4) thigh horizontal knee at hip height; (5) thigh slightly above horizontal knee above hip height. NO lunge, NO straight front-leg kick, no backward lean.
```

### hip-extension

Asset: `public/exercises/hip-extension.webp`

```text
Use case: scientific-educational. Premium realistic medical editorial illustration, natural detailed anatomy, soft dimensional shading, forest GREEN top and full leggings, barefoot woman brown hair bun matching reference. PURE WHITE. EXACTLY FIVE columns, each precisely one fifth of total width. ONE woman and pale wooden chair entirely inside EACH column, including all fingers, toes, chair legs. IDENTICAL SIZE and camera in all five. IMPORTANT: make each person SMALLER with large white margin above, below AND SIDES so extended limb and whole chair fit INSIDE each column. NO overlapping columns, NO clipping, NO TEXT, NO NUMBERS, NO ARROWS. Wide 3:1 sheet. Reference only sets the person/clothes/style. New exercise: Strict side view facing RIGHT. Stand upright next to stable pale wood chair in front as gentle fingertip support. Move ONE STRAIGHT leg backward from hip, keep other leg straight planted, torso perfectly upright. Five LEFT TO RIGHT: leg directly under hip; small backward reach; moderate backward reach; leg clearly behind hip; further comfortable backward reach. Working knee remains straight, no leaning trunk. Fit BOTH rearmost toes and foremost chair legs inside EACH column with empty white margin outside them.
```

### hip-rotation

Asset: `public/exercises/hip-rotation.webp`

```text
Use case: scientific-educational. Premium realistic medical editorial illustration matching reference woman forest-green athletic top and leggings, brown hair bun, barefoot, PURE WHITE background. EXACTLY FIVE equal-width columns in ONE horizontal row, each 20% width, no gutters or text, no arrows or numerical labels. Consistent camera, body proportions and scale. New exercise: seated hip rotation. FRONT VIEW, woman sits tall on pale wooden armless high chair, shown waist to toes to emphasize mechanics. BOTH THIGHS and BOTH KNEES must remain at EXACTLY SAME WIDTH and position through ALL FIVE PANELS, thighs parallel pointing forward horizontal, knees fixed below hips. Viewer-left lower leg stays vertical. ONLY viewer-RIGHT shin and foot sweep a SMALL distance to viewer right due to internal rotation at hip, with the knee a stationary pivot. From left to right: (1) right shin vertical; (2) foot a tiny distance right; (3) foot a little farther right; (4) modest diagonal shin; (5) slightly farther right but NOT wide, no thigh abduction, no knee drifting to side. Keep right upper leg firmly stationary. Same hands resting on chair edges, no pressing or pulling knee. Anatomically plausible knee and ankle, keep forefoot forward. All feet fit entirely INSIDE their OWN column with white side margins. Supplied image sets rendering style only; do not repeat its exercise.
```

### hamstring-hinge

Asset: `public/exercises/hamstring-hinge.webp`

```text
Use case: scientific-educational. Asset: physiotherapy exercise reference sprite sheet. Premium realistic medical editorial illustration with natural detailed anatomy, soft dimensional shading and fine pencil contours, NOT a stick figure. PURE WHITE background. Same adult woman in all panels: brown hair in a bun, dark forest-green short-sleeve athletic top and matching leggings, barefoot. Exactly FIVE equal-width vertical panels in ONE horizontal row, each 20% canvas width, no gutters or borders. NO TEXT, NUMBERS, ARROWS or symbols. Identical camera, scale, body proportions, floor baseline and person across all five panels. All anatomy completely within its own panel with generous margins. Wide landscape sheet about 3:1. Reference image: use supplied image ONLY for consistent person, clothing, rendering style and pure-white backdrop. Create a NEW exercise: FULL BODY strict SIDE VIEW facing right. Standing HIP HINGE with knees slightly bent, feet flat under hips. Keep long neutral spine and head aligned with trunk. Arms hang naturally down. LEFT TO RIGHT: (1) upright standing; (2) small forward hip hinge 20 degrees; (3) torso 40 degrees forward; (4) torso 60 degrees forward; (5) torso nearly horizontal 80 degrees forward, hips pushed BACK and knees softly bent. NO rounding back, no locked knees, no reaching arms forward. Every person fully fits their panel.
```

### hamstring-knee-extension

Asset: `public/exercises/hamstring-knee-extension.webp`

```text
Edit target image: the supplied five-stage seated knee-extension sprite. Preserve EXACTLY these five distinct working-leg joint positions: stage1 knee bent 90 degrees foot down; stage2 knee slightly straightened foot in air; stage3 knee halfway straightened foot in air; stage4 knee nearly straight foot in air; stage5 working leg STRAIGHT HORIZONTAL FORWARD with foot in air at hip height. This horizontal final leg is ESSENTIAL. Keep same woman, forest green clothes, illustration style, white background and upright torso. Change ONLY overall placement/scale: shrink every complete woman-and-chair scene slightly to add generous white space at either side; reposition the five scenes equally in exactly five equal-width columns, so EVERY chair, head and foot fits wholly within its own column and no neighboring figure is visible in that column. Exactly five scenes in one horizontal row. No text, arrows or labels. Do not lower feet to floor. Do not change straight final knee into bend.
```

### quad-knee-bend

Asset: `public/exercises/quad-knee-bend.webp`

```text
Use case: scientific-educational. Create a premium realistic medical editorial illustration sprite sheet: natural detailed anatomy, soft dimensional shading, fine pencil contours. Pure WHITE background. Same adult woman as reference: dark hair bun, forest GREEN short-sleeve athletic top and full leggings, barefoot. Exactly FIVE equal-width columns in ONE horizontal row, each 20% width, no gutters/borders. NO TEXT, NO NUMBERS, NO ARROWS, NO SYMBOLS anywhere. Identical camera/scale/person/baseline across all five. All anatomy stays inside its OWN column with margins. Wide about 3:1 ratio. Supplied reference controls ONLY person, clothing and style; NEW exercise follows. FULL BODY strict SIDE VIEW facing right with pale wood chair in front, fingertips touching chair back for balance. Stand on one straight planted leg. Working THIGH stays vertical beside other thigh, knee position unchanged. Only knee bends backward progressively moving heel behind. LEFT TO RIGHT: (1) working leg nearly straight; (2) heel slightly lifted backward, knee bent a little; (3) moderate knee bend; (4) working shin horizontal backward, knee bent 90 degrees; (5) working heel closer to buttock, knee bent 120 degrees. Do NOT hold foot, do NOT arch back, torso upright.
```

### ankle-dorsiflexion

Asset: `public/exercises/ankle-dorsiflexion.webp`

```text
Use case: scientific-educational. Create a premium realistic medical editorial illustration sprite sheet: natural detailed anatomy, soft dimensional shading, fine pencil contours. Pure WHITE background. Same adult woman as reference: dark hair bun, forest GREEN short-sleeve athletic top and full leggings, barefoot. Exactly FIVE equal-width columns in ONE horizontal row, each 20% width, no gutters/borders. NO TEXT, NO NUMBERS, NO ARROWS, NO SYMBOLS anywhere. Identical camera/scale/person/baseline across all five. All anatomy stays inside its OWN column with margins. Wide about 3:1 ratio. Supplied reference controls ONLY person, clothing and style; NEW exercise follows. FULL BODY strict SIDE VIEW woman faces right toward a faint pale wall within EACH column. One foot forward, heel FLAT on floor throughout, toes pointing right toward wall. Other foot behind for balance, hands gently on wall. Move FRONT KNEE gently forward over toes by ankle flexion. LEFT TO RIGHT: (1) front shin nearly vertical; (2) small front knee forward travel; (3) moderate forward knee travel; (4) knee closer to wall; (5) knee comfortably near wall, front heel STILL flat. Keep front foot position fixed, no heel lift, no kneeling, no deep squat.
```

### wrist-extension

Asset: `public/exercises/wrist-extension.webp`

```text
Use case: scientific-educational. Create a premium realistic medical editorial illustration sprite sheet: natural detailed anatomy, soft dimensional shading, fine pencil contours. Pure WHITE background. Same adult woman as reference: dark hair bun, forest GREEN short-sleeve athletic top and full leggings, barefoot. Exactly FIVE equal-width columns in ONE horizontal row, each 20% width, no gutters/borders. NO TEXT, NO NUMBERS, NO ARROWS, NO SYMBOLS anywhere. Identical camera/scale/person/baseline across all five. Anatomy inside OWN column with margins. Wide 3:1 ratio. Supplied reference controls ONLY person, clothing and style; NEW exercise follows. CLOSEUP of one RIGHT FOREARM and hand in strict side view, forearm horizontal from LEFT to RIGHT resting PALM DOWN on a pale wood table, whole hand extending past RIGHT table edge unsupported. Only wrist moves, forearm stays fixed horizontal. Fingers relaxed almost straight, thumb visible naturally, exactly five anatomically correct digits. LEFT TO RIGHT columns: (1) wrist neutral hand level continuation of forearm; (2) hand tilts gently UP 15 degrees at wrist; (3) hand tilts UP 30 degrees; (4) hand UP 45 degrees; (5) hand UP 60 degrees. Back of hand rises toward ceiling, wrist extension. Camera shows side of thumb and natural finger stacking. No other hand, no torso needed.
```

### wrist-flexion

Asset: `public/exercises/wrist-flexion.webp`

```text
Use case: scientific-educational. Create a premium realistic medical editorial illustration sprite sheet: natural detailed anatomy, soft dimensional shading, fine pencil contours. Pure WHITE background. Same adult woman as reference: dark hair bun, forest GREEN short-sleeve athletic top and full leggings, barefoot. Exactly FIVE equal-width columns in ONE horizontal row, each 20% width, no gutters/borders. NO TEXT, NO NUMBERS, NO ARROWS, NO SYMBOLS anywhere. Identical camera/scale/person/baseline across all five. Anatomy inside OWN column with margins. Wide 3:1 ratio. Supplied reference controls ONLY person, clothing and style; NEW exercise follows. CLOSEUP of one RIGHT FOREARM and hand in strict side view, forearm horizontal from LEFT to RIGHT resting PALM DOWN on pale wood table, whole hand extending past RIGHT table edge unsupported. Only wrist moves, forearm stays fixed horizontal. Fingers relaxed, thumb visible naturally, exactly five anatomically correct digits. LEFT TO RIGHT columns: (1) wrist neutral hand level continuation of forearm; (2) hand tilts gently DOWN 15 degrees at wrist; (3) hand tilts DOWN 30 degrees; (4) hand DOWN 45 degrees; (5) hand DOWN 60 degrees. Palm lowers toward floor, wrist flexion. No other hand, no torso needed.
```



## Sports stretching catalog

The original 18 basic-mobility sprites are retained. The sports mode adds these 14 new sprites and reuses `shoulder-flexion`, `quad-knee-bend`, `ankle-dorsiflexion` and `wrist-extension`. Both modes therefore use 32 local sprite files in total, 160 distinct frames. Sports instructions and five observation landmarks live in `src/lib/sports-exercises.ts`.

The new illustrations use the same approved person and rendering style, with a subtle sage exercise mat for floor stretches. Each source is split into five scenes and fitted proportionally into the same 480px square frames. Shared empty vertical margins are cropped before resizing, so long floor poses remain readable. Standing calf-stretch, half-split, hip-flexor lunge and frog stretch use individually inspected source crop bounds to preserve complete feet and wider stances without adjacent-scene fragments. Cropping and WebP encoding are the only non-generative image operations.

Each accepted sheet was inspected for straight knees where required, direction of motion, visible progression, complete limbs and no neighboring-scene bleed after cropping. Standing forward-fold stage 4 was edited to show fingertips touching the floor and stage 5 palms flat. Hip-flexor lunge stages 1–2 were edited to show the knee behind/over the ankle. Behind-back hand gaps and kneeling lat chest depth were refined. The figures illustrate approximate ranges; written landmarks, rather than pixel measurements of artwork, define the self-observation levels.

### Accepted sports generation/edit prompts

The following are the final built-in `image_gen` prompts. Prompts beginning with "Edit" refine an already generated sheet with the same exercise and style.

#### standing-forward-fold

Asset: `public/exercises/standing-forward-fold.webp`

```text
Edit supplied five-stage standing forward fold. Preserve same woman, style, white background, five scenes, all legs straight, floor line, scale and all body positions. Make ONLY ONE targeted correction: in the FOURTH scene from left, lift the HEELS OF BOTH HANDS off the mat so ONLY THE FINGERTIPS TOUCH THE FLOOR, fingers point downward with a slight bend, palms NOT flat. Keep fifth scene palms entirely FLAT on mat. Keep first3 scenes exactly unchanged. This difference between 4=fingertips and 5=palms must be visually clear. No text or labels.
```

#### seated-pike

Asset: `public/exercises/seated-pike.webp`

```text
Use case: scientific-educational. Premium realistic sports stretching editorial illustration matching supplied reference woman: brown hair bun, forest GREEN short-sleeve top and full leggings, barefoot; detailed natural anatomy, soft dimensional shading and fine contours. PURE WHITE background, very subtle sage exercise mat when on floor. Exactly FIVE scenes in ONE horizontal row. Each scene inside its own equal-width 20% column with generous empty margins: all head/hands/feet inside own column, no cropped or overlapping neighbors. Keep identical person scale and camera in all5. NO TEXT, NO NUMBERS, NO ARROWS or diagrams. Wide landscape about 3:1. This is a NEW SPORTS STRETCH; supplied image only sets person and rendering style. Strict SIDE VIEW facing RIGHT, FULL BODY sports SEATED PIKE on subtle sage mat. Both legs together STRAIGHT forward along floor in every scene, knees never bend, heels grounded, TOES POINT UP. Torso hinges forward over legs and both hands reach forward along legs. Five distinct progressively deeper LEFT TO RIGHT: (1) hands reach KNEES, torso leaning a little; (2) hands reach MIDDLE SHINS; (3) hands reach ANKLES; (4) fingertips reach TOES with torso closer thighs; (5) hands reach JUST BEYOND TOES, torso nearly against thighs, head naturally down. Small enough person that the whole long straight legs AND reaching arms fit inside EACH column, keep all5 same scale. No standing, chair, split or bent knees.
```

#### supine-straight-leg-raise

Asset: `public/exercises/supine-straight-leg-raise.webp`

```text
Use case: scientific-educational. Premium realistic SPORTS STRETCHING editorial illustration matching supplied woman: brown hair bun, forest GREEN top and full leggings, barefoot; natural anatomy, dimensional shading, fine contours. Pure WHITE background, subtle sage exercise mat. Exactly FIVE independent scenes in ONE horizontal row, each 20% width with white side margins, every full limb fits INSIDE its OWN column, no neighbors intruding. Same scale, perspective, body proportions and matline across all5. NO TEXT, NUMBERS, ARROWS or labels. Wide 3:1 canvas. Reference only controls consistent person/style. New sports exercise: Strict SIDE VIEW. Woman lies on BACK, head on LEFT feet on RIGHT, arms rest on mat by sides. One leg stays STRAIGHT FLAT on floor in all panels. Other leg raises while keeping KNEE STRAIGHT, no hands pulling or straps, pelvis still on floor. Five distinct LEFT TO RIGHT: raised straight leg 30 degrees above floor; 45 degrees; 60 degrees; 75 degrees; 90 degrees vertically over hip. Both legs remain same natural length. Show whole woman head to every toe, including vertical raised toes with margin above.
```

#### half-split

Asset: `public/exercises/half-split.webp`

```text
Use case: scientific-educational. Premium realistic SPORTS STRETCHING editorial illustration matching supplied woman: brown hair bun, forest GREEN top and full leggings, barefoot; natural anatomy, dimensional shading, fine contours. Pure WHITE background, subtle sage exercise mat. Exactly FIVE independent scenes in ONE horizontal row, each 20% width with white side margins, every full limb fits INSIDE its OWN column, no neighbors intruding. Same scale, perspective, body proportions and matline across all5. NO TEXT, NUMBERS, ARROWS or labels. Wide 3:1 canvas. Reference only controls consistent person/style. New sports exercise: Strict SIDE VIEW facing RIGHT, full body on mat. HALF SPLIT: rear knee on mat directly below rear hip, rear shin points back, FRONT leg is STRAIGHT with heel on floor forward and TOES UP. Keep this leg stance unchanged. Torso hinges forward toward straight front leg, both hands reaching along leg without pulling. LEFT TO RIGHT five progressively deeper: (1) hands near front KNEE, torso only mildly inclined; (2) hands at MIDDLE SHIN; (3) hands at ANKLE; (4) fingertips at TOES; (5) hands JUST BEYOND TOES, chest closer to front thigh. Front knee NEVER bends. Rear knee stays on floor, not standing and not full front split. Both legs and all hands fully visible inside each column.
```

#### straddle-pancake

Asset: `public/exercises/straddle-pancake.webp`

```text
Use case: scientific-educational. Premium realistic SPORTS STRETCHING editorial illustration matching supplied woman: brown hair bun, forest GREEN top and full leggings, barefoot; natural anatomy, dimensional shading, fine contours. Pure WHITE background, subtle sage exercise mat. Exactly FIVE independent scenes in ONE horizontal row, each 20% width with white side margins, every full limb fits INSIDE its OWN column, no neighbors intruding. Same scale, perspective, body proportions and matline across all5. NO TEXT, NUMBERS, ARROWS or labels. Wide 3:1 canvas. Reference only controls consistent person/style. New sports exercise: FRONT THREE-QUARTER VIEW slightly elevated to make distance on floor readable. Woman SITS on mat with both legs STRAIGHT comfortably spread to sides in wide V, KNEECAPS and TOES UP, heels on floor, leg spacing IDENTICAL in ALL5. Torso hinges forward BETWEEN legs, hands walk ahead along floor. Five LEFT TO RIGHT: (1) fingertips just in front of pelvis torso nearly upright; (2) palms in front of pelvis modest forward lean; (3) hands halfway toward imaginary straight line between heels with clear forward lean; (4) fingertips reach heel-line, torso low; (5) wrists reach heel-line, chest closer floor. No actual drawn heel-line. Keep knees straight, not butterfly/crosslegged and no changing leg width. Whole wide V fits entirely inside each column.
```

#### butterfly

Asset: `public/exercises/butterfly.webp`

```text
Use case: scientific-educational. Premium realistic SPORTS STRETCHING editorial illustration matching supplied woman: brown hair bun, forest GREEN top and full leggings, barefoot; natural anatomy, dimensional shading, fine contours. Pure WHITE background, subtle sage exercise mat. Exactly FIVE independent scenes in ONE horizontal row, each 20% width with white side margins, every full limb fits INSIDE its OWN column, no neighbors intruding. Same scale, perspective, body proportions and matline across all5. NO TEXT, NUMBERS, ARROWS or labels. Wide 3:1 canvas. Reference only controls consistent person/style. New sports exercise: FRONT VIEW full body seated on mat in BUTTERFLY: both SOLES TOUCH EACH OTHER, heels stay in SAME comfortable fixed location in front of pelvis, knees open sideways. Woman torso tall and steady, hands lightly around ankles, NEVER pressing knees. Five LEFT TO RIGHT show knees progressively LOWER: (1) knees clearly ABOVE hip level; (2) knees approximately LEVEL with hips; (3) knees BELOW hips but clearly above floor; (4) knees very CLOSE to floor; (5) both knees comfortably TOUCH floor, soles still together. No crossed ankles, no straddle straight legs, do not move heels between scenes. All anatomy natural.
```

#### hip-flexor-lunge

Asset: `public/exercises/hip-flexor-lunge.webp`

```text
Edit supplied five-stage kneeling hip-flexor lunge. Keep same five scenes, same person/style, mat, rear knee on floor, neutral upright torso, hands on hips, front heel grounded. Correct ONLY first TWO scenes: scene1 front KNEE must be clearly BEHIND its ANKLE, so front shin slopes down-forward from knee to ankle and thigh reaches slightly downward-forward. Scene2 front KNEE must be directly ABOVE its ANKLE with front shin VERTICAL. Scene3 front knee slightly AHEAD of ankle, scene4 knee halfway between ankle and toes, scene5 knee above toes: keep3–5 positions as they are. The visual progression behind/above/ahead of ankle must be unambiguous. Preserve five equal columns, no text, no arrows, all limbs inside own scene.
```

#### frog-stretch

Asset: `public/exercises/frog-stretch.webp`

```text
Use case: scientific-educational. Premium realistic SPORTS STRETCHING editorial illustration matching supplied woman: brown hair bun, forest GREEN top and full leggings, barefoot; natural anatomy, dimensional shading, fine contours. Pure WHITE background, subtle sage exercise mat. Exactly FIVE independent scenes in ONE horizontal row, each 20% width with white side margins, every full limb fits INSIDE its OWN column, no neighbors intruding. Same scale, perspective, body proportions and matline across all5. NO TEXT, NUMBERS, ARROWS or labels. Wide 3:1 canvas. Reference only controls consistent person/style. New sports exercise: Slightly elevated FRONT THREE-QUARTER VIEW on mat to show both knees and shins. Supported FROG stretch: woman supports chest on both forearms, palms down forward, knees bent around right angles, both shins point BACKWARD and feet turn outward naturally, hips positioned above knee line fore-aft. Five LEFT TO RIGHT show gradual KNEE SPACING only: (1) knees about HIP WIDTH; (2) slightly wider than hips; (3) knees at SHOULDER WIDTH; (4) wider than shoulders; (5) knees about ONE AND A HALF SHOULDER WIDTHS apart. Same forearm placement and comfortable torso height. Both knees on mat ALL scenes, no full splits, no butterfly or sitting back on heels, no extreme spinal arch.
```

#### figure-four

Asset: `public/exercises/figure-four.webp`

```text
Use case: scientific-educational. Premium realistic SPORTS STRETCHING editorial illustration of reference woman, brown hair bun, forest GREEN top/full leggings, barefoot. Natural anatomy and dimensional shading. Pure WHITE background, subtle sage mat for floor pose. Exactly FIVE independent scenes in ONE horizontal row, each 20% width with white side margins, all limbs inside OWN scene, no neighbor bleed. Same scale and camera all5. NO TEXT, NUMBERS, ARROWS or labels. Wide 3:1. Reference only controls person/style. New exercise: Slightly elevated SIDE THREE-QUARTER VIEW so crossed legs visible. Woman lies on BACK head at LEFT. One ankle rests across OPPOSITE THIGH just above its knee, making a clear FIGURE FOUR: crossed knee opens outward, foot flexed. Keep crossed ankle-on-thigh position ALL5, pelvis down. Five LEFT TO RIGHT: (1) supporting foot planted on floor, supporting knee bent, crossed ankle above knee; (2) supporting foot just lifts off floor, arms still relaxed; (3) both hands hold BEHIND supporting thigh, supporting shin relaxed; (4) supporting thigh gently approaches chest; (5) supporting thigh comfortably closer chest with crossed ankle still on thigh. Hands never press crossed knee. Exactly two natural legs, two feet, two hands. Do not hug both knees together or cross knees instead of ankle-on-thigh.
```

#### standing-calf-stretch

Asset: `public/exercises/standing-calf-stretch.webp`

```text
Use case: scientific-educational. Premium realistic SPORTS STRETCHING editorial illustration of reference woman, brown hair bun, forest GREEN top/full leggings, barefoot. Natural anatomy and dimensional shading. Pure WHITE background, subtle sage mat for floor pose. Exactly FIVE independent scenes in ONE horizontal row, each 20% width with white side margins, all limbs inside OWN scene, no neighbor bleed. Same scale and camera all5. NO TEXT, NUMBERS, ARROWS or labels. Wide 3:1. Reference only controls person/style. New exercise: FULL BODY strict SIDE VIEW facing RIGHT toward a plain pale wall. Hands at shoulder height on wall and FRONT foot fixed flat. Rear leg STRAIGHT, rear HEEL firmly DOWN, both feet point forward. Progressively move rear foot BACK in fiveLEFT TO RIGHT: (1) rear toes at front heel, short split stance; (2) rear toes one foot length behind front heel; (3) rear toes two foot lengths behind; (4) rear toes three foot lengths behind; (5) rear toes four foot lengths behind. Front knee bends gradually, body leans forward as a long line WITHOUT back arch. Both heels remain on floor, especially rear heel. Fixed front foot and hands. Entire wall/feet scene fits own column; person small enough for widest final stance.
```

#### behind-back-reach

Asset: `public/exercises/behind-back-reach.webp`

```text
Edit supplied five-stage behind-back shoulder reach. Preserve same woman/clothes/style, back view, five equal columns, last TWO stages with touching then overlapping fingers unchanged. Correct FIRST THREE stages so gaps are visually faithful: stage1 TOP fingertips near BASE OF NECK, BOTTOM fingertips at WAIST, leaving MORE THAN TWO full hand lengths of empty shirt BETWEEN fingertips; stage2 TOP fingertips at UPPER shoulder blades, BOTTOM fingertips at LOW BACK, leaving TWO hand lengths of empty shirt between; stage3 TOP fingertips upper-middle back and BOTTOM fingertips lower-middle back leaving ONE full hand length of clear empty shirt between. Upper elbow still points up and lower elbow down/out. Keep hands anatomically normal with palms toward body. This must be a clear progression large gap ->two hands ->one hand ->touch ->overlap. NO text/arrows. Keep head upright and all joints natural.
```

#### overhead-triceps

Asset: `public/exercises/overhead-triceps.webp`

```text
Use case: scientific-educational. Premium realistic SPORTS STRETCHING editorial illustration of reference woman, brown hair bun, forest GREEN short-sleeve top and full leggings. Natural anatomy and dimensional shading. Pure WHITE background. Exactly FIVE independent scenes in ONE horizontal row, each 20% width with white side margins, all fingers and elbows fully inside OWN scene, no neighbor bleed. Same person scale and camera all5. NO TEXT, NUMBERS, ARROWS, angle lines or labels. Wide 3:1. Supplied reference only controls person/style. New exercise: BACK VIEW from head to hips. ONE upper arm held vertically overhead, elbow pointing UP, elbow bends to let hand reach down back, palm facing body; OTHER arm rests DOWN at side and never presses elbow. Five LEFT TO RIGHT distinct hand landmarks: (1) palm at BACK OF HEAD; (2) fingertips at BASE OF NECK; (3) fingertips at TOP OF SHOULDER BLADES; (4) fingertips BETWEEN SHOULDER BLADES; (5) whole PALM between shoulder blades. Keep upper arm raised in all5, back upright, ribs relaxed, no backward arch. Hair bun high enough that reaching hand stays visible. Exactly two arms and normal elbow anatomy.
```

#### doorway-chest

Asset: `public/exercises/doorway-chest.webp`

```text
Use case: scientific-educational. Premium realistic SPORTS STRETCHING editorial illustration of reference woman, brown hair bun, forest GREEN short-sleeve top and full leggings. Natural anatomy and dimensional shading. Pure WHITE background. Exactly FIVE independent scenes in ONE horizontal row, each 20% width with white side margins, all fingers and elbows fully inside OWN scene, no neighbor bleed. Same person scale and camera all5. NO TEXT, NUMBERS, ARROWS, angle lines or labels. Wide 3:1. Supplied reference only controls person/style. New exercise: FULL BODY fixed FRONT THREE-QUARTER camera. Woman stands beside plain pale doorway, one forearm flat against vertical frame, elbow bent 90 degrees at SHOULDER HEIGHT with fingers up, other arm relaxed down. Forearm and elbow remain FIXED against frame in every scene while chest turns AWAY from that arm. Five LEFT TO RIGHT: (1) chest faces the forearm; (2) chest turns a little past forearm; (3) chest turns about30 degrees away; (4) chest turns45 degrees away; (5) chest turns60 degrees away comfortably. Torso rotates upright around spine, no back arch, shoulder not shrugged. Same doorway direction/location all5, no split pose or hands on chest.
```

#### kneeling-lat-reach

Asset: `public/exercises/kneeling-lat-reach.webp`

```text
Edit supplied five-stage kneeling lat reach on bench. Preserve same woman/style, five scenes, same bench height, hands fixed on bench and ELBOWS STRAIGHT, knees on mat, hips high over knees. Keep scene1 unchanged. Make progressive chest lowering more visible: scene2 arms approximately horizontal, torso inclined; scene3 head is visibly BELOW upper arms, chest has lowered; scene4 chest at BENCH TOP HEIGHT and forehead BELOW arms; scene5 chest slightly BELOW bench top, forehead below arms, back comfortable without lumbar arch. Keep all5 SAME camera and body scale, own-column margins; no text or arrows. Hands never leave bench. Do NOT bend elbows or sit buttocks on heels.
```

