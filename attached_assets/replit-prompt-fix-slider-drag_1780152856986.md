# Replit Agent Prompt — Fix "See The Gap" Slider Drag Behavior (Critical)

## Problem
The sliders in the Value Gap Calculator on the Resources page (`/tools`) cannot be dragged smoothly. When you click and hold on a slider thumb, it moves one tick in either direction but then stops — you cannot drag it continuously. Users have to click at different positions along the track to move the value, which is a broken experience.

The homepage "Transformation" slider works perfectly by comparison.

## Root Cause
The `SliderBlock` component is defined **inside** the `ValueGapCalc` component function. This means React creates a new component reference on every render. When `onChange` fires and updates state, `ValueGapCalc` re-renders, `SliderBlock` gets a new reference, React **unmounts and remounts** the `<input>` element, and the browser's native drag gesture is killed. The user's mouse/finger is no longer connected to the slider thumb.

Additionally, the `useAnimNum` hook is likely running `requestAnimationFrame` loops that trigger additional re-renders during interaction, compounding the issue.

## Fix

### Step 1: Move SliderBlock outside the component
Move the `SliderBlock` component definition **outside** of `ValueGapCalc` so it has a stable reference across renders:

```jsx
// MOVE THIS OUTSIDE ValueGapCalc — it must be defined at module scope
const SliderBlock = ({label, value, display, color, min, max, step, onChange}) => (
  <div>
    <div style={{fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8B95A5", marginBottom: 4}}>{label}</div>
    <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color, marginBottom: 6}}>{display}</div>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={e => onChange(Number(e.target.value))}
      style={{
        width: "100%",
        cursor: "pointer",
        WebkitAppearance: "none",
        appearance: "none",
        height: 6,
        borderRadius: 3,
        outline: "none",
        background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.12) ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.12) 100%)`,
        touchAction: "none",
      }}
    />
  </div>
);

// ValueGapCalc stays as-is, but NO LONGER defines SliderBlock inside itself
const ValueGapCalc = () => {
  // ... existing code, just remove the SliderBlock definition from here
};
```

### Step 2: Add touch-action CSS
Add `touchAction: "none"` to each slider input (shown above in the inline style). This prevents the browser from intercepting touch/pointer events for scrolling when the user is trying to drag a slider.

### Step 3: Add custom thumb CSS
Add a `<style>` block (if one doesn't already exist for the Value Gap Calculator) with custom slider thumb styling. This replaces the browser's default thumb which can have inconsistent hit areas:

```jsx
<style>{`
  input[type="range"].vg-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid white;
    cursor: pointer;
    box-shadow: 0 0 8px rgba(255,255,255,0.4);
    background: var(--thumb-color, #C8A24E);
    margin-top: -6px;
  }
  input[type="range"].vg-slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid white;
    cursor: pointer;
    box-shadow: 0 0 8px rgba(255,255,255,0.4);
    background: var(--thumb-color, #C8A24E);
  }
  input[type="range"].vg-slider::-webkit-slider-runnable-track {
    height: 6px;
    border-radius: 3px;
  }
  input[type="range"].vg-slider::-moz-range-track {
    height: 6px;
    border-radius: 3px;
    background: transparent;
  }
`}</style>
```

Then add `className="vg-slider"` and `style={{"--thumb-color": color}}` to each slider input so the thumb matches the slider's accent color.

### Step 4: Use onInput instead of onChange for smoother updates
Replace `onChange` with `onInput` on the range inputs. `onInput` fires continuously as the slider moves (in all browsers), while `onChange` on range inputs can behave inconsistently:

```jsx
<input type="range" min={min} max={max} step={step} value={value}
  onInput={e => onChange(Number(e.target.value))}
  ...
/>
```

## Critical Instructions
- The **most important fix** is Step 1 — moving `SliderBlock` outside `ValueGapCalc`. Without this, the drag will remain broken regardless of other changes.
- Do NOT change any calculation logic, value ranges, steps, auto-animation cycling, display formatting, or layout.
- Do NOT change the homepage Transformation slider — it already works correctly.
- Test by dragging each of the 5 sliders smoothly from one end to the other. They should move continuously with the cursor/finger, not require clicking at different positions.
