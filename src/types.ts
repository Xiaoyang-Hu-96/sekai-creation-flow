export type Effort = "deep" | "quick";
export type Beat = "create" | "plan" | "build" | "canvas" | "ship";
export type SheetName = "attach" | "powers" | "chat" | "tune" | "assets" | null;
export type BuildStage = { label: string; caption: string };
export const powers = {
  sfx: ["volume", "Arcade SFX", "Boops, dings and fail-trombones on every tap"],
  timer: ["timer", "Timer rounds", "Countdown rounds with a results screen"],
  board: ["trophy", "Leaderboard", "Global high scores, updated live"],
  friends: ["users", "Play with friends", "Same game, two phones, shared chaos"],
  music: ["music", "Music", "A looping track that matches the vibe"],
} as const;
export type PowerId = keyof typeof powers;
