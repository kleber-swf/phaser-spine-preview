import { app } from 'electron';
import { IGame } from './game';
import path from 'path';

const PhaserSpine = require('../plugins/phaser-spine');

const KEY = 'anim';

export class Preview {
	private readonly game: IGame
	constructor() { this.game = new Phaser.Game(1024, 768, Phaser.AUTO, 'game', this) as IGame; }

	public preload() {
		const game = this.game;
		game.add.plugin(PhaserSpine.SpinePlugin);
		game.load.onLoadComplete.add(this.onLoadComplete, this);
		// (game as any).load.spine('buddy', 'assets/buddy_skeleton.json');
		console.log('preload');
	}

	public create() {
		console.log('create');
	}

	public loadFile(fileUrl: string) {
		this.game.load.spine(KEY, fileUrl);
		this.game.load.start();
	}

	private onLoadComplete() {
		const buddy = this.game.add.spine(100, 100, KEY);
		console.log(buddy);
		buddy.setAnimationByName(0, 'idle', true);
	}
}