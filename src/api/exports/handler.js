const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(producerService, playlistService, validator) {
    this._producerService = producerService;
    this._playlistService = playlistService;
    this._validator = validator;

    autoBind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);

    const userId = request.auth.credentials.id;
    const targetEmail = request.payload.targetEmail;
    const { playlistId } = request.params;

    await this._playlistService.verifyPlaylistAccess(playlistId, userId);

    const message = {
      userId,
      targetEmail,
      playlistId,
    };

    await this._producerService.sendMessage('export:playlist', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
