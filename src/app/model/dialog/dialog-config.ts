export interface DialogConfig {
  title?: string;
  contentHtml: string;
  cancelButtonText?: string;
  okButtonText: string;
  type?: 'INFO' | 'ALERT' | 'ERROR';
}
