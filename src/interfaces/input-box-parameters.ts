export interface InputBoxParameters {
  title: string;
  partName: string;
  step: number;
  totalSteps: number;
  value: string;
  prompt: string;
  validate: (value: string, partName: string) => Promise<string | undefined>;
  shouldResume: () => Thenable<boolean>;
}