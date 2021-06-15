import 'p2';
import 'pixi';
import Phaser from 'phaser-ce';
import { ipcRenderer } from 'electron';
import { Events } from './events';
import './index.css';

const PhaserSpine = require('./plugins/phaser-spine');

const loadButton = document.getElementById('load-button');
loadButton.addEventListener('click', () => ipcRenderer.send(Events.OPEN_FILE_REQUEST));

const game = new Phaser.Game(1024, 768, Phaser.AUTO, 'game', { preload, create });

function preload() {
	game.add.plugin(PhaserSpine.SpinePlugin);
	// (game as any).load.spine('buddy', 'assets/buddy_skeleton.json');
	console.log('preload');
}

function create() {
	console.log('create');
}
