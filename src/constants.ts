import path from 'path';
import fs from 'fs';
import { app } from 'electron';

class ConstantsClass {
	public readonly protocolPrefix = 'app';
	public readonly protocol = `${this.protocolPrefix}://`;
	public staticDir: string;

	setup() {
		const dir = path.join(app.getPath('userData'), 'static');
		fs.mkdirSync(dir, { recursive: true });
		this.staticDir = dir;
	}

	createUrl(filePath: string) { return `${this.protocol}${filePath}`; }
}

export const Constants = new ConstantsClass();