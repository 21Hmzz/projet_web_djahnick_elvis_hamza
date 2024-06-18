import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { MessageService } from 'src/message/message.service';

@Processor('redisqueue')
export class BullProcessor {
  @Process()
  async handleJob(job: Job) {
    console.log('Processing job:', job.data);
  }
}

@Processor('messages')
export class MessagesProcessor {
  constructor(private readonly messageService: MessageService) {}

  @Process()
  async handleSaveMessage(job: Job) {
    const { data } = job;
    console.log('Processing job:', JSON.stringify(data));
    await this.messageService.saveMessage(data);
  }
}
