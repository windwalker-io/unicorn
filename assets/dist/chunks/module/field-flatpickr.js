import flatpickr from "flatpickr";
import { i as injectCssToDocument } from "../service/dom.js";
import { a as useImport, u as useCssImport } from "../service/loader.js";
const css = `.flatpickr-calendar {
  background: transparent;
  opacity: 0;
  display: none;
  text-align: center;
  visibility: hidden;
  padding: 0;
  -webkit-animation: none;
          animation: none;
  direction: ltr;
  border: 0;
  font-size: 14px;
  line-height: 24px;
  border-radius: 5px;
  position: absolute;
  width: 307.875px;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  -ms-touch-action: manipulation;
      touch-action: manipulation;
  background: #fff;
  -webkit-box-shadow: 1px 0 0 #e6e6e6, -1px 0 0 #e6e6e6, 0 1px 0 #e6e6e6, 0 -1px 0 #e6e6e6, 0 3px 13px rgba(0,0,0,0.08);
          box-shadow: 1px 0 0 #e6e6e6, -1px 0 0 #e6e6e6, 0 1px 0 #e6e6e6, 0 -1px 0 #e6e6e6, 0 3px 13px rgba(0,0,0,0.08);
}
.flatpickr-calendar.open,
.flatpickr-calendar.inline {
  opacity: 1;
  max-height: 640px;
  visibility: visible;
}
.flatpickr-calendar.open {
  display: inline-block;
  z-index: 99999;
}
.flatpickr-calendar.animate.open {
  -webkit-animation: fpFadeInDown 300ms cubic-bezier(0.23, 1, 0.32, 1);
          animation: fpFadeInDown 300ms cubic-bezier(0.23, 1, 0.32, 1);
}
.flatpickr-calendar.inline {
  display: block;
  position: relative;
  top: 2px;
}
.flatpickr-calendar.static {
  position: absolute;
  top: calc(100% + 2px);
}
.flatpickr-calendar.static.open {
  z-index: 999;
  display: block;
}
.flatpickr-calendar.multiMonth .flatpickr-days .dayContainer:nth-child(n+1) .flatpickr-day.inRange:nth-child(7n+7) {
  -webkit-box-shadow: none !important;
          box-shadow: none !important;
}
.flatpickr-calendar.multiMonth .flatpickr-days .dayContainer:nth-child(n+2) .flatpickr-day.inRange:nth-child(7n+1) {
  -webkit-box-shadow: -2px 0 0 #e6e6e6, 5px 0 0 #e6e6e6;
          box-shadow: -2px 0 0 #e6e6e6, 5px 0 0 #e6e6e6;
}
.flatpickr-calendar .hasWeeks .dayContainer,
.flatpickr-calendar .hasTime .dayContainer {
  border-bottom: 0;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.flatpickr-calendar .hasWeeks .dayContainer {
  border-left: 0;
}
.flatpickr-calendar.hasTime .flatpickr-time {
  height: 40px;
  border-top: 1px solid #e6e6e6;
}
.flatpickr-calendar.noCalendar.hasTime .flatpickr-time {
  height: auto;
}
.flatpickr-calendar:before,
.flatpickr-calendar:after {
  position: absolute;
  display: block;
  pointer-events: none;
  border: solid transparent;
  content: '';
  height: 0;
  width: 0;
  left: 22px;
}
.flatpickr-calendar.rightMost:before,
.flatpickr-calendar.arrowRight:before,
.flatpickr-calendar.rightMost:after,
.flatpickr-calendar.arrowRight:after {
  left: auto;
  right: 22px;
}
.flatpickr-calendar.arrowCenter:before,
.flatpickr-calendar.arrowCenter:after {
  left: 50%;
  right: 50%;
}
.flatpickr-calendar:before {
  border-width: 5px;
  margin: 0 -5px;
}
.flatpickr-calendar:after {
  border-width: 4px;
  margin: 0 -4px;
}
.flatpickr-calendar.arrowTop:before,
.flatpickr-calendar.arrowTop:after {
  bottom: 100%;
}
.flatpickr-calendar.arrowTop:before {
  border-bottom-color: #e6e6e6;
}
.flatpickr-calendar.arrowTop:after {
  border-bottom-color: #fff;
}
.flatpickr-calendar.arrowBottom:before,
.flatpickr-calendar.arrowBottom:after {
  top: 100%;
}
.flatpickr-calendar.arrowBottom:before {
  border-top-color: #e6e6e6;
}
.flatpickr-calendar.arrowBottom:after {
  border-top-color: #fff;
}
.flatpickr-calendar:focus {
  outline: 0;
}
.flatpickr-wrapper {
  position: relative;
  display: inline-block;
}
.flatpickr-months {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.flatpickr-months .flatpickr-month {
  background: transparent;
  color: rgba(0,0,0,0.9);
  fill: rgba(0,0,0,0.9);
  height: 34px;
  line-height: 1;
  text-align: center;
  position: relative;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
  overflow: hidden;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
      -ms-flex: 1;
          flex: 1;
}
.flatpickr-months .flatpickr-prev-month,
.flatpickr-months .flatpickr-next-month {
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
  text-decoration: none;
  cursor: pointer;
  position: absolute;
  top: 0;
  height: 34px;
  padding: 10px;
  z-index: 3;
  color: rgba(0,0,0,0.9);
  fill: rgba(0,0,0,0.9);
}
.flatpickr-months .flatpickr-prev-month.flatpickr-disabled,
.flatpickr-months .flatpickr-next-month.flatpickr-disabled {
  display: none;
}
.flatpickr-months .flatpickr-prev-month i,
.flatpickr-months .flatpickr-next-month i {
  position: relative;
}
.flatpickr-months .flatpickr-prev-month.flatpickr-prev-month,
.flatpickr-months .flatpickr-next-month.flatpickr-prev-month {
/*
      /*rtl:begin:ignore*/
/*
      */
  left: 0;
/*
      /*rtl:end:ignore*/
/*
      */
}
/*
      /*rtl:begin:ignore*/
/*
      /*rtl:end:ignore*/
.flatpickr-months .flatpickr-prev-month.flatpickr-next-month,
.flatpickr-months .flatpickr-next-month.flatpickr-next-month {
/*
      /*rtl:begin:ignore*/
/*
      */
  right: 0;
/*
      /*rtl:end:ignore*/
/*
      */
}
/*
      /*rtl:begin:ignore*/
/*
      /*rtl:end:ignore*/
.flatpickr-months .flatpickr-prev-month:hover,
.flatpickr-months .flatpickr-next-month:hover {
  color: #959ea9;
}
.flatpickr-months .flatpickr-prev-month:hover svg,
.flatpickr-months .flatpickr-next-month:hover svg {
  fill: #f64747;
}
.flatpickr-months .flatpickr-prev-month svg,
.flatpickr-months .flatpickr-next-month svg {
  width: 14px;
  height: 14px;
}
.flatpickr-months .flatpickr-prev-month svg path,
.flatpickr-months .flatpickr-next-month svg path {
  -webkit-transition: fill 0.1s;
  transition: fill 0.1s;
  fill: inherit;
}
.numInputWrapper {
  position: relative;
  height: auto;
}
.numInputWrapper input,
.numInputWrapper span {
  display: inline-block;
}
.numInputWrapper input {
  width: 100%;
}
.numInputWrapper input::-ms-clear {
  display: none;
}
.numInputWrapper input::-webkit-outer-spin-button,
.numInputWrapper input::-webkit-inner-spin-button {
  margin: 0;
  -webkit-appearance: none;
}
.numInputWrapper span {
  position: absolute;
  right: 0;
  width: 14px;
  padding: 0 4px 0 2px;
  height: 50%;
  line-height: 50%;
  opacity: 0;
  cursor: pointer;
  border: 1px solid rgba(57,57,57,0.15);
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
}
.numInputWrapper span:hover {
  background: rgba(0,0,0,0.1);
}
.numInputWrapper span:active {
  background: rgba(0,0,0,0.2);
}
.numInputWrapper span:after {
  display: block;
  content: "";
  position: absolute;
}
.numInputWrapper span.arrowUp {
  top: 0;
  border-bottom: 0;
}
.numInputWrapper span.arrowUp:after {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid rgba(57,57,57,0.6);
  top: 26%;
}
.numInputWrapper span.arrowDown {
  top: 50%;
}
.numInputWrapper span.arrowDown:after {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid rgba(57,57,57,0.6);
  top: 40%;
}
.numInputWrapper span svg {
  width: inherit;
  height: auto;
}
.numInputWrapper span svg path {
  fill: rgba(0,0,0,0.5);
}
.numInputWrapper:hover {
  background: rgba(0,0,0,0.05);
}
.numInputWrapper:hover span {
  opacity: 1;
}
.flatpickr-current-month {
  font-size: 135%;
  line-height: inherit;
  font-weight: 300;
  color: inherit;
  position: absolute;
  width: 75%;
  left: 12.5%;
  padding: 7.48px 0 0 0;
  line-height: 1;
  height: 34px;
  display: inline-block;
  text-align: center;
  -webkit-transform: translate3d(0px, 0px, 0px);
          transform: translate3d(0px, 0px, 0px);
}
.flatpickr-current-month span.cur-month {
  font-family: inherit;
  font-weight: 700;
  color: inherit;
  display: inline-block;
  margin-left: 0.5ch;
  padding: 0;
}
.flatpickr-current-month span.cur-month:hover {
  background: rgba(0,0,0,0.05);
}
.flatpickr-current-month .numInputWrapper {
  width: 6ch;
  width: 7ch\\0;
  display: inline-block;
}
.flatpickr-current-month .numInputWrapper span.arrowUp:after {
  border-bottom-color: rgba(0,0,0,0.9);
}
.flatpickr-current-month .numInputWrapper span.arrowDown:after {
  border-top-color: rgba(0,0,0,0.9);
}
.flatpickr-current-month input.cur-year {
  background: transparent;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  color: inherit;
  cursor: text;
  padding: 0 0 0 0.5ch;
  margin: 0;
  display: inline-block;
  font-size: inherit;
  font-family: inherit;
  font-weight: 300;
  line-height: inherit;
  height: auto;
  border: 0;
  border-radius: 0;
  vertical-align: initial;
  -webkit-appearance: textfield;
  -moz-appearance: textfield;
  appearance: textfield;
}
.flatpickr-current-month input.cur-year:focus {
  outline: 0;
}
.flatpickr-current-month input.cur-year[disabled],
.flatpickr-current-month input.cur-year[disabled]:hover {
  font-size: 100%;
  color: rgba(0,0,0,0.5);
  background: transparent;
  pointer-events: none;
}
.flatpickr-current-month .flatpickr-monthDropdown-months {
  appearance: menulist;
  background: transparent;
  border: none;
  border-radius: 0;
  box-sizing: border-box;
  color: inherit;
  cursor: pointer;
  font-size: inherit;
  font-family: inherit;
  font-weight: 300;
  height: auto;
  line-height: inherit;
  margin: -1px 0 0 0;
  outline: none;
  padding: 0 0 0 0.5ch;
  position: relative;
  vertical-align: initial;
  -webkit-box-sizing: border-box;
  -webkit-appearance: menulist;
  -moz-appearance: menulist;
  width: auto;
}
.flatpickr-current-month .flatpickr-monthDropdown-months:focus,
.flatpickr-current-month .flatpickr-monthDropdown-months:active {
  outline: none;
}
.flatpickr-current-month .flatpickr-monthDropdown-months:hover {
  background: rgba(0,0,0,0.05);
}
.flatpickr-current-month .flatpickr-monthDropdown-months .flatpickr-monthDropdown-month {
  background-color: transparent;
  outline: none;
  padding: 0;
}
.flatpickr-weekdays {
  background: transparent;
  text-align: center;
  overflow: hidden;
  width: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
      -ms-flex-align: center;
          align-items: center;
  height: 28px;
}
.flatpickr-weekdays .flatpickr-weekdaycontainer {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
      -ms-flex: 1;
          flex: 1;
}
span.flatpickr-weekday {
  cursor: default;
  font-size: 90%;
  background: transparent;
  color: rgba(0,0,0,0.54);
  line-height: 1;
  margin: 0;
  text-align: center;
  display: block;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
      -ms-flex: 1;
          flex: 1;
  font-weight: bolder;
}
.dayContainer,
.flatpickr-weeks {
  padding: 1px 0 0 0;
}
.flatpickr-days {
  position: relative;
  overflow: hidden;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: start;
  -webkit-align-items: flex-start;
      -ms-flex-align: start;
          align-items: flex-start;
  width: 307.875px;
}
.flatpickr-days:focus {
  outline: 0;
}
.dayContainer {
  padding: 0;
  outline: 0;
  text-align: left;
  width: 307.875px;
  min-width: 307.875px;
  max-width: 307.875px;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  display: inline-block;
  display: -ms-flexbox;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-flex-wrap: wrap;
          flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  -ms-flex-pack: justify;
  -webkit-justify-content: space-around;
          justify-content: space-around;
  -webkit-transform: translate3d(0px, 0px, 0px);
          transform: translate3d(0px, 0px, 0px);
  opacity: 1;
}
.dayContainer + .dayContainer {
  -webkit-box-shadow: -1px 0 0 #e6e6e6;
          box-shadow: -1px 0 0 #e6e6e6;
}
.flatpickr-day {
  background: none;
  border: 1px solid transparent;
  border-radius: 150px;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  color: #393939;
  cursor: pointer;
  font-weight: 400;
  width: 14.2857143%;
  -webkit-flex-basis: 14.2857143%;
      -ms-flex-preferred-size: 14.2857143%;
          flex-basis: 14.2857143%;
  max-width: 39px;
  height: 39px;
  line-height: 39px;
  margin: 0;
  display: inline-block;
  position: relative;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
      -ms-flex-pack: center;
          justify-content: center;
  text-align: center;
}
.flatpickr-day.inRange,
.flatpickr-day.prevMonthDay.inRange,
.flatpickr-day.nextMonthDay.inRange,
.flatpickr-day.today.inRange,
.flatpickr-day.prevMonthDay.today.inRange,
.flatpickr-day.nextMonthDay.today.inRange,
.flatpickr-day:hover,
.flatpickr-day.prevMonthDay:hover,
.flatpickr-day.nextMonthDay:hover,
.flatpickr-day:focus,
.flatpickr-day.prevMonthDay:focus,
.flatpickr-day.nextMonthDay:focus {
  cursor: pointer;
  outline: 0;
  background: #e6e6e6;
  border-color: #e6e6e6;
}
.flatpickr-day.today {
  border-color: #959ea9;
}
.flatpickr-day.today:hover,
.flatpickr-day.today:focus {
  border-color: #959ea9;
  background: #959ea9;
  color: #fff;
}
.flatpickr-day.selected,
.flatpickr-day.startRange,
.flatpickr-day.endRange,
.flatpickr-day.selected.inRange,
.flatpickr-day.startRange.inRange,
.flatpickr-day.endRange.inRange,
.flatpickr-day.selected:focus,
.flatpickr-day.startRange:focus,
.flatpickr-day.endRange:focus,
.flatpickr-day.selected:hover,
.flatpickr-day.startRange:hover,
.flatpickr-day.endRange:hover,
.flatpickr-day.selected.prevMonthDay,
.flatpickr-day.startRange.prevMonthDay,
.flatpickr-day.endRange.prevMonthDay,
.flatpickr-day.selected.nextMonthDay,
.flatpickr-day.startRange.nextMonthDay,
.flatpickr-day.endRange.nextMonthDay {
  background: #569ff7;
  -webkit-box-shadow: none;
          box-shadow: none;
  color: #fff;
  border-color: #569ff7;
}
.flatpickr-day.selected.startRange,
.flatpickr-day.startRange.startRange,
.flatpickr-day.endRange.startRange {
  border-radius: 50px 0 0 50px;
}
.flatpickr-day.selected.endRange,
.flatpickr-day.startRange.endRange,
.flatpickr-day.endRange.endRange {
  border-radius: 0 50px 50px 0;
}
.flatpickr-day.selected.startRange + .endRange:not(:nth-child(7n+1)),
.flatpickr-day.startRange.startRange + .endRange:not(:nth-child(7n+1)),
.flatpickr-day.endRange.startRange + .endRange:not(:nth-child(7n+1)) {
  -webkit-box-shadow: -10px 0 0 #569ff7;
          box-shadow: -10px 0 0 #569ff7;
}
.flatpickr-day.selected.startRange.endRange,
.flatpickr-day.startRange.startRange.endRange,
.flatpickr-day.endRange.startRange.endRange {
  border-radius: 50px;
}
.flatpickr-day.inRange {
  border-radius: 0;
  -webkit-box-shadow: -5px 0 0 #e6e6e6, 5px 0 0 #e6e6e6;
          box-shadow: -5px 0 0 #e6e6e6, 5px 0 0 #e6e6e6;
}
.flatpickr-day.flatpickr-disabled,
.flatpickr-day.flatpickr-disabled:hover,
.flatpickr-day.prevMonthDay,
.flatpickr-day.nextMonthDay,
.flatpickr-day.notAllowed,
.flatpickr-day.notAllowed.prevMonthDay,
.flatpickr-day.notAllowed.nextMonthDay {
  color: rgba(57,57,57,0.3);
  background: transparent;
  border-color: transparent;
  cursor: default;
}
.flatpickr-day.flatpickr-disabled,
.flatpickr-day.flatpickr-disabled:hover {
  cursor: not-allowed;
  color: rgba(57,57,57,0.1);
}
.flatpickr-day.week.selected {
  border-radius: 0;
  -webkit-box-shadow: -5px 0 0 #569ff7, 5px 0 0 #569ff7;
          box-shadow: -5px 0 0 #569ff7, 5px 0 0 #569ff7;
}
.flatpickr-day.hidden {
  visibility: hidden;
}
.rangeMode .flatpickr-day {
  margin-top: 1px;
}
.flatpickr-weekwrapper {
  float: left;
}
.flatpickr-weekwrapper .flatpickr-weeks {
  padding: 0 12px;
  -webkit-box-shadow: 1px 0 0 #e6e6e6;
          box-shadow: 1px 0 0 #e6e6e6;
}
.flatpickr-weekwrapper .flatpickr-weekday {
  float: none;
  width: 100%;
  line-height: 28px;
}
.flatpickr-weekwrapper span.flatpickr-day,
.flatpickr-weekwrapper span.flatpickr-day:hover {
  display: block;
  width: 100%;
  max-width: none;
  color: rgba(57,57,57,0.3);
  background: transparent;
  cursor: default;
  border: none;
}
.flatpickr-innerContainer {
  display: block;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  overflow: hidden;
}
.flatpickr-rContainer {
  display: inline-block;
  padding: 0;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
}
.flatpickr-time {
  text-align: center;
  outline: 0;
  display: block;
  height: 0;
  line-height: 40px;
  max-height: 40px;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  overflow: hidden;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.flatpickr-time:after {
  content: "";
  display: table;
  clear: both;
}
.flatpickr-time .numInputWrapper {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
      -ms-flex: 1;
          flex: 1;
  width: 40%;
  height: 40px;
  float: left;
}
.flatpickr-time .numInputWrapper span.arrowUp:after {
  border-bottom-color: #393939;
}
.flatpickr-time .numInputWrapper span.arrowDown:after {
  border-top-color: #393939;
}
.flatpickr-time.hasSeconds .numInputWrapper {
  width: 26%;
}
.flatpickr-time.time24hr .numInputWrapper {
  width: 49%;
}
.flatpickr-time input {
  background: transparent;
  -webkit-box-shadow: none;
          box-shadow: none;
  border: 0;
  border-radius: 0;
  text-align: center;
  margin: 0;
  padding: 0;
  height: inherit;
  line-height: inherit;
  color: #393939;
  font-size: 14px;
  position: relative;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  -webkit-appearance: textfield;
  -moz-appearance: textfield;
  appearance: textfield;
}
.flatpickr-time input.flatpickr-hour {
  font-weight: bold;
}
.flatpickr-time input.flatpickr-minute,
.flatpickr-time input.flatpickr-second {
  font-weight: 400;
}
.flatpickr-time input:focus {
  outline: 0;
  border: 0;
}
.flatpickr-time .flatpickr-time-separator,
.flatpickr-time .flatpickr-am-pm {
  height: inherit;
  float: left;
  line-height: inherit;
  color: #393939;
  font-weight: bold;
  width: 2%;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
  -webkit-align-self: center;
      -ms-flex-item-align: center;
          align-self: center;
}
.flatpickr-time .flatpickr-am-pm {
  outline: 0;
  width: 18%;
  cursor: pointer;
  text-align: center;
  font-weight: 400;
}
.flatpickr-time input:hover,
.flatpickr-time .flatpickr-am-pm:hover,
.flatpickr-time input:focus,
.flatpickr-time .flatpickr-am-pm:focus {
  background: #eee;
}
.flatpickr-input[readonly] {
  cursor: pointer;
}
@-webkit-keyframes fpFadeInDown {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, -20px, 0);
            transform: translate3d(0, -20px, 0);
  }
  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
  }
}
@keyframes fpFadeInDown {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, -20px, 0);
            transform: translate3d(0, -20px, 0);
  }
  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
  }
}
`;
/* @__PURE__ */ injectCssToDocument(css);
class FlatpickrElement extends HTMLElement {
  static get is() {
    return "uni-flatpickr";
  }
  instance;
  constructor() {
    super();
  }
  get selector() {
    return this.getAttribute("selector") || "input";
  }
  get locale() {
    return this.getAttribute("locale") || "";
  }
  // todo: Currently not support single option attributes
  getOptions() {
    const options = {};
    const ignore = [
      "selector"
    ];
    this.getAttributeNames().forEach((name) => {
      if (ignore.indexOf(name) !== -1) {
        return;
      }
      options[name] = this.getAttribute(name);
    });
    return options;
  }
  get $input() {
    return this.querySelector("input");
  }
  async connectedCallback() {
    let options = JSON.parse(this.getAttribute("options") || "{}") || {};
    options.autoFillDefaultTime = true;
    const now = /* @__PURE__ */ new Date();
    options.defaultHour = now.getHours();
    options.defaultMinute = now.getMinutes();
    options.defaultSeconds = now.getSeconds();
    options = await this.handleOptions(options);
    this.instance = flatpickr(
      this.querySelector(this.selector),
      options
    );
    this.instance.config.onOpen.push(() => {
      if (this.instance.input.value === "") {
        const now2 = /* @__PURE__ */ new Date();
        this.instance.jumpToDate(now2);
        this.instance.config.defaultHour = now2.getHours();
        this.instance.config.defaultMinute = now2.getMinutes();
        this.instance.config.defaultSeconds = now2.getSeconds();
      }
    });
    this.querySelector("[data-toggle]")?.addEventListener("click", () => {
      setTimeout(() => {
        this.querySelector("[data-input]")?.focus();
      }, 0);
    });
  }
  async handleOptions(options) {
    options.plugins = options.plugins || [];
    await Promise.all([
      this.handleLocale(options),
      this.handleMonthSelect(options)
    ]);
    return options;
  }
  async handleLocale(options) {
    if (this.locale) {
      await useImport(`flatpickr/dist/l10n/${this.locale}.js`);
      options.locale = this.locale.replace(/-/, "_");
    }
    return options;
  }
  async handleMonthSelect(options) {
    if (options.monthSelect) {
      useCssImport("flatpickr/dist/plugins/monthSelect/style.css");
      const { default: monthSelect } = await import("../index.js").then((n) => n.i);
      if (typeof options.monthSelect === "boolean") {
        options.monthSelect = {
          shorthand: true,
          dateFormat: "Y-m",
          altFormat: "Y-m"
        };
      }
      options.plugins.push(monthSelect(options.monthSelect));
    }
    return options;
  }
  getInstance() {
    return this.instance;
  }
}
/* @__PURE__ */ customElements.define(/* @__PURE__ */ (() => FlatpickrElement.is)(), FlatpickrElement);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQtZmxhdHBpY2tyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbW9kdWxlL2ZpZWxkLWZsYXRwaWNrci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VDc3NJbXBvcnQsIHVzZUltcG9ydCwgaW5qZWN0Q3NzVG9Eb2N1bWVudCB9IGZyb20gJy4uL3NlcnZpY2UnO1xyXG5pbXBvcnQgZmxhdHBpY2tyIGZyb20gJ2ZsYXRwaWNrcic7XHJcbmltcG9ydCBjc3MgZnJvbSAnZmxhdHBpY2tyL2Rpc3QvZmxhdHBpY2tyLmNzcz9pbmxpbmUnO1xyXG5cclxuaW5qZWN0Q3NzVG9Eb2N1bWVudChjc3MpO1xyXG5cclxuY2xhc3MgRmxhdHBpY2tyRWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcclxuICBzdGF0aWMgZ2V0IGlzKCkge1xyXG4gICAgcmV0dXJuICd1bmktZmxhdHBpY2tyJztcclxuICB9XHJcblxyXG4gIGluc3RhbmNlITogZmxhdHBpY2tyLkluc3RhbmNlO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgfVxyXG5cclxuICBnZXQgc2VsZWN0b3IoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoJ3NlbGVjdG9yJykgfHwgJ2lucHV0JztcclxuICB9XHJcblxyXG4gIGdldCBsb2NhbGUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoJ2xvY2FsZScpIHx8ICcnO1xyXG4gIH1cclxuXHJcbiAgLy8gdG9kbzogQ3VycmVudGx5IG5vdCBzdXBwb3J0IHNpbmdsZSBvcHRpb24gYXR0cmlidXRlc1xyXG4gIGdldE9wdGlvbnMoKSB7XHJcbiAgICBjb25zdCBvcHRpb25zOiBhbnkgPSB7fTtcclxuICAgIGNvbnN0IGlnbm9yZSA9IFtcclxuICAgICAgJ3NlbGVjdG9yJ1xyXG4gICAgXTtcclxuXHJcbiAgICB0aGlzLmdldEF0dHJpYnV0ZU5hbWVzKCkuZm9yRWFjaCgobmFtZSkgPT4ge1xyXG4gICAgICBpZiAoaWdub3JlLmluZGV4T2YobmFtZSkgIT09IC0xKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBvcHRpb25zW25hbWVdID0gdGhpcy5nZXRBdHRyaWJ1dGUobmFtZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gb3B0aW9ucztcclxuICB9XHJcblxyXG4gIGdldCAkaW5wdXQoKTogSFRNTElucHV0RWxlbWVudCB7XHJcbiAgICByZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yPEhUTUxJbnB1dEVsZW1lbnQ+KCdpbnB1dCcpITtcclxuICB9XHJcblxyXG4gIGFzeW5jIGNvbm5lY3RlZENhbGxiYWNrKCkge1xyXG4gICAgbGV0IG9wdGlvbnM6IGZsYXRwaWNrci5PcHRpb25zLk9wdGlvbnMgPSBKU09OLnBhcnNlKHRoaXMuZ2V0QXR0cmlidXRlKCdvcHRpb25zJykgfHwgJ3t9JykgfHwge307XHJcblxyXG4gICAgb3B0aW9ucy5hdXRvRmlsbERlZmF1bHRUaW1lID0gdHJ1ZTtcclxuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgICBvcHRpb25zLmRlZmF1bHRIb3VyID0gbm93LmdldEhvdXJzKCk7XHJcbiAgICBvcHRpb25zLmRlZmF1bHRNaW51dGUgPSBub3cuZ2V0TWludXRlcygpO1xyXG4gICAgb3B0aW9ucy5kZWZhdWx0U2Vjb25kcyA9IG5vdy5nZXRTZWNvbmRzKCk7XHJcblxyXG4gICAgb3B0aW9ucyA9IGF3YWl0IHRoaXMuaGFuZGxlT3B0aW9ucyhvcHRpb25zKTtcclxuXHJcbiAgICB0aGlzLmluc3RhbmNlID0gZmxhdHBpY2tyKFxyXG4gICAgICB0aGlzLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KHRoaXMuc2VsZWN0b3IpISxcclxuICAgICAgb3B0aW9uc1xyXG4gICAgKTtcclxuXHJcbiAgICAvLyBJZiBubyB2YWx1ZSwgc2V0IGRlZmF1bHQgdGltZSBvbiBvcGVuXHJcbiAgICB0aGlzLmluc3RhbmNlLmNvbmZpZy5vbk9wZW4ucHVzaCgoKSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmluc3RhbmNlLmlucHV0LnZhbHVlID09PSAnJykge1xyXG4gICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZS5qdW1wVG9EYXRlKG5vdyk7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZS5jb25maWcuZGVmYXVsdEhvdXIgPSBub3cuZ2V0SG91cnMoKTtcclxuICAgICAgICB0aGlzLmluc3RhbmNlLmNvbmZpZy5kZWZhdWx0TWludXRlID0gbm93LmdldE1pbnV0ZXMoKTtcclxuICAgICAgICB0aGlzLmluc3RhbmNlLmNvbmZpZy5kZWZhdWx0U2Vjb25kcyA9IG5vdy5nZXRTZWNvbmRzKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMucXVlcnlTZWxlY3RvcignW2RhdGEtdG9nZ2xlXScpPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5xdWVyeVNlbGVjdG9yPEhUTUxJbnB1dEVsZW1lbnQ+KCdbZGF0YS1pbnB1dF0nKT8uZm9jdXMoKTtcclxuICAgICAgfSwgMCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGhhbmRsZU9wdGlvbnMob3B0aW9uczogZmxhdHBpY2tyLk9wdGlvbnMuT3B0aW9ucyk6IFByb21pc2U8ZmxhdHBpY2tyLk9wdGlvbnMuT3B0aW9ucz4ge1xyXG4gICAgb3B0aW9ucy5wbHVnaW5zID0gb3B0aW9ucy5wbHVnaW5zIHx8IFtdO1xyXG5cclxuICAgIGF3YWl0IFByb21pc2UuYWxsKFtcclxuICAgICAgdGhpcy5oYW5kbGVMb2NhbGUob3B0aW9ucyksXHJcbiAgICAgIHRoaXMuaGFuZGxlTW9udGhTZWxlY3Qob3B0aW9ucylcclxuICAgIF0pO1xyXG5cclxuICAgIHJldHVybiBvcHRpb25zO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBoYW5kbGVMb2NhbGUob3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55Pikge1xyXG4gICAgaWYgKHRoaXMubG9jYWxlKSB7XHJcbiAgICAgIGF3YWl0IHVzZUltcG9ydChgZmxhdHBpY2tyL2Rpc3QvbDEwbi8ke3RoaXMubG9jYWxlfS5qc2ApO1xyXG5cclxuICAgICAgb3B0aW9ucy5sb2NhbGUgPSB0aGlzLmxvY2FsZS5yZXBsYWNlKC8tLywgJ18nKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb3B0aW9ucztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlTW9udGhTZWxlY3Qob3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55Pikge1xyXG4gICAgaWYgKG9wdGlvbnMubW9udGhTZWxlY3QpIHtcclxuICAgICAgdXNlQ3NzSW1wb3J0KCdmbGF0cGlja3IvZGlzdC9wbHVnaW5zL21vbnRoU2VsZWN0L3N0eWxlLmNzcycpO1xyXG4gICAgICBjb25zdCB7IGRlZmF1bHQ6IG1vbnRoU2VsZWN0IH0gPSBhd2FpdCBpbXBvcnQoJ2ZsYXRwaWNrci9kaXN0L3BsdWdpbnMvbW9udGhTZWxlY3QnKTtcclxuXHJcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5tb250aFNlbGVjdCA9PT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICAgICAgb3B0aW9ucy5tb250aFNlbGVjdCA9IHtcclxuICAgICAgICAgIHNob3J0aGFuZDogdHJ1ZSxcclxuICAgICAgICAgIGRhdGVGb3JtYXQ6ICdZLW0nLFxyXG4gICAgICAgICAgYWx0Rm9ybWF0OiAnWS1tJ1xyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG9wdGlvbnMucGx1Z2lucy5wdXNoKG1vbnRoU2VsZWN0KG9wdGlvbnMubW9udGhTZWxlY3QpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb3B0aW9ucztcclxuICB9XHJcblxyXG4gIGdldEluc3RhbmNlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XHJcbiAgfVxyXG59XHJcblxyXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoRmxhdHBpY2tyRWxlbWVudC5pcywgRmxhdHBpY2tyRWxlbWVudCk7XHJcbiJdLCJuYW1lcyI6WyJub3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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
