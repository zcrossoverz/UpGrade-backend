import { Module } from '@nestjs/common';
import { ChatGpt } from './chatgpt';

@Module({
  providers: [ChatGpt],
  exports: [ChatGpt],
})
export class ChatGptModule {}
