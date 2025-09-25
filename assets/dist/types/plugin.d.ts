import { UnicornApp } from '../app';
export interface UnicornPlugin {
    install?(app: UnicornApp, options?: Record<string, any>): void;
    uninstall?(app: UnicornApp): void;
}
