import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class ImagesController {
  async getImagesForProducts({ params, response }: HttpContext) {
    let basePath: string = 'uploads'

    const imagePath: string = app.makePath(basePath, params.filename)
    return response.download(imagePath)
  }
}
