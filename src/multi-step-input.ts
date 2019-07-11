/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { QuickPickItem, window, Disposable, CancellationToken, QuickInputButton, QuickInput, ExtensionContext, QuickInputButtons, Uri } from 'vscode';
import { CommandParams } from './interfaces/command-params';

/**
 * A multi-step input using window.createQuickPick() and window.createInputBox().
 * 
 * This first part uses the helper class `MultiStepInput` that wraps the API for the multi-step case.
 */
export async function multiStepInput(context: ExtensionContext, commandParams: CommandParams) {

  async function collectInputs() {
    const state = {
      step: 1,
      totalSteps: commandParams.params.length,
    } as InputState;

    await MultiStepInput.run((input) => inputName(input, state));
    // return state as State;
    return state;
  }

  /*async function pickResourceGroup(input: MultiStepInput, state: Partial<State>) {
    const pick = await input.showQuickPick({
      title,
      step: 1,
      totalSteps: 3,
      placeholder: 'Pick a resource group',
      items: resourceGroups,
      activeItem: typeof state.resourceGroup !== 'string' ? state.resourceGroup : undefined,
      buttons: [createResourceGroupButton],
      shouldResume: shouldResume
    });
    if (pick instanceof MyButton) {
      return (input: MultiStepInput) => inputResourceGroupName(input, state);
    }
    state.resourceGroup = pick;
    return (input: MultiStepInput) => inputName(input, state);
  }

  async function inputResourceGroupName(input: MultiStepInput, state: Partial<State>) {
    state.resourceGroup = await input.showInputBox({
      title,
      step: 2,
      totalSteps: 4,
      value: typeof state.resourceGroup === 'string' ? state.resourceGroup : '',
      prompt: 'Choose a unique name for the resource group',
      validate: validateNameIsUnique,
      shouldResume: shouldResume
    });
    return (input: MultiStepInput) => inputName(input, state);
  }*/

  async function inputName(input: MultiStepInput, state: InputState) {
    const name = commandParams.params[state.step - 1];
    const optionName = name.replace(' ', '_') as keyof InputState;
    // const name = state[step - 1];

    // TODO: Remember current value when navigating back.
    const value = await input.showInputBox({
      title: `Generate ${commandParams.title}`,
      step: state.step,
      totalSteps: state.totalSteps,
      value: state[optionName] !== undefined ? String(state[optionName]) : '',
      prompt: `Enter a name for the ${name}`,
      validate: validateNameIsUnique,
      shouldResume: shouldResume
    });

    if (state.step < state.totalSteps) {
      state.step = state.step + 1;

      return (input: MultiStepInput) => inputName(input, state);
    }
  }
  

  /*async function pickRuntime(input: MultiStepInput, state: Partial<State>) {
    const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
    const runtimes = await getAvailableRuntimes(state.resourceGroup!, undefined);
    // TODO: Remember currently active item when navigating back.
    state.runtime = await input.showQuickPick({
      title,
      step: 3 + additionalSteps,
      totalSteps: 3 + additionalSteps,
      placeholder: 'Pick a runtime',
      items: runtimes,
      activeItem: state.runtime,
      shouldResume: shouldResume
    });
}*/

  function shouldResume() {
    // Could show a notification with the option to resume.
    return new Promise<boolean>((resolve, reject) => {

    });
  }

  async function validateNameIsUnique(name: string) {
    // ...validate...
    await new Promise(resolve => setTimeout(resolve, 1000));
    return name === 'vscode' ? 'Name not unique' : undefined;
  }

  /*async function getAvailableRuntimes(resourceGroup: QuickPickItem | string, token?: CancellationToken): Promise<QuickPickItem[]> {
    // ...retrieve...
    await new Promise(resolve => setTimeout(resolve, 1000));
    return ['Node 8.9', 'Node 6.11', 'Node 4.5']
      .map(label => ({ label }));
  }*/

  const state = await collectInputs();

  window.showInformationMessage(`Creating ${commandParams.title}`);
}


// -------------------------------------------------------
// Helper code that wraps the API for the multi-step case.
// -------------------------------------------------------


/*class InputFlowAction {
  private constructor() { }
  static back = new InputFlowAction();
  static cancel = new InputFlowAction();
  static resume = new InputFlowAction();
}

type InputStep = (input: MultiStepInput) => Thenable<InputStep | void>;

interface QuickPickParameters<T extends QuickPickItem> {
  title: string;
  step: number;
  totalSteps: number;
  items: T[];
  activeItem?: T;
  placeholder: string;
  buttons?: QuickInputButton[];
  shouldResume: () => Thenable<boolean>;
}

interface InputBoxParameters {
  title: string;
  step: number;
  totalSteps: number;
  value: string;
  prompt: string;
  validate: (value: string) => Promise<string | undefined>;
  buttons?: QuickInputButton[];
  shouldResume: () => Thenable<boolean>;
}

*/