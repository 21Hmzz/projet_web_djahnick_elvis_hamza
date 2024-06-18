import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class BullService {
  constructor(@InjectQueue('redisqueue') private readonly RedisQueue: Queue) {}

  async addJob(data: any) {
    await this.RedisQueue.add(data);
  }
}

@Injectable()
export class MessageBullService {
  constructor(@InjectQueue('messages') private readonly messagesQueue: Queue) {}

  async addJob(data: any) {
    await this.messagesQueue.add(data);
  }
}
