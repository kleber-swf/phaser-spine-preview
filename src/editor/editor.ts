import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'path';
import { promises as fs } from 'fs';
import { IpcMainEvent } from 'electron/main';
import { Events } from '../events';
import { Constants } from '../constants';

export class Editor {
	constructor(private readonly mainWindow: BrowserWindow) {
		ipcMain.addListener(Events.OPEN_FILE_REQUEST, (event) => this.openFileDialog(event));
	}

	private openFileDialog(event: IpcMainEvent) {
		const files = dialog.showOpenDialogSync(this.mainWindow, {
			title: 'Open Spine Json file',
			filters: [{
				name: 'JSON Files', extensions: ['json']
			}]
		});
		if (files.length < 1) return;

		const filename = files[0];
		this.copyFiles(filename).then(() =>
			event.reply(Events.OPEN_FILE_REPLY,
				Constants.createUrl(path.basename(filename)))
		);
	}

	private async copyFiles(jsonFilePath: string): Promise<void> {
		const folder = Constants.staticDir;
		const jsonFileName = path.basename(jsonFilePath);

		const baseFileName = jsonFileName.substr(0, jsonFileName.length - '.json'.length);
		const baseFilePath = jsonFilePath.substr(0, jsonFilePath.length - '.json'.length);

		await Promise.all([
			fs.copyFile(jsonFilePath, path.join(folder, jsonFileName)),
			fs.copyFile(`${baseFilePath}.atlas`, path.join(folder, `${baseFileName}.atlas`)),
			fs.copyFile(`${baseFilePath}.png`, path.join(folder, `${baseFileName}.png`)),
		])
	}
}