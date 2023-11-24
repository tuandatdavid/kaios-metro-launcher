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
import GridTile from './gridtile.js';
import './grid.css';

export default class Grid extends Co {
  constructor(parent){
    super(parent);
    this.root = this.El('div', { className: 'grid' });
    this.rows = [];
    this.x = 0;
    this.y = 0;
    this.handleKeyDown = e => {
      if(!(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)))
        return;
      if(this.rows.length < 1) return;
      let x = this.x, y = this.y;

      if(y < 0){
        y = this.rows.length - 1;
      }
      if(y >= this.rows.length){
        y = 0;
      }

      switch(e.key){
        case 'ArrowUp':
          y--;
          break;
        case 'ArrowDown':
          y++;
          break;
        case 'ArrowLeft':
          x--;
          break;
        case 'ArrowRight':
          x++;
          break;
      }
      if(x !== this.x){
        if(x >= this.rows[y].tiles.length){
          y++;
          x = 0;
        }
        if(x < 0){
          y--;
        }
      }
      if(y < 0){
        y = this.rows.length - 1;
      }
      if(y >= this.rows.length){
        y = 0;
      }
      if(x < 0 || x >= this.rows[y].tiles.length){
        x = this.rows[y].tiles.length - 1;
      }

      console.log('<Grid> Focus %d, %d', x, y);
      this.rows[y].tiles[x].focus();
      this.y = y;
      this.x = x;
    }
  }
  clear() {
    this.rows.forEach(({tiles, el}) => {
      tiles.forEach(tile => {
        tile.hide();
      });
      el.remove();
    });
    this.rows = [];
    this.x = 0;
    this.y = 0;
  }
  insert(obj, onselect, onclick) {
    let rownum = this.rows.length - 1;
    let row;
    if(rownum < 0 || this.rows[rownum].tiles.length >= 3){
      row = this.El('div', { className: 'grid-row' });
      this.root.appendChild(row);
      this.rows.push({el: row, tiles: []});
      rownum++;
    }
    if(!row) row = this.rows[rownum].el;
    let tile =
      new GridTile(row, obj, onselect, onclick, this.root);
    this.rows[rownum].tiles.push(tile);
    tile.show();
  }
  show() {
    super.show();
    document.addEventListener('keydown', this.handleKeyDown);
  }
  focus() {
    this.x = this.y = 0;
    if(this.rows[0] && this.rows[0].tiles[0])
      this.rows[0].tiles[0].focus();
  }
  hide() {
    super.hide();
    document.removeEventListener('keydown', this.handleKeyDown);
  }
}
