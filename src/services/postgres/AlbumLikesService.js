/* eslint-disable no-unused-vars */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addLikeToAlbum(userId, albumId) {
    await this.verifyAlbumExist(albumId);
    const hashLiked = await this.hasUserLikedAlbum(userId, albumId);

    if (hashLiked) {
      throw new InvariantError('Anda sudah menyukai album ini');
    }

    const id = `like-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes values ($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Like gagal ditambahkan');
    }

    await this._cacheService.delete(`likes:${albumId}`);

    return result.rows[0].id;
  }

  async getAlbumLikesCount(albumId) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`);
      return {
        count: parseInt(result, 10),
        fromCache: true,
      };
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);
      const count = parseInt(result.rows[0].count, 10);

      await this._cacheService.set(`likes:${albumId}`, count);

      return {
        count,
        fromCache: false
      };
    }
  }

  async deleteLikeToAlbum(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 and album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus Like. Id tidak ditemukan');
    }

    await this._cacheService.delete(`likes:${albumId}`);
  }

  async hasUserLikedAlbum(userId, albumId) {
    const query = {
      text: 'SELECT 1 FROM user_album_likes WHERE user_id = $1 AND album_id = $2 LIMIT 1',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }

  async verifyAlbumExist(albumId) {
    const query = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [albumId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }
}

module.exports = AlbumLikesService;
