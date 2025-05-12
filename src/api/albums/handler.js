class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { albumName, albumYear } = request.payload;

    const albumId = await this._service.addAlbum({ albumName, albumYear });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = AlbumsHandler;