"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('aiChat.startChat', () => {
        const panel = vscode.window.createWebviewPanel('aiChat', 'AI Chat Assistant', vscode.ViewColumn.Beside, {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))]
        });
        const reactAppPath = path.join(context.extensionPath, 'media/chat-ui/dist/index.html');
        const html = fs.readFileSync(reactAppPath, 'utf8');
        panel.webview.html = html;
        panel.webview.onDidReceiveMessage((msg) => __awaiter(this, void 0, void 0, function* () {
            if (msg.command === 'getFiles') {
                const files = yield vscode.workspace.findFiles('**/*');
                const fileList = files.map(f => path.basename(f.fsPath));
                panel.webview.postMessage({ command: 'fileList', data: fileList });
            }
            if (msg.command === 'readFile') {
                const fileUri = vscode.Uri.file(path.join(vscode.workspace.rootPath || '', msg.filename));
                const content = fs.readFileSync(fileUri.fsPath, 'utf8');
                panel.webview.postMessage({ command: 'fileContent', data: content });
            }
        }));
    }));
}
function deactivate() { }
//# sourceMappingURL=extension.js.map