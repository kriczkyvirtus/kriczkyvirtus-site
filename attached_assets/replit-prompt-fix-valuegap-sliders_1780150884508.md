# Replit Agent Prompt — Fix "See The Gap" Slider UX on Resources Page

## Problem
The sliders in the "See The Gap" Value Gap Calculator on the Resources page (`/tools`) feel janky and unpolished compared to the smooth slider in "The Transformation" section on the homepage. Users have difficulty dragging them smoothly.

## Root Cause
The two slider implementations are built differently:

**Homepage Transformation slider (smooth, works well):**
- Uses `-webkit-appearance: none` / `appearance: none` to fully reset browser defaults
- Has custom CSS for the track (gradient background, border-radius, height)
- Has custom CSS for the thumb via `.transform-slider::-webkit-slider-thumb` and `::-moz-range-thumb` (circular, white border, glow shadow)
- Single slider, simple `onChange` handler

**Resources ValueGapCalc sliders (janky):**
- Uses browser default slider appearance with only `accentColor` set
- No `-webkit-appearance: none`, no custom track or thumb styling
- The `value` prop switches between animated values and direct values via a ternary (`value={touched ? rev : Math.round(aRev)}`) — this can cause a jarring value jump the instant the user grabs a slider that was mid-animation
- 5 sliders all sharing the same pattern

## Fix

### Step 1: Add custom slider CSS
Add a CSS class (e.g. `valuegap-slider`) with the same styling approach as the homepage's `.transform-slider`. Add these styles to the component's `<style>` block or inline CSS:

```css
input[type="range"].valuegap-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  outline: none;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.12);
}

input[type="range"].valuegap-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid white;
  cursor: pointer;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
}

input[type="range"].valuegap-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid white;
  cursor: pointer;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
}
```

The thumb background color for each slider should match the slider's `color` prop (e.g. `#E8ECF1` for Revenue, `#FBBF24` for Your EBITDA Margin, `#34D399` for Best-In-Class, `#F87171` for Current Multiple, `#34D399` for Potential Multiple).

You can accomplish this by either:
- Adding the `className="valuegap-slider"` and setting thumb background via inline style or dynamic CSS, OR
- Using a filled track effect via a `background: linear-gradient(...)` on the track that shows the fill amount

### Step 2: Update the SliderBlock component
In the `SliderBlock` component inside `ValueGapCalc`, update the `<input>` element:

```jsx
<input type="range" min={min} max={max} step={step} value={value}
  onChange={e => onChange(Number(e.target.value))}
  className="valuegap-slider"
  style={{
    width: "100%",
    cursor: "pointer",
    background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.12) ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.12) 100%)`,
  }}
/>
```

This gives a filled track effect (colored up to the current value, gray after) similar to the homepage slider.

### Step 3: Smooth the animated-to-manual transition
The current code switches the `value` prop between animated and direct values:
```jsx
value={touched ? rev : Math.round(aRev)}
```

When the auto-animation is running and the user grabs a slider, the value can jump from the animated position to the stored position. To fix this, when `touched` becomes `true`, snap the actual state values to match the current animated values before accepting user input. In the `onChange` handler, this should already happen naturally since `setTouched(true)` is called alongside the value update. But if there's still a jump, add a transition on the slider thumb position or ensure the animated value is snapped to the real value immediately when touched becomes true.

### Step 4: Add the CSS to the page
If the Resources page has a `<style>` JSX block, add the slider CSS rules there. If not, add one:

```jsx
<style>{`
  input[type="range"].valuegap-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; border-radius: 3px; outline: none; cursor: pointer; }
  input[type="range"].valuegap-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; border: 2px solid white; cursor: pointer; box-shadow: 0 0 8px rgba(255,255,255,0.4); }
  input[type="range"].valuegap-slider::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; border: 2px solid white; cursor: pointer; box-shadow: 0 0 8px rgba(255,255,255,0.4); }
`}</style>
```

## Critical Instructions
- Do NOT change any of the slider logic, calculations, values, ranges, steps, or auto-animation behavior.
- Do NOT change the layout, spacing, labels, or display values.
- Only change the visual styling of the slider inputs and ensure the transition from auto-animation to user control is smooth.
- The goal is to make the "See The Gap" sliders feel as smooth and polished as the homepage Transformation slider.
