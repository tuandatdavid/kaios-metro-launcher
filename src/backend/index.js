/*
 * Copyright (C) 2021 Affe Null <affenull2345@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import openURL from './popup';
import test1_icon_url from '../test1.png';
import test2_icon_url from '../test2.png';

function launchIAC(panel) {
  if(navigator.mozApps && 'function' === typeof navigator.mozApps.getSelf){
    var appRequest = navigator.mozApps.getSelf();
    appRequest.onsuccess = function(){
      let app = this.result;
      app.connect('launcher-panel').then(conns => {
        for(const conn of conns){
          conn.postMessage({ target: panel });
        }
      }).catch(e => {
        app.connect(panel).then(conns => {
          for(const conn of conns){
            conn.postMessage({});
          }
        });
      });
    }
  }
}

export default function getBackend() {
  // APPS
  let apps;
  let haveApps = navigator.mozApps && navigator.mozApps.mgmt &&
    'function' === typeof navigator.mozApps.mgmt.getAll;
  if(haveApps){
    apps = new Promise((resolve, reject) => {
      let req = navigator.mozApps.mgmt.getAll();
      req.onsuccess = function(){
        resolve(this.result);
      }
      req.onerror = function(){
        // Convert the DOMException to a human-readable error
        reject(new Error(this.error.name + ' ' + this.error.message));
      }
    }).catch(e => alert('Cannot request application list: ' + e));
  }
  else {
    //return Promise.reject('No application manager found!!!');
    apps = Promise.resolve([
      {
        manifestURL: 'app://testing-1.app',
        manifest: {
          name: 'Testing 1',
          theme_color: '#ff00c0',
        },
        _icon: test1_icon_url,
        launch: () => alert('Testing 1')
      },
      {
        manifestURL: 'app://testing-2.app',
        manifest: {
          name: 'Wrong Title',
          theme_color: '#000000',
          entry_points: {
            '.1': {
              name: 'Testing 2.1',
              theme_color: '#00c0ff'
            },
            '.2': {
              name: 'Testing 2.2',
              theme_color: '#ffc000'
            }
          },
        },
        _icon: test2_icon_url,
        launch: (ep) => alert('Testing 2' + ep)
      }
    ]);
  }

  // EXCEPTIONS
  //  - The system utility apps should all have the default color!
  const system_ui_apps = {
    'app://calendar.gaiamobile.org/manifest.webapp': true,
    'app://camera.gaiamobile.org/manifest.webapp': true,
    'app://clock.gaiamobile.org/manifest.webapp': true,
    'app://communications.gaiamobile.org/manifest.webapp#call_log': true,
    'app://contact.gaiamobile.org/manifest.webapp': true,
    'app://email.gaiamobile.org/manifest.webapp': true,
    'app://fm.gaiamobile.org/manifest.webapp': true,
    'app://gallery.gaiamobile.org/manifest.webapp': true,
    'app://music.gaiamobile.org/manifest.webapp': true,
    'app://search.gaiamobile.org/manifest.webapp': true,
    'app://settings.gaiamobile.org/manifest.webapp': true,
    'app://sms.gaiamobile.org/manifest.webapp': true,
    'app://video.gaiamobile.org/manifest.webapp': true,
    'app://calculator.gaiamobile.org/manifest.webapp': true,
    'app://notes.gaiamobile.org/manifest.webapp': true,
    'app://soundrecorder.gaiamobile.org/manifest.webapp': true,
    'app://unitconverter.gaiamobile.org/manifest.webapp': true,
  };
  const color_ignore = system_ui_apps;

  // BOOKMARKS
  // TODO Currently, this is a constant array. Should be dynamically loaded
  // from the system bookmark database
  let bookmarks = [
    {
      url: 'https://bananahackers.net',
      name: 'BananaHackers website',
      _icon: 'https://ivan-hc.github.io/bananahackers/3b2cea4941415cce67e0d9cf1e7f2e8a.jpg'
    },
    {
      url: 'https://wiki.bananahackers.net',
      name: 'BananaHackers wiki',
      _icon: 'https://wiki.bananahackers.net/sample-wiki-icon.png'
    }
  ];

  // BACKEND API
  class AppItem {}
  class MozAppItem extends AppItem {
    constructor(moz) {
      super();
      this.moz = moz;
    }
    icon(size) {
      return new Promise((resolve, reject) => {
        if(this.moz._icon) resolve(this.moz._icon);
        else {
          navigator.mozApps.mgmt.getIcon(this.moz, size).then(obj => {
            resolve(URL.createObjectURL(obj));
          });
        }
      });
    }
    launch() {
      this.moz.launch();
    }
    get id() {
      return this.moz.manifestURL;
    }
    get type() {
      return this.moz.type;
    }
    get name() {
      return this.moz.manifest.name;
    }
    get color() {
      if(!color_ignore[this.id])
        return this.moz.manifest.theme_color;
      else
        return undefined;
    }
  }
  class MozAppEntryPoint extends AppItem {
    constructor(moz, id) {
      super();
      this.moz = moz;
      this.ep = moz.manifest.entry_points[id];
      this.epid = id;
    }
    icon(size) {
      return new Promise((resolve, reject) => {
        if(this.moz._icon) resolve(this.moz._icon);
        else {
          navigator.mozApps.mgmt.getIcon(this.moz, size).then(obj => {
            resolve(URL.createObjectURL(obj));
          });
        }
      });
    }
    launch() {
      this.moz.launch(this.epid);
    }
    get id() {
      return this.moz.manifestURL + '#' + this.epid;
    }
    get type() {
      return this.moz.type;
    }
    get name() {
      return this.ep.name;
    }
    get color() {
      if(!color_ignore[this.id])
        return this.ep.theme_color;
      else
        return undefined;
    }
  }
  class BookmarkAppItem extends AppItem {
    constructor(bm) {
      super();
      for(let key in bm){
        this[key] = bm[key];
      }
    }
    icon(size) {
      return this._icon;
    }
    launch() {
      openURL(this.url);
    }
  }
  function filterApps(applist, showSystem){
    let ret = [];
    for(const app of applist){
      if(['system', 'theme', 'homescreen', 'input'].includes(app.manifest.role)
        && app.manifestURL !== 'app://homescreen.gaiamobile.org'
        && !showSystem)
      {
        continue;
      }
      if(app.manifest.entry_points){
        for(const epid in app.manifest.entry_points){
          ret.push(new MozAppEntryPoint(app, epid));
        }
      }
      else ret.push(new MozAppItem(app));
    }
    return ret;
  }
  return {
    getAppItems() {
      return apps.then(applist => {
        return Promise.resolve([].concat(
          filterApps(applist),
          bookmarks.map(bm => new BookmarkAppItem(bm))
        ));
        // TODO: sort
      });
    },
    launchApp(id) {
      // This can also open bookmarks
      apps.then(applist => {
        for(const app of filterApps(applist, true)){
          if(app.id === id) app.launch();
        }
      });
    },
    launchIAC
  };
}
