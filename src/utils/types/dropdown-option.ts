/**
 * Standard shape for every `<select>` / `<datalist>` option across the
 * admin SPA. Centralising the shape here means:
 *   - every dropdown renders `<option value={id}>{label}</option>`
 *   - "id" is whatever stable value identifies the option (UUID for
 *     backend resources, enum string for static enums)
 *   - "label" is the human-readable display string
 *   - components can opt into `disabled` without forking the type
 */
export interface DropdownOption {
  id: string;
  label: string;
  disabled?: boolean;
}