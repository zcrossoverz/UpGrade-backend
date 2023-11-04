import { TopicM } from '../model/topic';

export interface ITopicRepository {
  create(
    title: string,
    description: string,
    video_url: string,
    unit_id: number,
  ): Promise<TopicM>;
  getTopic(topic_id: number): Promise<TopicM>;
  getListTopic(unit_id: number): Promise<{
    datas: TopicM[];
    count: number;
  }>;
  update(
    topic_id: number,
    title: string,
    description: string,
  ): Promise<boolean>;
  delete(topic_id: number): Promise<boolean>;
}
