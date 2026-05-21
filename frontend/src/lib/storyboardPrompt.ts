// Locked prompt template for Storyboard nodes. The node IS an image
// node — it just wraps the user's topic in a deterministic preamble
// so Flow renders a single composite grid that visually narrates the
// topic. Tweak wording here, never inline at the dispatch site.
import type { StoryboardGrid } from "../store/board";

export function buildStoryboardPrompt(
  topic: string,
  grid: StoryboardGrid = "3x3",
): string {
  const n = grid === "2x2" ? 2 : 3;
  const total = n * n;
  const t = topic.trim() || "untitled story";
  // Verbose template — earlier short version produced overlapping borders
  // (no clear panel separators) and no per-frame captions, so the result
  // read like a montage instead of a comic-book storyboard. This version
  // pins the layout, numbering, and caption rules so each panel is
  // self-explanatory at a glance.
  return [
    `Create a visual storyboard for "${t}" as a SINGLE IMAGE`,
    `arranged in a ${n}x${n} comic-book grid (${n} rows, ${n} columns, ${total} panels total).`,
    `Each panel illustrates one beat of the story.`,
    `Panels read left-to-right, top-to-bottom in narrative order (1 → ${total}).`,
    `STRICT layout rules:`,
    `  • Clean WHITE GUTTERS between every panel — no overlapping borders, no bleed between scenes.`,
    `  • Each panel is rectangular, identical size, sharply separated from its neighbors.`,
    `  • In the TOP-LEFT corner of every panel, place a small filled CIRCLE with the panel NUMBER (1, 2, 3, …, ${total}) inside it — readable and consistent across all panels.`,
    `  • BENEATH each panel (outside the picture area, in the white gutter), print a SHORT one-sentence CAPTION describing the action of that beat. Use clean, legible sans-serif text. Captions in the same language as the topic.`,
    `Style: cohesive — every panel shares the same art style, color palette, and character design so the whole sheet reads as one storyboard.`,
  ].join(" ");
}

// Locked motion prompt for video nodes whose upstream image is a
// Storyboard composite. Forces Flow to animate the panels in order
// (1 → N) rather than re-interpret the composite as one scene.
//   3x3 grid → 9 panels → "frame 1 to frame 9"
//   2x2 grid → 4 panels → "frame 1 to frame 4"
// Other refs (character / location / visual_asset) still flow into
// the video request alongside the storyboard source — the prompt
// itself is what's locked.
export function buildStoryboardVideoPrompt(
  grid: StoryboardGrid = "3x3",
): string {
  const lastFrame = grid === "2x2" ? 4 : 9;
  return `A 10-seconds cinematic animated film trailer following narrative progression from exactly frame 1 to frame ${lastFrame} of the image reference`;
}
