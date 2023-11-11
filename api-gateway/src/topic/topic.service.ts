import { Injectable, Inject, StreamableFile } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TOPIC_MESSAGE_PATTERNS } from './messagePattern';
import { GDrive } from 'src/common/gdrive/gdrive';
import { getVideoDurationInSeconds } from 'get-video-duration';

@Injectable()
export class TopicService {
  constructor(
    @Inject('TOPIC_SERVICE') private readonly client: ClientProxy,
    private readonly gdrive: GDrive,
  ) {}

  async create(
    createDto: {
      title: string;
      description: string;
      unit_id: number;
    },
    files: any,
  ) {
    const video = files.video[0];
    const folder = await this.gdrive.createFolderIfNotExist('test video');

    const streamAbleFile = new StreamableFile(Buffer.from(video.buffer));
    const readStream = streamAbleFile.getStream();
    const duration = Math.round(await getVideoDurationInSeconds(readStream));

    console.log(duration, 'duration');

    const uploadVideo = await this.gdrive.uploadVideoResumable(
      folder,
      'content',
      video,
    );

    const video_url = await this.gdrive.getLinkVideo(uploadVideo);

    return this.client.send(TOPIC_MESSAGE_PATTERNS.create, {
      ...createDto,
      video_url,
      duration,
    });
  }

  async update(updateDto: {
    topic_id: number;
    title: string;
    description: string;
  }) {
    return this.client.send(TOPIC_MESSAGE_PATTERNS.update, {
      ...updateDto,
    });
  }

  async delete(id: number) {
    return this.client.send(TOPIC_MESSAGE_PATTERNS.delete, { id });
  }

  async getOne(id: number) {
    return this.client.send(TOPIC_MESSAGE_PATTERNS.getOne, { id });
  }

  async getList(query: { unit_id: number }) {
    return this.client.send(TOPIC_MESSAGE_PATTERNS.getList, { ...query });
  }
}