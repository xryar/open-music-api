const AlbumsService = require('../services/postgres/AlbumsService');
const SongsService = require('../services/postgres/SongsService');
const UsersService = require('../services/postgres/UsersService');
const AuthenticationsService = require('../services/postgres/AuthenticationsService');
const PlaylistService = require('../services/postgres/PlaylistService');
const albums = require('../api/albums');
const songs = require('../api/songs');
const users = require('../api/users');
const authentications = require('../api/authentications');
const playlist = require('../api/playlist');
const AlbumsValidator = require('../validator/albums');
const SongsValidator = require('../validator/songs');
const UsersValidator = require('../validator/users');
const AuthenticationsValidator = require('../validator/authentications');
const PlaylistValidator = require('../validator/playlist');
const TokenManager = require('../tokenize/TokenManager');

const usersService = new UsersService();
const albumsService = new AlbumsService();
const songsService = new SongsService();
const authenticationsService = new AuthenticationsService();
const playlistService = new PlaylistService();

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
  },
  {
    plugin: playlist,
    options: {
      service: playlistService,
      validator: PlaylistValidator,
    }
  }
];