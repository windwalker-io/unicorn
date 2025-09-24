import { Dictionary } from '@/types';
import { TaskQueue, queue } from '@lyrasoft/ts-toolkit/generic';

const queues: Dictionary<TaskQueue> = {};

export function useQueue(name: string = 'default', maxRunning = 1): TaskQueue {
  return queues[name] ??= createQueue(maxRunning);
}

export function createQueue(maxRunning = 1): TaskQueue {
  return queue(maxRunning);
}

