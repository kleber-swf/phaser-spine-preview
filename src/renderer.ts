import 'p2';
import 'pixi';
import 'phaser-ce';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { Events } from './events';
import { Preview } from './preview/preview';

import './index.css';
import { UI } from './preview/ui';

const preview = new Preview();
new UI(preview);

ipcRenderer.on(Events.OPEN_FILE_REPLY,
	(_event: IpcRendererEvent, file: string) => preview.loadFile(file));

ipcRenderer.on(Events.RELOAD_FILE_REPLY,
	(_event: IpcRendererEvent, file: string) => preview.loadFile(file));
