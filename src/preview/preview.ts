import { IGame, Spine } from './intf';

import SpinePlugin from '../plugins/phaser-spine';

const KEY = 'anim';
const GRID_DISTANCE = 10;

export class Preview {
	private anim: Spine;
	private group: Phaser.Group;
	private grid: Phaser.Graphics;

	private readonly game: IGame
	constructor() {
		this.game = new Phaser.Game({
			width: 1920,
			height: 1080,
			backgroundColor: '#333333',
			parent: 'game',
			renderer: Phaser.AUTO,
			scaleMode: Phaser.ScaleManager.RESIZE,
			state: this,
		}) as IGame;
	}

	public preload() {
		const game = this.game;
		game.add.plugin(SpinePlugin);
		game.load.onLoadComplete.add(this.onLoadComplete, this);
	}

	public create() {
		const game = this.game;
		this.group = game.add.group();

		game.stage.disableVisibilityChange = true;
		game.scale.onSizeChange.add(this._onResize, this);
	}

	private _onResize(_: any, w: number, h: number) {
		this.group.position.set(w * 0.5, h * 0.5);
		this._drawGrid();
	}

	private _drawGrid() {
		if (!this.grid) this.grid = this.game.add.graphics(0, 0);
		const grid = this.grid;
		const { width, height } = this.game;

		grid.clear();

		let x = 0;
		do {
			grid.lineStyle(1, 0xFFFFFF, x % 100 === 0 ? 0.1 : 0.05);
			grid.moveTo(x, 0)
				.lineTo(x, height);
			x += GRID_DISTANCE;
		} while (x <= width);

		let y = 0;
		do {
			grid.lineStyle(1, 0xFFFFFF, y % 100 === 0 ? 0.1 : 0.05);
			grid.moveTo(0, y)
				.lineTo(width, y);
			y += GRID_DISTANCE;
		} while (y <= height);
	}

	public loadFile(fileUrl: string) {
		const load = this.game.load;
		load.removeAll();
		load.spine(KEY, fileUrl);
		load.start();
	}

	private onLoadComplete() {
		const game = this.game;
		const group = this.group;

		if (this.anim) {
			group.removeAll();
			this.anim.destroy(true, false);
		}

		const anim = this.anim = game.add.spine(0, 0, KEY);
		group.add(anim);
		anim.setAnimationByName(0, 'idle', true);
	}
}