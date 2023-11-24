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
import './gridtile.css';

export default class GridTile extends Co {
  constructor(parent, obj, onselect, onclick, container){
    super(parent);
    this.cb = onselect;
    this.cont = container;
    this.root = this.El('div', {
      className: 'grid-tile'
    }, [
      this.El('button', {
        className: 'grid-tile-child',
        ref: bt => this.button = bt,
        onclick: () => {
          onclick();
        }
      }, [
        this.El('img', { ref: i => {
          if(obj.icon instanceof Promise) obj.icon.then(ico => {i.src = ico});
          else i.src = obj.icon;
        }})
      ])
    ]);
    if(obj.color) this.root.style.backgroundColor = obj.color;
  }
  focus() {
    this.cb();
    this.button.focus();
    const behavior = 'smooth';
    const rect = this.root.getBoundingClientRect();
    const crect = this.cont.getBoundingClientRect();
    if(rect.top-3 < crect.top){
      this.cont.scrollBy({
        top: rect.top-3 - crect.top,
        behavior
      });
      return;
    }
    if(crect.bottom < rect.bottom+3){
      this.cont.scrollBy({
        top: rect.bottom+3 - crect.bottom,
        behavior
      });
    }
  }
}
