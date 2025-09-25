import { ListDependent, ListDependentModule, ListDependentOptions } from '../components/list-dependent';
import { Nullable } from '../types';
export declare function useListDependent(): Promise<ListDependentModule>;
export declare function useListDependent(element: string | HTMLElement, dependent?: Nullable<string | HTMLElement>, options?: Partial<ListDependentOptions>): Promise<ListDependent>;
