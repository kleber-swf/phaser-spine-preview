import 'p2';
import 'pixi';
import 'phaser-ce';
import '@k3n/phaser-spine';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { Events } from './events';
import { Preview } from './renderer/preview';

import './index.css';
import { UI } from './renderer/ui';

const preview = new Preview();
new UI(preview);

ipcRenderer.on(Events.OPEN_FILE_REPLY,
	(_event: IpcRendererEvent, file: string) => preview.loadFile(file));

ipcRenderer.on(Events.RELOAD_FILE_REPLY,
	(_event: IpcRendererEvent, file: string) => preview.loadFile(file));
