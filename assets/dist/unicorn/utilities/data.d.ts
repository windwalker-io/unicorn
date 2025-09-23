export declare function getData(element: Element, name?: string | undefined): any;
export declare function setData(element: Element, name: string, value: any): void;
export declare function defData(element: Element, name: string, defCallback: Function): any;
export declare function removeData(element: Element, name: string): any;
export declare function prepareData<T extends Node>(element: T): T;
declare global {
    interface Node {
        __unicorn?: any;
    }
}
