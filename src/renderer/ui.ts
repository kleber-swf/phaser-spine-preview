import { ipcRenderer } from 'electron';
import { Events } from '../events';
import { SpineAnimation } from './intf';
import { AVAILABLE_BG_COLORS, Preview } from './preview';

export class UI {
	private readonly actionsPanel: HTMLElement;
	private readonly reloadButton: HTMLElement;
	private readonly fileNameLabel: HTMLElement;
	private readonly animNameLabel: HTMLElement;

	private animPanel: HTMLElement;

	constructor(private readonly preview: Preview) {
		this.actionsPanel = document.getElementById('action-panel');
		this.reloadButton = document.getElementById('reload-button');
		this.fileNameLabel = document.getElementById('file-name');
		this.animNameLabel = document.getElementById('animation-name');
		preview.onFileLoaded.add(this.onFileLoaded, this);

		const loadButton = document.getElementById('load-button');
		loadButton.addEventListener('click', () => ipcRenderer.send(Events.OPEN_FILE_REQUEST));
		this.reloadButton.addEventListener('click', () => ipcRenderer.send(Events.RELOAD_FILE_REQUEST));

		const selector = document.getElementById('bg-color-selector');
		AVAILABLE_BG_COLORS.forEach(color => {
			const el = document.createElement('div');
			el.classList.add('dot');
			el.style.backgroundColor = Phaser.Color.getWebRGB(color);
			if (color === preview.backgroundColor)
				el.classList.add('selected');
			el.onclick = () => {
				this.preview.backgroundColor = color;
				let child = selector.firstElementChild;
				while (child) {
					child.classList.remove('selected');
					child = child.nextElementSibling;
				}
				el.classList.add('selected');
			};
			selector.appendChild(el);
		});
	}

	public onFileLoaded(filename: string, animations: SpineAnimation[]) {
		this.reloadButton.classList.remove('invisible');
		this.fileNameLabel.textContent = filename;
		this.animNameLabel.textContent = '';

		if (this.animPanel) this.actionsPanel.removeChild(this.animPanel);

		const animPanel = this.animPanel = document.createElement('div');
		animPanel.id = 'animations-panel';
		animPanel.classList.add('panel', 'faded');

		const title = document.createElement('div');
		title.classList.add('title');
		title.appendChild(document.createTextNode('Animations'));
		animPanel.appendChild(title);
		this.actionsPanel.appendChild(animPanel);

		animations.forEach(anim => {
			const el = this.createButton(anim.name, () => this.selectAnimation(el, anim.name));
			animPanel.appendChild(el);
		});

		const stopButton = this.createButton('Stop', () => this.selectAnimation(null, null))
		stopButton.classList.add('stop');
		animPanel.appendChild(stopButton);
	}

	private createButton(label: string, action: () => void) {
		const el = document.createElement('div');
		el.append(document.createTextNode(label));
		el.classList.add('button', 'anim');
		el.onclick = action;
		return el;
	}

	private selectAnimation(btn: HTMLElement, anim: string) {
		if (!this.animPanel || this.preview.getSelectedAnim() === anim) return;

		let el = this.animPanel.firstElementChild.nextElementSibling;
		do {
			el.classList.remove('selected');
			el = el.nextElementSibling
		} while (el != null);

		if (btn) btn.classList.add('selected');
		this.preview.selectAnim(anim);
		this.animNameLabel.textContent = anim;
	}
}
