# tasty-assassin
CS Game Jam 2019 - Uni Bonn


#### Setup

##### Phaser.io


* git clone https://github.com/photonstorm/phaser

* python -m SimpleHTTPServer

* Open index.html from browers : localhost:8000

https://gamedevacademy.org/creating-mobile-games-with-phaser-3-and-cordova/


* Android Tutorial

* cordova create dont-eat

* cd www

* npm init

* cordova platform add browser

* cordova plugin add cordova-plugin-browsersync

* cordova run browser --live-reload

* cordova platform add ios android

* cordova emulate android

* cordova build --release android

* keytool -genkey -v -keystore game-jam.keystore -alias game-jam-key -keyalg RSA -keysize 2048 -validity 10000

* cordova build --release android --keystore=../my-release-key.keystore --storePassword=password --alias=alias_name --password=password

* jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore game-jam.keystore app-release-unsigned.apk game-jam-key

* sudo apt install zipalign

* zipalign -v 4 app-release-unsigned.apk app-release.apk


sources
* [Android Cordova build](https://cordova.apache.org/docs/en/latest/guide/platforms/android/)
* [android release](https://codeburst.io/publish-a-cordova-generated-android-app-to-the-google-play-store-c7ae51cccdd5)
* [Getting started](https://phaser.io/tutorials/getting-started-phaser3)
* [first game](https://phaser.io/tutorials/making-your-first-phaser-3-game)
* [facebook instant games](https://phaser.io/tutorials/getting-started-facebook-instant-games)
* [Python webserver](https://www.linuxjournal.com/content/tech-tip-really-simple-http-server-python)
* [Install Node Js](https://github.com/nodesource/distributions/blob/master/README.md#debmanual)
* [Game Setup : Cordova](https://gamedevacademy.org/creating-mobile-games-with-phaser-3-and-cordova/)
* [other webserver](https://phaser.io/tutorials/getting-started-phaser3/part2)
* [resize image](https://resizeimage.net/)
* [generate sprites](https://instantsprite.com/)

credits

bday icon >  https://www.iconfinder.com/icons/378570/birthday_cake_icon
