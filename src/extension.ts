import * as vscode from 'vscode';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { mkdtemp } from 'node:fs/promises';
import { sep } from 'node:path';

export function activate(context: vscode.ExtensionContext) {
	console.log('"caide-inliner" is now active!');

	let config = vscode.workspace.getConfiguration('caide-inliner');
	let executablePath = config.get<string>('executable')!;
	let clangSettings = config.get<string[]>('clangCompilationOptions')!;
	let maxEmptyLines = config.get<number>('maxSubsequentEmptyLines')!;

	const disposable = vscode.commands.registerTextEditorCommand('caide-inliner.inline', async (textEditor: vscode.TextEditor) => {
		let document = textEditor.document;
		let filename = document.fileName;
		let tempDir = await mkdtemp(`${tmpdir()}${sep}`);

		let args = [filename, tempDir, String(clangSettings.length), ...clangSettings, String(maxEmptyLines)];
		const proc = spawn(executablePath, args, { stdio: ['ignore', 'pipe', 'pipe'] });
		vscode.window.withProgress(
			{ location: vscode.ProgressLocation.Notification, title: 'running caide..' },
			() => new Promise<void>(done => proc.on('close', () => done())),
		);
		let err = '';
		proc.stderr.on('data', d => err += d.toString());
		let out = '';
		proc.stdout.on('data', d => out += d.toString());
		proc.on('close', async (ret) => {
			if (ret != 0) {
				vscode.window.showErrorMessage(err);
				return;
			}
			let range = new vscode.Range(document.positionAt(0), document.positionAt(document.getText().length));
			await textEditor.edit(edit => {
				edit.replace(range, out);
			});
		});
	});
	context.subscriptions.push(disposable);
}

export function deactivate() { }