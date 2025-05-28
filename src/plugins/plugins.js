const AlbumsService = require('../services/postgres/AlbumsService');
const SongsService = require('../services/postgres/SongsService');
const UsersService = require('../services/postgres/UsersService');
const AuthenticationsService = require('../services/postgres/AuthenticationsService');
const PlaylistService = require('../services/postgres/PlaylistService');
const CollaborationsService = require('../services/postgres/CollaborationsService');
const albums = require('../api/albums');
const songs = require('../api/songs');
const users = require('../api/users');
const authentications = require('../api/authentications');
const playlist = require('../api/playlist');
const collaborations = require('../api/collaborations');
const AlbumsValidator = require('../validator/albums');
const SongsValidator = require('../validator/songs');
const UsersValidator = require('../validator/users');
const AuthenticationsValidator = require('../validator/authentications');
const PlaylistValidator = require('../validator/playlist');
const CollaborationsValidator = require('../validator/collaborations');
const TokenManager = require('../tokenize/TokenManager');
const ActivitiesService = require('../services/postgres/ActivitesService');

const usersService = new UsersService();
const albumsService = new AlbumsService();
const songsService = new SongsService();
const authenticationsService = new AuthenticationsService();
const collaborationsService = new CollaborationsService();
const activitiesService = new ActivitiesService();
const playlistService = new PlaylistService(collaborationsService, activitiesService);

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
      playlistService,
      activitiesService,
      validator: PlaylistValidator,
    }
  },
  {
    plugin: collaborations,
    options: {
      collaborationsService,
      playlistService,
      validator: CollaborationsValidator,
    }
  }
];