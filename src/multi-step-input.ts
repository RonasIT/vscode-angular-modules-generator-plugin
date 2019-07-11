import { window, ExtensionContext } from 'vscode';
import { CommandParams } from './interfaces/command-params';
import { MultiStepInput } from './models/multi-step-input';

export async function multiStepInput(context: ExtensionContext, commandParams: CommandParams) {

  async function collectInputs() {
    const state = {
      step: 1,
      totalSteps: commandParams.params.length,
      values: []
    } as InputState;

    await MultiStepInput.run((input) => inputName(input, state));

    return state;
  }

  async function inputName(input: MultiStepInput, state: InputState) {
    const name = commandParams.params[input.currentStep - 1]
      .replace(/./, w => w.toUpperCase());
    const currentValue = state.values[input.currentStep - 1] || '';

    const value = await input.showInputBox({
      title: `Generate ${commandParams.title}`,
      partName: name,
      step: input.currentStep,
      totalSteps: state.totalSteps,
      value: currentValue,
      prompt: `Enter a name for the ${name}`,
      validate: validateIsEmpty,
      shouldResume: shouldResume
    });

    if (state.values[input.currentStep - 1]) {
      state.values[input.currentStep - 1] = value;
    } else {
      state.values.push(value);
    }

    if (input.currentStep < state.totalSteps) {
      return (input: MultiStepInput) => inputName(input, state);
    }
  }

  function shouldResume() {
    // Could show a notification with the option to resume.
    return new Promise<boolean>((resolve, reject) => {

    });
  }

  async function validateIsEmpty(value: string, partName: string) {
    if (value === '') {
      return `${partName} name is empty`;
    }

    if (!/^\w+(-\w+)*$/.test(value)) {
      return `${partName} name is incorrect`;
    }

    return undefined;
  }

  const state = await collectInputs();

  //window.showInformationMessage(`Creating ${commandParams.title}`);
  
}
