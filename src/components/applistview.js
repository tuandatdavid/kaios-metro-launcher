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
import { Co } from '../component';
import Grid from './grid';
import SoftKey from './softkey';
import setTheme from '../theme';
import './applistview.css';

export default class AppListView extends Co {
  constructor(backend, returnTo) {
    super(Co.viewroot);
    this.backend = backend;
    this.root = this.El('div', { className: 'vertical applistview panel' }, [
      this.El('div', {
        className: 'applist-header',
        ref: el => this.header = el
      }),
      el => this.grid = new Grid(el),
      el => this.sk = new SoftKey(el, ()=>{
        if(localStorage.theme !== 'orange')
          setTheme('orange');
        else
          setTheme('blue');
      }, ()=>{}, ()=>{})
    ]);
    // Since this is an animated panel, it's always in the DOM
    this.parent.appendChild(this.root);

    this.handleKeyDown = e => {
      switch(e.key){
        case 'Backspace':
        case 'EndCall':
          let animDone = () => {
            this.root.removeEventListener('transitionend', animDone);
            this.hide();
            returnTo.show();
          }
          this.root.addEventListener('transitionend', animDone);
          this.root.classList.remove('applistview-visible');
          break;
      }
    }
  }
  load() {
    return new Promise((resolve, reject) => {
      this.backend.getAppItems().then(apps => {
        for(const app of apps){
          this.grid.insert({
            icon: app.icon(52),
            color: app.color
          }, () => {
            this.header.textContent = app.name;
          }, () => {
            app.launch();
          });
        }
      });
      this.sk.set(SoftKey.icon('menu'), 'Open', '');
      resolve();
    }).catch(e => {
      alert('App list failed to load: ' + e);
    });
  }
  show() {
    this.showChildren();
    this.root.classList.add('applistview-visible');
    document.addEventListener('keydown', this.handleKeyDown);
    this.grid.focus();
  }
  hide() {
    this.hideChildren();
    document.removeEventListener('keydown', this.handleKeyDown);
    document.activeElement.blur();
  }
}
