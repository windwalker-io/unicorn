import type { UnicornFieldValidation, UnicornFormValidation, ValidationHandler } from '@/components/validation';
import { getBoundedInstance } from '@/modules';

export async function useFormValidation(): Promise<typeof import('@/components/validation')>;
export async function useFormValidation(selector: string | Element): Promise<UnicornFormValidation>;
export async function useFormValidation(selector?: string | Element): Promise<any> {
  const module = await import('@/components/validation');

  await module.ready;

  if (!selector) {
    return module;
  }

  return useFormValidationSync(selector);
}

export function useFormValidationSync(selector: string | Element): UnicornFormValidation {
  return getBoundedInstance<UnicornFormValidation>(selector, 'form.validation');
}

export function useFieldValidationSync(selector: string | Element): UnicornFieldValidation {
  return getBoundedInstance<UnicornFieldValidation>(selector, 'field.validation');
}

export async function addGlobalValidator(name: string, validator: ValidationHandler, options: Record<string, any> = {}) {
  const { UnicornFormValidation } = await useFormValidation();

  UnicornFormValidation.addGlobalValidator(name, validator, options);
}
