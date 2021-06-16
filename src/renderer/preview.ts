import { Constants } from '../constants';
import { IGame, Spine } from './intf';

const SpinePlugin = require('@k3n/phaser-spine');

const KEY = 'anim';
const GRID_DISTANCE = 10;

export class Preview {
	private readonly game: IGame

	private anim: Spine;
	private currAnimUrl: string;
	private group: Phaser.Graphics;
	private grid: Phaser.Graphics;
	private _selectedAnimation: string;

	public readonly onFileLoaded = new Phaser.Signal();

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
		this.group = this._createGroup();

		game.stage.disableVisibilityChange = true;
		game.scale.onSizeChange.add(this._onResize, this);
		this._onResize(null, game.width, game.height);
	}

	private _onResize(_: any, w: number, h: number) {
		this.group.position.set(w * 0.5, h * 0.5);
		this._drawGrid();
	}

	private _drawGrid() {
		if (!this.grid) this.grid = this._createGrid();

		const grid = this.grid;
		const { width, height } = this.game;

		grid.clear()
			.beginFill(0, 0)
			.drawRect(0, 0, width, height);

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

	private _createGroup() {
		const group = this.game.add.graphics();
		group.inputEnabled = true;
		group.input.draggable = true;
		this.game.canvas.onscroll = (...e: any[]) => console.log(e);
		return group;
	}

	private _createGrid() {
		const grid = new Phaser.Graphics(this.game, 0, 0);
		this.game.world.addChildAt(grid, 0);
		return grid;
	}

	public loadFile(fileUrl: string) {
		this.currAnimUrl = fileUrl;
		const load = this.game.load;
		load.removeAll();
		load.spine(KEY, fileUrl);
		load.start();
	}

	private onLoadComplete() {
		const game = this.game;
		const group = this.group;

		if (this.anim) {
			group.removeChildren();
			this.anim.destroy(true, false);
		}

		this.anim = game.add.spine(0, 0, KEY);
		group.addChild(this.anim);

		this._selectedAnimation = null;
		this.onFileLoaded.dispatch(this.getAnimFilename(), this.anim.skeletonData.animations);
	}

	public getSelectedAnim() { return this._selectedAnimation; }

	private getAnimFilename() {
		const fileUrl = this.currAnimUrl;
		if (!fileUrl) return '';
		const filename = fileUrl.substr(Constants.protocol.length).substr(0);
		return filename.substr(0, filename.length - 5);
	}

	public selectAnim(animName: string) {
		this._selectedAnimation = animName;
		if (animName) {
			this.anim.setAnimationByName(0, animName, true);
			this.anim.state.timeScale = 1;
		} else
			this.anim.state.timeScale = 0;
	}
}