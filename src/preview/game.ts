
export interface IGame extends Phaser.Game {
	load: ILoader;
	add: IGameObjectCreator;
}

export interface ILoader extends Phaser.Loader {
	spine(key: string, json: string): void;
}

export interface IGameObjectCreator extends Phaser.GameObjectFactory {
	spine(x: number, y: number, key: string): Spine;
}

export interface Spine extends Phaser.Group {
	setAnimationByName(trackIndex: number, animationName: string, loop: boolean): void;
}