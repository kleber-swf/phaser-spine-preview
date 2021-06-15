import { BrowserWindow, dialog, ipcMain } from 'electron';
import { Events } from '../events';

export class Editor {
	constructor(private readonly mainWindow: BrowserWindow) {
		ipcMain.addListener(Events.OPEN_FILE_REQUEST, () => this.openFileDialog());
	}

	private openFileDialog() {
		const files = dialog.showOpenDialogSync(this.mainWindow, {
			title: 'Open Spine Json file',
			filters: [{
				name: 'JSON Files', extensions: ['json']
			}]
		});
		console.log(files);
	}

	public openFile(fileUrl: string) {

	}
}