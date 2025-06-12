/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { mapDBToPlaylist } = require('../../utils');

class PlaylistService {
  constructor(collaborationsService, cacheService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
    this._cacheService = cacheService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist(id, name, owner) VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    await this._cacheService.delete(`playlist:${owner}`);

    return result.rows[0].id;
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `playlist-song-${nanoid(16)}`;
    const songCheck = {
      text: 'SELECT id FROM songs WHERE id = $1',
      values: [songId],
    };

    const songsCheck = await this._pool.query(songCheck);

    if (!songsCheck.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    const query = {
      text: 'INSERT INTO playlist_songs VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId]
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }

    await this._cacheService.delete(`playlistSongs:${playlistId}`);

    return result.rows[0].id;
  }

  async getPlaylist(userId) {
    try {
      const result = await this._cacheService.get(`playlist:${userId}`);
      return {
        data: JSON.parse(result),
        fromCache: true
      };
    } catch (error) {
      const query = {
        text: `SELECT playlist.id, playlist.name, users.username
        FROM playlist 
        JOIN users ON users.id = playlist.owner
        LEFT JOIN collaborations ON collaborations.playlist_id = playlist.id
        WHERE playlist.owner = $1 OR collaborations.user_id = $1
        GROUP BY playlist.id, users.username`,
        values: [userId],
      };

      const result = await this._pool.query(query);
      const playlist = result.rows.map(mapDBToPlaylist);

      await this._cacheService.set(`playlist:${userId}`, JSON.stringify(playlist));
      return {
        data: playlist,
        fromCache: false,
      };
    }
  }

  async getSongFromPlaylist(playlistId) {
    try {
      const result = await this._cacheService.get(`playlistSongs:${playlistId}`);
      return {
        data: JSON.parse(result),
        fromCache: true
      };
    } catch (error) {
      const playlistQuery = {
        text: `SELECT playlist.id, playlist.name, users.username
        FROM playlist
        JOIN users ON playlist.owner = users.id
        WHERE playlist.id = $1`,
        values: [playlistId],
      };
      const playlistResult = await this._pool.query(playlistQuery);

      if (!playlistResult.rowCount) {
        throw new NotFoundError('Playlist tidak ditemukan');
      }

      const songsQuery = {
        text: `SELECT songs.id, songs.title, songs.performer
        FROM playlist_songs
        JOIN songs ON playlist_songs.songs_id = songs.id
        WHERE playlist_songs.playlist_id = $1`,
        values: [playlistId],
      };
      const songsResult = await this._pool.query(songsQuery);

      const data = {
        ...playlistResult.rows[0],
        songs: songsResult.rows,
      };

      await this._cacheService.set(`playlistSongs:${playlistId}`, JSON.stringify(data));
      return data;
    }
  }

  async deletePlaylistById(id, owner) {
    const query = {
      text: 'DELETE FROM playlist WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }

    await this._cacheService.delete(`playlist:${owner}`);
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND songs_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan dalam playlist');
    }

    await this._cacheService.delete(`playlistSongs:${playlistId}`);
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlist WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan.');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationsService.verifyCollaborator(playlistId, userId);
      } catch (error) {
        throw error;
      }
    }
  }
}

module.exports = PlaylistService;
