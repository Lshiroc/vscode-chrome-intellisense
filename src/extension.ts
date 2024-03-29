/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

interface ChromeEl {
	name: string,
	kind: string
}

interface ActionEl {
	name: string,
	kind: string,
	parameters: string,
	documentation: string
}

enum Kind {
	Class,
	Method
}

import * as vscode from 'vscode';
const chromeJSON = require("./completions/chrome.json");
const actionJSON = require('./completions/action.json');

export function activate(context: vscode.ExtensionContext) {
	console.log("extension is working..")

	const provider1 = vscode.languages.registerCompletionItemProvider("javascript", {

		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

			// a simple completion item which inserts `Hello World!`
			const simpleCompletion = new vscode.CompletionItem('chrome');

			// a completion item that inserts its text as snippet,
			// the `insertText`-property is a `SnippetString` which will be
			// honored by the editor.
			// const snippetCompletion = new vscode.CompletionItem('Good part of the day');
			// snippetCompletion.insertText = new vscode.SnippetString('Good ${1|morning,afternoon,evening|}. It is ${2|okay,good,perfect|}, right?');
			// const docs: any = new vscode.MarkdownString("Inserts a snippet that lets you select [link](x.ts).");
			// snippetCompletion.documentation = docs;
			// docs.baseUri = vscode.Uri.parse('http://example.com/a/b/c/');

			const cc1 = new vscode.CompletionItem("action", vscode.CompletionItemKind.Method);


			// a completion item that can be accepted by a commit character,
			// the `commitCharacters`-property is set which means that the completion will
			// be inserted and then the character will be typed.
			const commitCharacterCompletion = new vscode.CompletionItem('console');
			commitCharacterCompletion.commitCharacters = ['.'];
			commitCharacterCompletion.documentation = new vscode.MarkdownString('Press `.` to get `console.`');

			// a completion item that retriggers IntelliSense when being accepted,
			// the `command`-property is set which the editor will execute after 
			// completion has been inserted. Also, the `insertText` is set so that 
			// a space is inserted after `new`
			const commandCompletion = new vscode.CompletionItem('action');
			commandCompletion.kind = vscode.CompletionItemKind.Method;
			commandCompletion.insertText = 'chrome.action';
			commandCompletion.command = { command: 'editor.action.triggerSuggest', title: 'Re-trigger completions...' };

			// return all completion items as array
			return [
				// simpleCompletion,
				// cc1,
				// commitCharacterCompletion,
				// commandCompletion
			];
		}
	});

	const provider2 = vscode.languages.registerCompletionItemProvider(
		'javascript',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

				// get all text until the `position` and check if it reads `console.`
				// and if so then complete if `log`, `warn`, and `error`
				const linePrefix = document.lineAt(position).text.slice(0, position.character);
				if (!linePrefix.endsWith('chrome.')) {
					return undefined;
				}


				return [
					new vscode.CompletionItem('myFunc', vscode.CompletionItemKind.Module),
				];
			}
		},
		'.' // triggered whenever a '.' is being typed
	);

	const chromeProvider = vscode.languages.registerCompletionItemProvider(
		'javascript',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const linePrefix = document.lineAt(position).text.slice(0, position.character);
				if (!linePrefix.endsWith('chrome.')) {
					return undefined;
				}
				
				return chromeJSON.chrome.map((el: ChromeEl) => {
					let completionItem = new vscode.CompletionItem(el.name, vscode.CompletionItemKind[el.kind as keyof typeof vscode.CompletionItemKind])
					completionItem.detail = `${el.kind.toLowerCase()} ${el.name}`;
					return completionItem;
				});
			},
		},
		'.'
	);

		const actionProvider = vscode.languages.registerCompletionItemProvider(
		'javascript',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const linePrefix = document.lineAt(position).text.slice(0, position.character);
				if (!linePrefix.endsWith('chrome.action.')) {
					return undefined;
				}
				
				return actionJSON.action.map((el: ActionEl) => {
					let completionItem = new vscode.CompletionItem(el.name, vscode.CompletionItemKind[el.kind as keyof typeof vscode.CompletionItemKind])
					completionItem.detail = `(${el.kind.toLowerCase()}) action.${el.name}(${el.parameters})`;
					completionItem.documentation = el.documentation;
					let markdown = new vscode.MarkdownString();
					markdown.appendMarkdown(el.documentation);
					markdown.baseUri = vscode.Uri.parse("https://developer.chrome.com/docs/extensions/reference/api/action#method-setIcon");
					completionItem.documentation = markdown;
					completionItem.command = {command: "editor.action.showHover", "title": "lolllll"}
					// completionItem.
					// completionItem.
					return completionItem;
				});
			},
		},
		'.'
	);

	// vscode.languages.createLanguageStatusItem("saas", "sasa")

	// vscode.languages.createLanguageStatusItem
	
		
	context.subscriptions.push(actionProvider, chromeProvider);
}