/**
 * Add a route.
 */
export declare function addRoute(route: string, url: string): void;
/**
 * Get route.
 */
export declare function route(route: string, query?: Record<string, any>): string;
export declare function hasRoute(route: string): boolean;
export declare function addQuery(url: string, query?: Record<string, any>): string;
export declare function parseQuery<T = Record<string, any>>(queryString: string): T;
export declare function buildQuery(query: Record<string, any>): string;
