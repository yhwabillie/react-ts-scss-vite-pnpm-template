// a11y-roles.types.ts
export interface ComboboxA11yProps {
  /** 1. 역할 (What is this?) */
  role?: 'combobox';

  /** 2. 참조 관계 (Who labels / controls me?) */
  'aria-labelledby'?: string;
  //   'aria-controls'?: string;

  //   /** 3. 현재 상태 (What state am I in?) */
  //   'aria-expanded'?: boolean;

  //   /** 4. 현재 포커스 대상 (Where is the active item?) */
  //   'aria-activedescendant'?: string;
}

export interface SelectboxA11yProps {
  /** 1. 역할 (What is this?) */
  role?: 'combobox';
  /** 2. 참조 관계 (Who labels / controls me?) */
  'aria-labelledby'?: string;
}
