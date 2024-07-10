import { OnQueueActive } from '@nestjs/bull';
import { Processor, OnWorkerEvent, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ChatGateway } from 'src/chat.gateway';
import { MessageService } from 'src/message/message.service';

@Processor('redisqueue')
export class BullProcessor extends WorkerHost {
  async process(job: Job<any, any, string>): Promise<any> {
    console.log('Processing job:', JSON.parse(job.data));
    return job.data;
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnWorkerEvent('completed')
  onCompleted() {
    console.log('Worker completed');
  }
}

@Processor('messages')
export class MessagesProcessor extends WorkerHost {
  constructor(
    private readonly messageService: MessageService,
    private readonly chatGateway: ChatGateway,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    try {
      await this.messageService.saveMessage(job.data);
      this.chatGateway.sendMessage(job.data);
      return job.data;
    } catch (error) {
      console.error('Error processing job:', error);
      throw error;
    }
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnWorkerEvent('completed')
  onCompleted() {
    console.log('Worker completed');
  }
}
