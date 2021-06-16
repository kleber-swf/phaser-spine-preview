import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { IpcMainEvent } from 'electron/main';
import { promises as fs } from 'fs';
import path from 'path';
import { Prefs } from '../preferences';
import { Constants } from '../constants';
import { Events } from '../events';

export class Editor {
	private currentFilename: string;

	constructor(private readonly mainWindow: BrowserWindow) {
		ipcMain.addListener(Events.OPEN_FILE_REQUEST, (event) => this.openFileDialog(event));
		ipcMain.addListener(Events.RELOAD_FILE_REQUEST, (event) => this.reloadCurrentFile(event));
	}

	private openFileDialog(event: IpcMainEvent) {
		const files = dialog.showOpenDialogSync(this.mainWindow, {
			title: 'Open Spine Json file',
			defaultPath: Prefs.instance.get('lastPath', app.getPath('home')),
			filters: [{ name: 'JSON Files', extensions: ['json'] }]
		});

		if (!files?.length) return;

		const filename = this.currentFilename = files[0];
		Prefs.instance.set('lastPath', path.dirname(filename));

		this.copyFiles(filename).then(() =>
			event.reply(Events.OPEN_FILE_REPLY,
				Constants.createUrl(path.basename(filename)))
		);
	}

	private reloadCurrentFile(event: IpcMainEvent) {
		if (!this.currentFilename) return;
		const filename = this.currentFilename;
		this.copyFiles(filename).then(() =>
			event.reply(Events.RELOAD_FILE_REPLY,
				Constants.createUrl(path.basename(filename)))
		);
	}

	private async copyFiles(jsonFilePath: string): Promise<void> {
		await this.recreateFolder();

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

	private async recreateFolder() {
		const folder = Constants.staticDir;
		try { await fs.rmdir(folder); }
		catch (e) { }
		await fs.mkdir(folder, { recursive: true });
	}
}