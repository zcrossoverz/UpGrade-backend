export interface IGdrive {
  createFolderIfNotExist(folderName: string): Promise<any>;
  upload(folderId: string, file: Express.Multer.File): Promise<any>;
  getFileId(fileName: string): Promise<any>;
  getLinkVideo(fileId: string): Promise<any>;
}
