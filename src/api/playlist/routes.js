const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlist',
    handler: handler.postPlaylistHandler,
  },
  {
    method: 'GET',
    path: '/playlist',
    handler: handler.getPlaylistHandler,
  },
  {
    method: 'DELETE',
    path: '/playlist/{id}',
    handler: handler.deletePlaylistHandler,
  },
];

module.exports = routes;
