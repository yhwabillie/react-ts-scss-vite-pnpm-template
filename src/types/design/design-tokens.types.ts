// union type
export type Variant = 'solid' | 'outline' | 'ghost';
export type Color = 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger';
export type Shape = 'rounded' | 'square' | 'pill';
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface StyleProps {
  variant: Variant;
  color: Color;
  size: Size;
}
