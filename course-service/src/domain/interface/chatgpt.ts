export interface IChatGpt {
  generateMessage(text: string): Promise<any>;
  classification(text: string): Promise<any>;
}
