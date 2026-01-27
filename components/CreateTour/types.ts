export type WizardStep = "info" | "spots" | "summary";

export const STEPS: { key: WizardStep; label: string }[] = [
  { key: "info", label: "Info" },
  { key: "spots", label: "Spots" },
  { key: "summary", label: "Review" },
];
