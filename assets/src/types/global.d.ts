import 'systemjs';
import 'jquery';
import 'axios';
import boostrap from 'bootstrap';
import * as vue from 'vue';
import '../../types';

declare global {
  var S:  typeof System;
  var bootstrap: typeof boostrap;
  var Vue: typeof vue;
}
