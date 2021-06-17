#!/bin/bash

set -e

PROJECT_PATH=$(pwd)
OUT="$PROJECT_PATH/out"
BUILD="$PROJECT_PATH/build"

BASE_FILENAME=phaser-spine-preview
LINUX_FILENAME=$BASE_FILENAME-linux
WIN_FILENAME=$BASE_FILENAME-win
LINUX_FOLDER_NAME=phaser-spine-preview-linux-x64
WIN_FOLDER_NAME=phaser-spine-preview-win32-x64

# intial setup

rm -rf $OUT
rm -rf $BUILD
mkdir -p $BUILD


# create artifacts

npm run make
npm run pack-win


# moving files
cd $OUT

zip -9 -r $LINUX_FILENAME.zip $LINUX_FOLDER_NAME/
mv $LINUX_FILENAME.zip $BUILD

zip -9 -r $WIN_FILENAME.zip $WIN_FOLDER_NAME/
mv $WIN_FILENAME.zip $BUILD

mv ./make/deb/x64/*.deb $BUILD/$LINUX_FILENAME.deb


# cleanup
rm -rf $OUT
