import electron from 'electron';
import fs from 'fs';
import path from 'path';

export class Prefs {
	private static _instance: Prefs;
	public static get instance() { return this._instance; }

	public static createInstance(defaults: PrefData) {
		if (Prefs._instance) return;
		Prefs._instance = new Prefs('user.prefs', defaults);
	}

	private readonly path: string;
	private readonly data: PrefData;

	constructor(configName: string, defaults: PrefData) {
		const userDataPath = (electron.app || electron.remote.app).getPath('userData');
		this.path = path.join(userDataPath, configName + '.json');
		this.data = Prefs.parseDataFile(this.path, defaults);
	}

	public get<T>(key: PrefKey, defaultValue: T) { return this.data[key] ?? defaultValue; }

	public set(key: PrefKey, value: any) {
		this.data[key] = value;
		this.save();
	}

	public setAll(data: Partial<PrefData>) {
		Object.keys(data).forEach((k: PrefKey) => this.data[k] = data[k]);
		this.save();
	}

	private save() {
		fs.writeFileSync(this.path, JSON.stringify(this.data));
	}

	private static parseDataFile(filePath: string, defaults: PrefData) {
		try {
			return JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }));
		} catch (error) {
			return defaults;
		}
	}
}

export type PrefKey = 'x' | 'y' | 'width' | 'height' | 'lastPath' | 'maximized';
export type PrefData = Record<PrefKey, any>;