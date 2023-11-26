export interface IChatGpt {
  generateMessage(text: string): Promise<any>;
}
