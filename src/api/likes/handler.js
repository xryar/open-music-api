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
    const { count: likes, fromCache } = await this._service.getAlbumLikesCount(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });

    if (fromCache) {
      response.header('X-Data-Source', 'cache');
    }

    return response;
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
