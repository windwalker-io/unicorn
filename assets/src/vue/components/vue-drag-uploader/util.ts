import { SimpleQueue } from '../../../unicorn/plugin/queue';

export let swal;

// Polyfill sweetalert
swal = window.swal = window.swal || function swal(title, message = null) {
  alert(title + ' / ' + message);
};

export const itemStates = {
  NEW: 'new',
  UPLOADING: 'uploading',
  COMPLETED: 'completed',
  FAIL: 'fail',
  STOP: 'stop',
};

export function isImage(filePath: string) {
  const ext = filePath.split('.').pop().split('?').shift();

  const allow = [
    'png',
    'jpeg',
    'jpg',
    'gif',
    'bmp',
    'webp',
  ];

  return allow.indexOf(ext.toLowerCase()) !== -1;
}

const queues = {};

export function getQueue(name: string, maxRunning: number = 2): SimpleQueue {
  queues[name] = queues[name] || new SimpleQueue(maxRunning);

  return queues[name];
}
