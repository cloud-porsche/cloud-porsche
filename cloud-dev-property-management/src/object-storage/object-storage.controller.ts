import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ObjectStorageService } from './object-storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

const uploadedFilePipe = new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: 'image/*',
  })
  .addMaxSizeValidator({
    maxSize: 2000000,
  })
  .build({
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  });

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
  async uploadFile(
    @UploadedFile(uploadedFilePipe)
    file: Express.Multer.File,
  ) {
    return await this.objectStorageService.uploadFile(file);
  }

  @Get(':file')
  async getFile(@Param('file') file: string) {
    return await this.objectStorageService.getFile(file);
  }

  @Delete(':file')
  async deleteFile(@Param('file') file: string) {
    await this.objectStorageService.deleteFile(file);
    return 'File deleted successfully';
  }

  @Patch('upload/:file')
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
    @Param('file') fileName: string,
    @UploadedFile(uploadedFilePipe)
    newFile: Express.Multer.File,
  ) {
    return await this.objectStorageService.updateFile(fileName, newFile);
  }
}
