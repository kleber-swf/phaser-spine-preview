import { ipcRenderer } from 'electron';
import { Events } from '../events';
import { SpineAnimation } from './intf';
import { Preview } from './preview';

export class UI {
	private readonly actionsPanel: HTMLElement;
	private readonly fileNameLabel: HTMLElement;
	private readonly animNameLabel: HTMLElement;
	private animPanel: HTMLElement;

	constructor(private readonly preview: Preview) {
		this.actionsPanel = document.getElementById('action-panel');
		this.fileNameLabel = document.getElementById('file-name');
		this.animNameLabel = document.getElementById('animation-name');
		preview.onFileLoaded.add(this.onFileLoaded, this);

		const loadButton = document.getElementById('load-button');
		loadButton.addEventListener('click', () => ipcRenderer.send(Events.OPEN_FILE_REQUEST));
	}

	public onFileLoaded(filename: string, animations: SpineAnimation[]) {
		console.log(animations);

		if (this.animPanel) this.actionsPanel.removeChild(this.animPanel);

		const animPanel = this.animPanel = document.createElement('div');
		animPanel.id = 'animations-panel';
		animPanel.classList.add('panel');

		const title = document.createElement('div');
		title.classList.add('title');
		title.appendChild(document.createTextNode('Animations'));
		animPanel.appendChild(title);
		this.actionsPanel.appendChild(animPanel);

		this.fileNameLabel.textContent = filename;

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
