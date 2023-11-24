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
import El, { Co } from '../component';
import './softkey.css';

export default class SoftKey extends Co {
  constructor(parent, lefth, centerh, righth) {
    super(parent);
    this.root = this.El('div', { className: 'softkey' }, [
      this.El('button', {
        className: 'softkey-btn softkey-left',
        onclick: this.click.bind(this, lefth),
        ref: el => this.left = el
      }),
      this.El('button', {
        className: 'softkey-btn softkey-center',
        onclick: this.click.bind(this, centerh),
        ref: el => this.center = el
      }),
      this.El('button', {
        className: 'softkey-btn softkey-right',
        onclick: this.click.bind(this, righth),
        ref: el => this.right = el
      })
    ]);
    let centerPressed = false;
    this.handleKeyDown = e => {
      switch(e.key){
        case 'SoftLeft':
          lefth(e);
          break;
        case 'Enter':
          centerPressed = true;
          break;
        case 'SoftRight':
          righth(e);
          break;
      }
    };
    this.handleKeyUp = e => {
      switch(e.key){
        case 'Enter':
          if(centerPressed){
            centerPressed = false;
            centerh(e);
          }
          break;
      }
    };
  }
  click(handler, ev) {
    if(ev.relatedTarget){
      // Revert focus back to previous blurring element
      ev.relatedTarget.focus();
    }
    else {
      // No previous focus target, blur instead
      ev.currentTarget.blur();
    }
    handler(ev);
  }
  set(l, c, r) {
    function set(el, cont){
      if('string' === typeof cont){
        el.textContent = cont;
      }
      else if('object' === typeof cont){
        el.innerHTML = '';
        el.appendChild(cont);
      }
    }
    set(this.left, l);
    set(this.center, c);
    set(this.right, r);
  }
  show() {
    super.show();
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }
  hide() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    super.hide();
  }
  static icon(name) {
    return El('span', { className: 'softkey-icon skico-' + name });
  }
}
