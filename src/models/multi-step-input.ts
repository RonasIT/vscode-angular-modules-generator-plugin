import { InputFlowAction } from './input-flow-action';
import { window, QuickInput, Disposable, QuickInputButtons } from 'vscode';
import { InputBoxParameters } from '../interfaces/input-box-parameters';

type InputStep = (input: MultiStepInput) => Thenable<InputStep | void>;

export class MultiStepInput {
  private current?: QuickInput;
  private steps: InputStep[] = [];

  get currentStep(): number {
    return this.steps.length;
  }

  static async run<T>(start: InputStep): Promise<void> {
    const input = new MultiStepInput();

    return input.stepThrough(start);
  }

  private async stepThrough<T>(start: InputStep): Promise<void> {
    let step: InputStep | void = start;

    while (step) {
      this.steps.push(step);

      if (this.current) {
        this.current.enabled = false;
        this.current.busy = true;
      }

      try {
        step = await step(this);
      } catch (err) {
        if (err === InputFlowAction.back) {
          this.steps.pop();
          step = this.steps.pop();
        } else if (err === InputFlowAction.resume) {
          step = this.steps.pop();
        } else if (err === InputFlowAction.cancel) {
          step = undefined;
        } else {
          throw err;
        }
      }
    }

    if (this.current) {
      this.current.dispose();
    }
  }

  async showInputBox<P extends InputBoxParameters>({ title, partName, step, totalSteps, value, prompt, validate, shouldResume }: P) {
    const disposables: Disposable[] = [];

    try {
      return await new Promise<string | (P extends { buttons: (infer I)[] } ? I : never)>((resolve, reject) => {
        const input = window.createInputBox();
        input.title = title;
        input.step = step;
        input.totalSteps = totalSteps;
        input.value = value || '';
        input.prompt = prompt;
        input.buttons = [
          ...(this.steps.length > 1 ? [QuickInputButtons.Back] : [])
        ];
        let initialValue = validate('', partName);

        disposables.push(
          input.onDidTriggerButton(item => {
            if (item === QuickInputButtons.Back) {
              reject(InputFlowAction.back);
            } else {
              resolve(<any>item);
            }
          }),
          input.onDidAccept(async () => {
            const value = input.value;
            input.enabled = false;
            input.busy = true;

            if (!(await validate(value, partName))) {
              resolve(value);
            }

            input.enabled = true;
            input.busy = false;
          }),
          input.onDidChangeValue(async text => {
            const currentValue = validate(text, partName);
            initialValue = currentValue;
            const validationMessage = await currentValue;

            if (currentValue === initialValue) {
              input.validationMessage = validationMessage;
            }
          }),
          input.onDidHide(() => {
            (async () => {
              reject(shouldResume && await shouldResume() ? InputFlowAction.resume : InputFlowAction.cancel);
            })()
              .catch(reject);
          })
        );

        if (this.current) {
          this.current.dispose();
        }

        this.current = input;
        this.current.show();
      });
    } finally {
      disposables.forEach(d => d.dispose());
    }
  }
}
