const AlbumsService = require('../services/postgres/AlbumsService');
const SongsService = require('../services/postgres/SongsService');
const UsersService = require('../services/postgres/UsersService');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const albums = require('../api/albums');
const songs = require('../api/songs');
const users = require('../api/users');
const authentications = require('./api/authentications');
const AlbumsValidator = require('../validator/albums');
const SongsValidator = require('../validator/songs');
const UsersValidator = require('../validator/users');
const AuthenticationsValidator = require('./validator/authentications');
const TokenManager = require('./tokenize/TokenManager');

const usersService = new UsersService();
const albumsService = new AlbumsService();
const songsService = new SongsService();
const authenticationsService = new AuthenticationsService();

module.exports = [
  {
    plugin: albums,
    options: {
      service: albumsService,
      validator: AlbumsValidator
    },
  },
  {
    plugin: songs,
    options: {
      service: songsService,
      validator: SongsValidator
    },
  },
  {
    plugin: users,
    options: {
      service: usersService,
      validator: UsersValidator,
    }
  },
  {
    plugin: authentications,
    options: {
      authenticationsService,
      usersService,
      tokenManager: TokenManager,
      validator: AuthenticationsValidator,
    }
  }
];