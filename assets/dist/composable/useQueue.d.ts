import { TaskQueue } from '@lyrasoft/ts-toolkit/generic';
export declare function useQueue(name?: string, maxRunning?: number): TaskQueue;
export declare function createQueue(maxRunning?: number): TaskQueue;
