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
const DEBUG = true;

class Co {
  constructor(parent) {
    this.parent = parent;
    this.root = null;
    this.subcomponents = [];
  }
  show() {
    if(DEBUG){
      console.log('<UI-Component> %cshow %c%s',
        'color: green; font-weight: bold;',
        'color: black; font-weight: bold;',
        this.constructor.name);
    }
    if(!this.root){
      console.warn('Showing component with no root element');
      return;
    }
    this.showChildren();
    this.parent.appendChild(this.root);
  }
  showChildren(){
    for(const component of this.subcomponents){
      component.show();
    }
  }
  hide() {
    if(DEBUG){
      console.log('<UI-Component> %chide %c%s',
        'color: gray; font-weight: bold;',
        'color: black; font-weight: bold;',
        this.constructor.name);
    }
    if(!this.root) return;
    this.parent.removeChild(this.root);
    this.hideChildren();
  }
  hideChildren() {
    for(const component of this.subcomponents){
      component.hide();
    }
  }
  clear() {
    if(this.root.parentNode) this.hide();
    this.subcomponents = [];
    this.root = null;
  }
  El(what, attr, children) {
    let el = document.createElement(what);
    Object.keys(attr).forEach(key => {
      if(key === 'ref'){
        if('function' === typeof attr[key]){
          attr[key](el);
        }
      }
      else {
        el[key] = attr[key];
      }
    });
    if(children){
      children.forEach(child => {
        if('function' === typeof child){
          // child is a function which creates a component
          if(this){
            // there is a parent component
            this.subcomponents.push(child(el));
          }
          else {
            // standalone element
            child(el).show();
          }
        }
        else {
          // assume child is a node
          el.appendChild(child);
        }
      });
    }
    return el;
  }
  static get viewroot() {
    return document.getElementById('root');
  }
}

export default function El(what, attr, children){
  return Co.prototype.El.call(null, what, attr, children);
}
export { Co }
