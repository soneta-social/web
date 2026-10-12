# Soneta Web

Soneta is a fast and secure messaging app with a focus on security and speed. This repository contains its web client, which talks to Telegram servers directly over MTProto — no third-party API wrappers in between.

The client is based on [Telegram Web K](https://github.com/morethanwords/tweb) by Eduard Kuzmenko (which itself originates from Webogram), rebranded and developed further as Soneta.

### Developing
Install dependencies with:
```bash
pnpm install
```
This will install all the needed dependencies.


#### Running web-server
Just run `pnpm start` to start the web server and the livereload task.
Open http://localhost:8080/ in your browser.


#### Running in production

Run `pnpm build` to build the minimized production version of the app into the `dist` folder. Copy its contents to your web server, or serve it right away with `node server.js --dist`.

### Running in docker

#### Developing:
* Install dependencies `docker-compose up tweb.dependencies`.
* Run develop container `docker-compose up tweb.develop`.
* Open http://localhost:8080/ in your browser.

#### Production:
* Run `docker-compose up tweb.production -d` nginx image and container to serve the build
* Open http://localhost:80/ in your browser.

You can use `docker build -f ./.docker/Dockerfile_production -t {dockerhub-username}/{imageName}:{latest} .` to build your production ready image.

### Dependencies
* [BigInteger.js](https://github.com/peterolson/BigInteger.js) ([Unlicense](https://github.com/peterolson/BigInteger.js/blob/master/LICENSE))
* [fflate](https://github.com/101arrowz/fflate) ([MIT License](https://github.com/101arrowz/fflate/blob/master/LICENSE))
* [cryptography](https://github.com/spalt08/cryptography) ([Apache License 2.0](https://github.com/spalt08/cryptography/blob/master/LICENSE))
* [emoji-data](https://github.com/iamcal/emoji-data) ([MIT License](https://github.com/iamcal/emoji-data/blob/master/LICENSE))
* [emoji-test-regex-pattern](https://github.com/mathiasbynens/emoji-test-regex-pattern) ([MIT License](https://github.com/mathiasbynens/emoji-test-regex-pattern/blob/main/LICENSE))
* [tlottie](https://github.com/dkaraush/tlottie) (MIT License)
* [fast-png](https://github.com/image-js/fast-png) ([MIT License](https://github.com/image-js/fast-png/blob/master/LICENSE))
* [opus-recorder](https://github.com/chris-rudmin/opus-recorder) ([BSD License](https://github.com/chris-rudmin/opus-recorder/blob/master/LICENSE.md))
* [Prism](https://github.com/PrismJS/prism) ([MIT License](https://github.com/PrismJS/prism/blob/master/LICENSE))
* [Solid](https://github.com/solidjs/solid) ([MIT License](https://github.com/solidjs/solid/blob/main/LICENSE))
* [TinyLD](https://github.com/komodojp/tinyld) ([MIT License](https://github.com/komodojp/tinyld/blob/develop/license))
* [libwebp.js](https://libwebpjs.appspot.com/)
* fastBlur
* [Mediabunny](https://github.com/Vanilagy/mediabunny) ([Mozilla Public License 2.0](https://github.com/Vanilagy/mediabunny/blob/main/LICENSE))
* [Temml](https://github.com/ronkok/Temml) ([MIT License](https://github.com/ronkok/Temml/blob/main/LICENSE))

### Debugging
You are welcome in helping to minimize the impact of bugs. There are classes, binded to global context. Look through the code for certain one and just get it by its name in developer tools.
Source maps are included in production build for your convenience.

#### Additional query parameters
* **test=1**: to use test DCs
* **debug=1**: to enable additional logging
* **noSharedWorker=1**: to disable Shared Worker, can be useful for debugging
* **http=1**: to force the use of HTTPS transport when connecting to Telegram servers
* **pfs=1**: to use temporary auth keys (Perfect Forward Secrecy), off by default
* **a11y=1**: to enable the keyboard and screen-reader accessibility layer, off by default

Should be applied like that: http://localhost:8080/?test=1

#### Taking local storage snapshots
You can also take and load snapshots of the local storage and indexed DB using the `./snapshot-server` [mini-app](/snapshot-server/README.md). Check the `README.md` under this folder for more details.

#### Preview all icons
You can see all the available svg icons by calling the `showIconLibrary()` global function in the browser's console.

### Troubleshooting & Suggesting

If you find an issue with this app or wish something to be added, let the developers know in the [Soneta dev group](https://t.me/soneta_devs). Code-level bugs and pull requests are also welcome in the [repository issues](https://github.com/soneta-social/web/issues).

### Licensing

The source code is licensed under GPL v3. License is available [here](/LICENSE).

It is based on [Telegram Web K](https://github.com/morethanwords/tweb) by Eduard Kuzmenko, licensed under GPL v3 as well.
