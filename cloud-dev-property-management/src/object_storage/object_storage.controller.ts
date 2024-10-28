import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ObjectStorageService } from './object_storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('storage')
export class ObjectStorageController {
  constructor(private readonly objectStorageService: ObjectStorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data') // Specify the content type
  @ApiBody({
    description: 'File upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary', // Indicates a file upload
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.objectStorageService.uploadFile(file);
  }

  @Get(':file')
  async getFile(@Param('file') file: string) {
    return await this.objectStorageService.getFile(file);
  }

  @Get('delete/:file')
  async deleteFile(@Param('file') file: string) {
    await this.objectStorageService.deleteFile(file);
    return 'File deleted successfully';
  }

  @Post('update')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data') // Specify the content type
  @ApiBody({
    description: 'File upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary', // Indicates a file upload
        },
      },
    },
  })
  async updateFile(
    @UploadedFile() newFile: Express.Multer.File,
    @Param('file') fileUrl: string,
  ) {
    return await this.objectStorageService.updateFile(fileUrl, newFile);
  }
}
