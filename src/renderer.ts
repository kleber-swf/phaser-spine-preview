import 'p2';
import 'pixi';
import 'phaser-ce';
import './index.css';
import { Preview } from './preview/preview';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { Events } from './events';

// Create and configure Preview
const preview = new Preview();
ipcRenderer.on(Events.OPEN_FILE_REPLY, (_event: IpcRendererEvent, file: string) => preview.loadFile(file));


// Buttons event listeners
const loadButton = document.getElementById('load-button');
loadButton.addEventListener('click', () => ipcRenderer.send(Events.OPEN_FILE_REQUEST));
