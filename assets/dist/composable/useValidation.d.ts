import { UnicornFieldValidation, UnicornFormValidation, ValidationHandler } from '../components/validation';
export declare function useFormValidation(): Promise<typeof import('../components/validation')>;
export declare function useFormValidation(selector: string | Element): Promise<UnicornFormValidation>;
export declare function useFormValidationSync(selector: string | Element): UnicornFormValidation;
export declare function useFieldValidationSync(selector: string | Element): UnicornFieldValidation;
export declare function addGlobalValidator(name: string, validator: ValidationHandler, options?: Record<string, any>): Promise<void>;
