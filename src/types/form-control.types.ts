// combobox-input.types.ts
export interface ComboboxInputProps
  extends Pick<
    React.InputHTMLAttributes<HTMLInputElement>,
    | 'placeholder'
    | 'autoComplete'
    | 'inputMode'
    | 'name'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'onFocus'
  > {}
