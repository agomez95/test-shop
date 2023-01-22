import { Controller, Post, Get, Res, Param, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { Response } from 'express';
import { diskStorage } from 'multer';

import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers/';


@ApiTags('Files') // Si queremos que swagger agrupe los endpoints debemos agregar ApiTags en todos los controller antes de @Controller()
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService, private readonly configService: ConfigService) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    
    const path = this.filesService.getStaticProductImage(imageName);

    res.sendFile(path); //aqui solamente cargo en el navegador la imagen mediante la direccion que se retorna

  }

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {  //con este interceptor obtengo el archivo ya que usa el nombre 'file' para interceptarlo
    fileFilter: fileFilter, // helper que sirve como filtro para determinar el tipo de archivo
    storage: diskStorage({
      destination: './static/products', // aqui guardo las imagnes
      filename: fileNamer //  filtro para crear el name
    })
  })) 
  uploadProductImage(@UploadedFile() file: Express.Multer.File) { //UploadedFile - permite obtener el archivo en si, las propiedades

    if(!file) throw new BadRequestException('Make sure that the file is an image') /// si no pasa el filtro no envia nada y le mando error

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;

    return { secureUrl };
  }

  /// para esto se utilizo el npm i -D @types/multer
}
