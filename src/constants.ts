import path from 'path';
import { app } from 'electron';

class ConstantsClass {
	public readonly protocolPrefix = 'app';
	public readonly protocol = `${this.protocolPrefix}://`;
	public staticDir: string;

	setup() {
		this.staticDir = path.join(app.getPath('userData'), 'static');
	}

	createUrl(filePath: string) { return `${this.protocol}${filePath}`; }
}

export const Constants = new ConstantsClass();