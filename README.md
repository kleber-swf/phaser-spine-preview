# Phaser Spine Preview

* [Phaser](https://github.com/photonstorm/phaser-ce) version: **Phaser-CE 2.x**
* [Spine](http://esotericsoftware.com/) version: **3.2.01**
* [Phaser Spine Plugin](https://github.com/K3nIchi/phaser-spine) version: **3.0.9-b**

---

## Why?

Spine support to Phaser-CE is made by a plugin and is limited. Because of this issue, animators have a different version of their work inside the game.

This issue can take sometimes too much time to solve since the animation might not be integrated into the game immediately or can be hardly reachable inside the game.

This project previews Spine animations inside a Phaser-CE + Spine Plugin environment so the result seen inside this "editor" is as close as possible to the actial game.

## What this project is

* A Phaser-CE + Spine environment to preview exported animations made with Spine 3.2.01

## What this project isn't

* An editor to Spine animations
* A preview for Spine animations other than 3.2.01

## Features

* Open exported Spine 3.2.01 animation files (.json)
* Play/stop animations inside the file
* Pan and zoom
* Change background color

## [Download](https://github.com/kleber-swf/phaser-spine-preview/releases)

Download the version you need inside the [Releases](https://github.com/kleber-swf/phaser-spine-preview/releases) tab.

## Collaboration

If you want to collaborate with this project, you can:
* Post an issue in the issues tab
* Make a pull request


### Executing from source

This is a normal Electron project so for you to execute it locally just make the usual stuff:

* After you clone, install the dependencies with:
	```
	npm install
	```
* After that you just need to start the project with:
	```
	npm start
	```

You can use yarn if you want.

### Building locally

This project was built and tested inside a Ubuntu Linux 20.04. You can build it inside Windows but you might have to adjust some configurations.

To build a Windows executable from Linux first you need to install [Wine](https://www.winehq.org/) as pointed here: https://www.npmjs.com/package/electron-packager#building-windows-apps-from-non-windows-platforms

Inside a Linux machine you just need to run:

```
npm run build
```

This will create all executables and .deb file inside the `build` folder. Keep in mind that this scripts will try to create the Linux AND Windows versions, so if you are in a Linux machine you need to have the Wine step made first.

