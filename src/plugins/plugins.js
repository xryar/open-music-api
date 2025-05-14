const AlbumsService = require('../services/postgres/AlbumsService');
const SongsService = require('../services/postgres/SongsService');
const albums = require('../api/albums');
const songs = require('../api/songs');
const AlbumsValidator = require('../validator/albums');
const SongsValidator = require('../validator/songs');

module.exports = [
  {
    plugin: albums,
    options: {
      service: new AlbumsService,
      validator: AlbumsValidator
    },
  },
  {
    plugin: songs,
    options: {
      service: new SongsService,
      validator: SongsValidator
    },
  },
];