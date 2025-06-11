const autoBind = require('auto-bind');

class UploadsHandler {
  constructor(storageService, albumsService, validator) {
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    const { id:albumId } = request.params;

    this._validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const fileLocation = `https://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

    await this._albumsService.addAlbumCoverById(albumId, fileLocation);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
      data: {
        fileLocation
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
