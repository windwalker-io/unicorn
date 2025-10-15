import type {
  UnicornFieldValidation,
  UnicornFormValidation,
  ValidationHandler,
  ValidationModule,
  ValidatorOptions,
} from '../module/validation';
import { getBoundedInstance } from '../service';

export type {
  ValidationHandler,
  ValidationModule,
  Validator,
  ValidatorOptions,
  ValidatorNoticeFunction,
  FieldValidationOptions,
  FormValidationOptions
} from '../module/validation';

export async function useFormValidation(): Promise<ValidationModule>;
export async function useFormValidation(selector: string | Element): Promise<UnicornFormValidation | null>;
export async function useFormValidation(selector?: string | Element): Promise<any> {
  const module = await import('../module/validation');

  await module.ready;

  if (!selector) {
    return module;
  }

  return useFormValidationInstance(selector);
}

export function useFormValidationInstance(selector: string | Element): UnicornFormValidation | null {
  return getBoundedInstance<UnicornFormValidation>(selector, 'form.validation');
}

export function useFieldValidationInstance(selector: string | Element): UnicornFieldValidation | null {
  return getBoundedInstance<UnicornFieldValidation>(selector, 'field.validation');
}

export async function addGlobalValidator<T extends any, E extends HTMLElement, P = Record<string, any>>(
  name: string,
  validator: ValidationHandler<T, E, P>,
  options: ValidatorOptions<E, P> = {}
): Promise<void> {
  const { UnicornFormValidation } = await useFormValidation();

  UnicornFormValidation.addGlobalValidator<T, E, P>(name, validator, options);
}
