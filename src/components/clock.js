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
import './clock.css';

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

export default class Clock extends Co {
  constructor(parent) {
    super(parent);
    this.root = this.El('div', { className: 'clock' }, [
      this.El('span', {
        textContent: '0',
        className: 'clock-dig',
        ref: el => this.d1 = el
      }),
      this.El('span', {
        textContent: '0',
        className: 'clock-dig',
        ref: el => this.d2 = el
      }),
      this.El('span', { className: 'clock-colon' }),
      this.El('span', {
        textContent: '0',
        className: 'clock-dig',
        ref: el => this.d3 = el
      }),
      this.El('span', {
        textContent: '0',
        className: 'clock-dig',
        ref: el => this.d4 = el
      }),
      this.El('div', {
        textContent: '',
        className: 'clock-date',
        ref: el => this.date = el
      })
    ]);
    this.updateInterval = null;
    this.lastHours = 0;
    this.lastMinutes = 0;
  }
  updateClock(){
    let d = new Date();
    let hr = d.getHours();
    let mi = d.getMinutes();
    if(this.lastHours === hr && this.lastMinutes === mi){
      // If the phone sleeps for a multiple of one day, the time
      // will be the same but the date will have changed.
      // If this happens (which is very unlikely), the date display will
      // be invalid.
      return;
    }
    this.date.textContent =
      weekdays[d.getDay()] + ', ' + d.toLocaleDateString();
    this.lastHours = hr;
    this.lastMinutes = mi;
    let hr1 = Math.floor(hr / 10);
    let hr2 = hr % 10;
    let mi1 = Math.floor(mi / 10);
    let mi2 = mi % 10;
    this.d1.textContent = hr1;
    this.d2.textContent = hr2;
    this.d3.textContent = mi1;
    this.d4.textContent = mi2;
  }
  show() {
    super.show();
    console.log('<Clock> Starting clock update');
    this.updateInterval = setInterval(() => {
      this.updateClock();
    }, 1000);
  }
  hide() {
    super.hide();
    console.log('<Clock> Stopping clock update');
    clearInterval(this.updateInterval);
    this.updateInterval = null;
  }
}
