const AlbumsService = require('../services/postgres/AlbumsService');
const SongsService = require('../services/postgres/SongsService');
const UsersService = require('../services/postgres/UsersService');
const albums = require('../api/albums');
const songs = require('../api/songs');
const AlbumsValidator = require('../validator/albums');
const SongsValidator = require('../validator/songs');
const UsersValidator = require('../validator/users');
const users = require('../api/users');

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
  {
    plugin: users,
    options: {
      service: new UsersService,
      validator: UsersValidator,
    }
  }
];