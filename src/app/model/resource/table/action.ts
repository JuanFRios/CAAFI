export interface Action {
  key: string;
  tooltip: string;
  visibility: true | false | 'single' | 'multiple';
  function: string;
  icon: string;
}
