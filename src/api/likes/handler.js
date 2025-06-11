const autoBind = require('auto-bind');

class LikesAlbumHandler {
  constructor(service) {
    this._service = service;

    autoBind(this);
  }

  async postLikeAlbumHandler(request, h) {
    const { id:userId } = request.auth.credentials;
    const { id:albumId } = request.params;

    await this._service.addLikeToAlbum(userId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Like berhasil ditambahkan',
    });
    response.code(201);
    return response;
  }

  async getLikesAlbumHandler(request, h) {
    const { id:albumId } = request.params;

    await this._service.verifyAlbumExist(albumId);
    const likes = await this._service.getAlbumLikesCount(albumId);

    return h.response({
      status: 'success',
      data: {
        likes,
      },
    });
  }

  async deleteLikeAlbumHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { id:albumId } = request.params;

    await this._service.deleteLikeToAlbum(userId, albumId);

    return h.response({
      status: 'success',
      message: 'Like berhasil dihapus'
    });
  }
}

module.exports = LikesAlbumHandler;
