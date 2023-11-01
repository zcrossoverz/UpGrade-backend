import { IGdrive } from 'src/domain/interface/gdrive';
import { ILogger } from 'src/domain/logger/logger.interface';
import { ICourseRepository } from 'src/domain/repositories/courseRepository.interface';

export class UploadVideoCoursesUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly courseRepository: ICourseRepository,
    private readonly gdrive: IGdrive,
  ) {}

  async excute() {
    this.logger.log('UploadVideo execute', 'Start');
    // const folderId = await this.gdrive.createFolderIfNotExist('video');
    // const result = await this.gdrive.upload(folderId);
    // this.logger.log('UploadVideo create folder', JSON.stringify(folder));
    const result = await this.gdrive.getLinkVideo(
      'https://drive.google.com/uc?export=download&id=1V3oL_JXv63ycaRue6CKgWx2UoCU-Vj29',
    );
    return result.data;
  }
}
