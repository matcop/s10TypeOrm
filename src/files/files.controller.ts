import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Query, Res, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';


@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post('productos')
  @UseInterceptors(FileInterceptor('file', { fileFilter: fileFilter }))
  uploadFile1(
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('Asegurate que el archivo sea un formato permitido');
    }
    return {
      fileName: file.originalname, //RETORNAREMOS EL NOMBRE DEL ARCHIVO
      tipo: file.mimetype,
      medida: file.size + ' bytes',
      codificado: file.encoding // Obsoleto desde el julio 2015
    };
  }


 


}
