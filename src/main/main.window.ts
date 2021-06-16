import { BrowserWindow } from 'electron';
import { BrowserWindowConstructorOptions } from 'electron';
import { Prefs } from '../preferences';

export class MainWindow extends BrowserWindow {
	private resizeTimeout: any = null;
	private moveTimeout: any = null;

	constructor(options: BrowserWindowConstructorOptions) {
		super(options);
		const prefs = Prefs.instance;

		this.setPosition(prefs.get('x', 0), prefs.get('y', 0));
		this.setSize(prefs.get('width', 1200), prefs.get('height', 800));
		if (prefs.get('maximized', true)) this.maximize();

		this.on('resize', () => this.onWindowResized());
		this.on('move', () => this.onWindowMoved());
	}

	private onWindowResized() {
		if (this.resizeTimeout !== null) {
			clearTimeout(this.resizeTimeout);
			this.resizeTimeout = null;
		}

		this.resizeTimeout = setTimeout(() => {
			this.resizeTimeout = null;
			const { width, height } = this.getBounds();
			const maximized = this.isMaximized();
			Prefs.instance.setAll({ width, height, maximized });
		}, 1000);
	}

	private onWindowMoved() {
		if (this.moveTimeout !== null) {
			clearTimeout(this.moveTimeout);
			this.moveTimeout = null;
		}

		this.moveTimeout = setTimeout(() => {
			this.moveTimeout = null;
			const { x, y } = this.getBounds();
			Prefs.instance.setAll({ x, y });
		}, 1000);
	}
}