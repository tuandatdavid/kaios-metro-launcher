# kaios-metro-launcher
The kinda lightweight launcher with blue metro style option

Credit to [Affe Null](https://gitlab.com/affenull2345/kaios-metro-launcher). He's a genius



Adds ArrowLeft = system launcher (dialer) and ArrowRight = k-music and ArrowDown = fastcontact

# Custom launcher for KaiOS

This is a custom homescreen app for KaiOS. It can't dial phone numbers yet,
use Fastlog and Fastcontact for that.

The user interface was designed to resemble that of the [cancelled Microsoft
Feature Phone](https://www.windowscentral.com/microsoft-feature-phone-rm-1182-windows), hence the name "metro". 



Clock screen:
 - `Up`: Quick settings (2.5.2+)
 - `Down`: Fastcontact
 - `Right`: K-Music
 - `Left` : KaiOS Default Launcher
 - `Call`: Fastlog (fastlog doesn't work for me on 2.5.4)
 - `Left Softkey`: Notifications
 - `Right Softkey`: Camera

App menu:
 - `Left Softkey`: Currently toggles between blue and black theme.

## To-Do 

 - Some UI stuff
 - Dialer

Feel free to submit a merge request if you want to implement something new!! Help would be appreciated, I don't know javascript

## Build

For a production build:
```
yarn
yarn build:prod
```

For a development build:
```
yarn
yarn build:dev
```

## Install

Sideload the app, then go to 'Device Settings' in WebIDE and change the
`homescreen.manifestURL` setting to `app://launcher.km/manifest.webapp`.
Restart the phone if needed.
