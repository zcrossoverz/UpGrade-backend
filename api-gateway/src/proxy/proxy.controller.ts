import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, Get, Inject, Query, Res } from '@nestjs/common';
import axios from 'axios';
import { Cache } from 'cache-manager';
import { Response } from 'express';
import { Stream } from 'stream';

@Controller('proxy')
export class ProxyController {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @Get('')
  async getImage(@Query('image') imageUrl: string, @Res() res: Response) {
    try {
      imageUrl = imageUrl.includes('&export=download')
        ? imageUrl
        : imageUrl.concat('&export=download');
      // Check if the image is in the cache
      const cachedImage = await this.cacheManager.get<any>(imageUrl);

      if (cachedImage) {
        // If cached, send the cached image directly
        res.set(cachedImage.headers);
        // Convert the Base64 string back to a stream
        const imageStream = new Stream.PassThrough();
        imageStream.end(Buffer.from(cachedImage.data, 'base64'));
        imageStream.pipe(res);
      } else {
        // If not in cache, make a request to the external image server
        const response = await axios.get(imageUrl, {
          responseType: 'arraybuffer',
        });

        // Set the appropriate headers for the response
        res.set(response.headers);

        // Convert the image data to Base64
        const base64Image = Buffer.from(response.data).toString('base64');

        // Pipe the Base64-encoded image to the response
        const imageStream = new Stream.PassThrough();
        imageStream.end(Buffer.from(base64Image, 'base64'));
        imageStream.pipe(res);

        // Cache the Base64-encoded image for future requests
        this.cacheManager.set(imageUrl, {
          headers: response.headers,
          data: base64Image,
        });
      }
    } catch (error) {
      // Handle errors, e.g., image not found, server error, etc.
      console.error('Error proxying image:', error.message);
      res.status(500).send('Internal Server Error');
    }
  }
}
