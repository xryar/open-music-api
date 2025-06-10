const autoBind = require('auto-bind');

class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadAlbumCoverHandler(request, h) {
    const { data } = request.payload;
    this._validator.validateImageHeaders(data.api.headers);

    const filename = await this._service.writeFile(data, data.api);

    const response = h.response({
      status: 'success',
      data: {
        fileLocation: `https://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
