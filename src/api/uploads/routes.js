const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: handler.postUploadAlbumCoverHandler,
    options: {
      auth: 'openmusic_jwt',
      payload: {
        allow: 'multipar/form-data',
        mulipart: true,
        output: 'stream'
      }
    }
  }
];

module.exports = routes;
