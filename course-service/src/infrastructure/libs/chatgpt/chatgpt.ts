import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { IChatGpt } from 'src/domain/interface/chatgpt';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';

@Injectable()
export class ChatGpt implements IChatGpt {
  private readonly config = new EnvironmentConfigService(new ConfigService());

  private readonly openai = new OpenAI({
    apiKey: this.config.getChatGptApiKey(),
  });

  async generateMessage(text: string): Promise<any> {
    try {
      const message = await this.openai.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: text.replaceAll('@bot', ''),
          },
        ],
        model: 'gpt-3.5-turbo',
        max_tokens: 300,
      });
      return message.choices[0].message.content;
    } catch (error) {
      console.log(error);
    }
  }
}
