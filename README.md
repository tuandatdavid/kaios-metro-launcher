# kaios-metro-launcher
credit to Affe Null (https://gitlab.com/affenull2345/kaios-metro-launcher)
adds ArrowLeft = system launcher (dialer) and ArrowRight = k-music and ArrowDown = fastcontact

# Custom launcher for KaiOS

This is a custom homescreen app for KaiOS. It can't dial phone numbers yet,
use Call Log and Contacts for that.

The user interface was designed to resemble that of the [cancelled Microsoft
Feature Phone](https://www.windowscentral.com/microsoft-feature-phone-rm-1182-windows), hence the name "metro".



Clock screen:
 - `Up`: Quick settings (2.5.2+)
 - `Down`: Contacts
 - `Right`: K-Music
 - `Left` : KaiOS Default Launcher
 - `Call`: Call log (doesn’t work for some reason on 2.5.4)
 - `Left Softkey`: Notifications
 - `Right Softkey`: Camera

App menu:
 - `Left Softkey`: Currently toggles between blue and black theme.

## To-Do (I ain't doing any of that)

 - Options menu
 - Moving/reordering apps
 - More themes
 - Dialing feature
 - Pinned Websites from system (currently just hadcoded to
   BananaHackers.net and the wiki which *does* work on KaiOS)

Feel free to submit a merge request if you want to implement something new!!

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
