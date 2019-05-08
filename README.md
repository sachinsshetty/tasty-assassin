
# Don't Eat (Me)

Save the cake from the hungry pets.

* Game developed during CS Game Jam 2019 - Uni Bonn
* Theme: Tasty assassin
* Engine/Framework: [Phaser](http://phaser.io/)
* Team: LoneRangers

| Name | Work |
|---|---|
| [Karl Welzel](https://github.com/BurningKarl) | core logic, sonic boom, scooby doo, life, eatables |
| Thorsten Mehlich | crazy schrodinger cat, background |
| [Sachin Shetty](https://gaganyatri.com) | mobile controls, deployment |

## Play Game
* In the Browser: https://kwelzel.itch.io/dont-eat-me
* On Android: https://play.google.com/store/apps/details?id=com.slabstech.game.donteatme


#### Suggestions

Please provide comments and suggestions to improve the game further.

Best if you open issues at [https://github.com/sachinsshetty/tasty-assassin/issues](https://github.com/sachinsshetty/tasty-assassin/issues)


#### Browser Game Setup

* `python -m SimpleHTTPServer`
* Open index.html in your browser: `localhost:8000`


## Android Game Setup
* `cordova create dont-eat`
* `cd www`
* `npm init`
* `cordova platform add browser`
* `cordova plugin add cordova-plugin-browsersync`
* `cordova run browser --live-reload`
* `cordova platform add ios android`
* `cordova emulate android`
* `cordova build --release android`

##### Android Release
* `keytool -genkey -v -keystore game-jam.keystore -alias game-jam-key -keyalg RSA -keysize 2048 -validity 10000`
* `cordova build --release android --keystore=../my-release-key.keystore --storePassword=password --alias=alias_name --password=password`
* `jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore game-jam.keystore app-release-unsigned.apk game-jam-key`
* `sudo apt install zipalign`
* `zipalign -v 4 app-release-unsigned.apk app-release.apk`


#####  Sources
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

## Credits

* Buttons: https://opengameart.org/content/ui-pack
* Kitchen: https://www.shutterstock.com/image-illustration/cartoon-interior-family-kitchen-...
* Cake: https://commons.wikimedia.org/wiki/File:Cartoon_Happy_Birthday_Cake.svg
* Food: https://henrysoftware.itch.io/pixel-food
* Dog: https://opengameart.org/content/rusty
* Barking image: https://en.wikipedia.org/wiki/File:Icon_sound_loudspeaker.svg
* Barking sound: https://www.zapsplat.com/music/dog-barking-3/
* Cat: https://opengameart.org/content/cat-sprites
