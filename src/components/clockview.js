/*
 * Copyright (C) 2021 Affe Null <affenull2345@gmail.com>
 * Modified by NOkiapapir, who cant do anything, just copypaste
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
import { Co } from '../component';
import SoftKey from './softkey';
import Clock from './clock';

export default class ClockView extends Co {
  constructor(backend) {
    super(Co.viewroot);
    this.backend = backend;
    this.root = this.El('div', { className: 'vertical panel' }, [
      el => this.clock = new Clock(el),
      el => this.sk = new SoftKey(el, ()=>{
        backend.launchIAC('notice');
      }, ()=>{
        this.hide();
        this.appview.show();
      }, ()=>{
        backend.launchApp('app://camera.gaiamobile.org/manifest.webapp');
      })
    ]);
    this.handleKeyDown = e => {
      switch(e.key){
        case 'ArrowUp':
          backend.launchIAC('instant-settings');
          break;
        case 'ArrowDown':
          backend.launchApp('app://fastcontact.bananahackers.net/manifest.webapp');
          break;
        case 'Call':
          backend.launchApp('app://fastlog.bananahackers.net/manifest.webapp');
          break;
	case 'ArrowLeft':
	backend.launchApp('app://launcher.gaiamobile.org/manifest.webapp');
	break;
	case 'ArrowRight':
	backend.launchApp('app://kaimusic.arma7x.com/manifest.webapp');
	;
        }
    };
  }
  load() {
    return new Promise((resolve, reject) => {
      this.sk.set('Notices', 'Menu', 'Camera');
      import('./applistview').then(AppListView => {
        this.appview = new AppListView.default(this.backend, this);
        this.appview.load(); // Background
        resolve();
      });
    });
  }
  show() {
    super.show();
    document.addEventListener('keydown', this.handleKeyDown);
  }
  hide() {
    document.removeEventListener('keydown', this.handleKeyDown);
    super.hide();
  }
}
