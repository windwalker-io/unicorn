import type {
  UnicornFieldValidation,
  UnicornFormValidation,
  ValidationHandler,
  ValidationModule
} from '../module/validation';
import { getBoundedInstance } from '../service';

export async function useFormValidation(): Promise<ValidationModule>;
export async function useFormValidation(selector: string | Element): Promise<UnicornFormValidation | null>;
export async function useFormValidation(selector?: string | Element): Promise<any> {
  const module = await import('../module/validation');

  await module.ready;

  if (!selector) {
    return module;
  }

  return useFormValidationSync(selector);
}

export function useFormValidationSync(selector: string | Element): UnicornFormValidation | null {
  return getBoundedInstance<UnicornFormValidation>(selector, 'form.validation');
}

export function useFieldValidationSync(selector: string | Element): UnicornFieldValidation | null {
  return getBoundedInstance<UnicornFieldValidation>(selector, 'field.validation');
}

export async function addGlobalValidator(
  name: string,
  validator: ValidationHandler,
  options: Record<string, any> = {}
): Promise<void> {
  const { UnicornFormValidation } = await useFormValidation();

  UnicornFormValidation.addGlobalValidator(name, validator, options);
}
