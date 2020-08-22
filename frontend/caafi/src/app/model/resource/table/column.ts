export interface Column {
  key: string;
  header: string;
  type: 'string' | 'object' | 'objectArray' | 'boolean';
  visible: boolean;
  objectField?: string;
  filter?: boolean;
  trueValue?: string;
  falseValue?: string;
}
