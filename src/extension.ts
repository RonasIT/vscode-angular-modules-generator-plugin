import * as vscode from 'vscode';
import { commandsMap } from './commands';
import { multiStepInput } from './multi-step-input';

export function activate(context: vscode.ExtensionContext) {

  for (const [key, value] of commandsMap) {
    const command = vscode.commands
      .registerCommand(key, async () => {
        return multiStepInput(context, value)
          .then(async (values) => {
            if (vscode.workspace.rootPath === undefined) {
              //throw new Error('Please open a project first');
            }

            await generateFiles(value.command, values);

            vscode.window.showInformationMessage(`Creating ${value.title}`);
          });
      });

    context.subscriptions.push(command);
  }

  async function generateFiles(command:string, params: string[]) {
    const terminal = vscode.window.createTerminal('generator');
    const generatorCommand = 'hygen generator ' + command.replace(/%s/g, () => <string>params.shift());
    
    terminal.sendText(generatorCommand);
    terminal.show();
    //terminal.dispose();
  }
}

export function deactivate() {}
