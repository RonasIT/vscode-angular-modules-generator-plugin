// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { commandsMap } from './commands';
import { multiStepInput } from './multi-step-input';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "Angular Modules Generator" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  /*let disposable = vscode.commands.registerCommand('extension.generateSectionModule', () => {
    // The code you place here will be executed every time your command is executed

    vscode.window.showQuickPick(['tset', 'dddd', 'sddfsfsf']).then((val) => {
      // Display a message box to the user
      vscode.window.showInformationMessage('Section module "' + val + '" generated');
    });
  });

  let disposable1 = vscode.commands.registerCommand('extension.generatePageModule', () => {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    vscode.window.showInformationMessage('Page module "" generated');
  });

  context.subscriptions.push(disposable);*/

  const showDynamicDialog = async (args: any, command: string, inputParameters: string[]) => {
    /*const loc = await showFileNameDialog(args, resource, fileName);

    let resourceConfig = config;

    if (loc.params.includes(OptionType.ShowOptions)) {
      const selectedOptions = await showOptionsDialog(config, loc, resource);
      if (selectedOptions) {
        const optionsValuesMap = await configureOptionsValues(config, loc, resource, selectedOptions);
        loc.params = [...new Set([...loc.params, ...optionsValuesMap.keys()])];
        resourceConfig = mapConfigValues(config, resource, optionsValuesMap);
      }
    } else {
      if (loc.paramsMap.size > 0) {
        resourceConfig = mapConfigValues(config, resource, loc.paramsMap);
      }
    }

    await angularCli.generateResources(resource, loc, resourceConfig);
    displayStatusMessage(toTileCase(resource), loc.fileName);*/
    inputParameters.forEach((inputParameter) => {
      const options: vscode.InputBoxOptions = {
        prompt: `Enter ${inputParameter} name:`,
        placeHolder: "(placeholder)"
      };

      vscode.window.showInputBox(options)
        .then((value) => {
          if (!value) { return; }
          // answer1 = value;
          // show the next dialog, etc.
        });
    });

    vscode.window.showInformationMessage(`Page module ${command} generated`);
  };

  for (const [key, value] of commandsMap) {
    const command = vscode.commands
      .registerCommand(key, async () => {
        return multiStepInput(context, value)
          .then((values) => {

          });
      });

    context.subscriptions.push(command);
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
