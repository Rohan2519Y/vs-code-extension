
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('aiChat.startChat', () => {
      const panel = vscode.window.createWebviewPanel(
        'aiChat',
        'AI Chat Assistant',
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))]
        }
      );

      const reactAppPath = path.join(context.extensionPath, 'media/chat-ui/dist/index.html');
      const html = fs.readFileSync(reactAppPath, 'utf8');
      panel.webview.html = html;

      panel.webview.onDidReceiveMessage(async (msg) => {
        if (msg.command === 'getFiles') {
          const files = await vscode.workspace.findFiles('**/*');
          const fileList = files.map(f => path.basename(f.fsPath));
          panel.webview.postMessage({ command: 'fileList', data: fileList });
        }
        if (msg.command === 'readFile') {
          const fileUri = vscode.Uri.file(path.join(vscode.workspace.rootPath || '', msg.filename));
          const content = fs.readFileSync(fileUri.fsPath, 'utf8');
          panel.webview.postMessage({ command: 'fileContent', data: content });
        }
      });
    })
  );
}

export function deactivate() {}
