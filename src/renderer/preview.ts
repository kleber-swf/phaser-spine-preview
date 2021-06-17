import { Constants } from '../constants';
import { IGame, Spine } from './intf';

const SpinePlugin = require('@k3n/phaser-spine');

const KEY = 'anim';
const CELL_SIZE = 25;

export const AVAILABLE_BG_COLORS = [0x222222, 0x555555, 0xFFFFFF];

export class Preview {
	private readonly game: IGame

	private anim: Spine;
	private currAnimUrl: string;
	private group: Phaser.Graphics;
	private grid: Phaser.Graphics;
	private _selectedAnimation: string;

	private _backgroundColor = AVAILABLE_BG_COLORS[0];

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
		game.load.onLoadComplete.add(this.addAnimToStage, this);
	}

	public create() {
		const game = this.game;
		this.group = this._createGroup();

		game.stage.disableVisibilityChange = true;
		game.scale.onSizeChange.add(this._drawGrid, this);
		this._drawGrid();
	}

	private _drawGrid() {
		if (!this.grid) this.grid = this._createGrid();

		const grid = this.grid;
		const { width, height } = this.game;

		grid.clear().beginFill(this._backgroundColor);
		const cols = Math.ceil(width / CELL_SIZE);
		const rows = Math.ceil(height / CELL_SIZE);

		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				const x = (r + c) % 2;
				grid.fillAlpha = (x + 0.5) - x * 0.5;
				grid.drawRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
			}
		}

		grid.cacheAsBitmap = true;
	}

	private _createGroup() {
		return this.game.add.graphics(this.game.width * 0.5, this.game.height * 0.5);
	}

	private _createGrid() {
		const grid = new Phaser.Graphics(this.game, 0, 0);
		this.game.world.addChildAt(grid, 0);

		grid.inputEnabled = true;
		const { input, events } = grid;

		input.enableDrag();
		input.setDragLock(false, false);
		input.dragDistanceThreshold = 10;

		events.onDragStart.add(this._onDragStart, this);
		events.onDragUpdate.add(this._onDragUpdate, this);
		events.onDragStop.add(this._onDragStop, this);

		return grid;
	}

	private _dragOffset = new Phaser.Point();
	private _isDragging = false;

	private _onDragStart(_: any, pointer: Phaser.Pointer) {
		if (!this.anim) return;
		const target = this.group.position;
		this._dragOffset.set(pointer.x - target.x, pointer.y - target.y);
		this.game.canvas.style.cursor = 'move';
		this._isDragging = true;
	}

	private _onDragUpdate(_: any, pointer: Phaser.Pointer) {
		if (!this._isDragging) return;
		this.group.position.set(pointer.x - this._dragOffset.x, pointer.y - this._dragOffset.y);
	}

	private _onDragStop() {
		this._isDragging = false;
		this.game.canvas.style.cursor = 'default';
	}

	public loadFile(fileUrl: string) {
		this.currAnimUrl = fileUrl;
		const load = this.game.load;
		load.removeAll();
		load.spine(KEY, fileUrl);
		load.start();
	}

	private addAnimToStage() {
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

	public setBackgroundColor(color: number) {
		this._backgroundColor = color;
		this._drawGrid();
	}
}