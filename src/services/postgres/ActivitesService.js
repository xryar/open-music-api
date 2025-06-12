/* eslint-disable no-unused-vars */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');

class ActivitiesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addActivity({ playlistId, songId, userId, action }) {
    const id = `activity-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const time = createdAt;
    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES ($1, $2, $3, $4, $5, $6)',
      values: [id, playlistId, songId, userId, action, time],
    };

    await this._pool.query(query);
    await this._cacheService.delete(`activities:${playlistId}`);
  }

  async getActivities(playlistId) {
    try {
      const result = await this._cacheService.get(`activities:${playlistId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time
        FROM playlist_song_activities
        JOIN users ON users.id = playlist_song_activities.user_id
        JOIN songs ON songs.id = playlist_song_activities.song_id
        WHERE playlist_song_activities.playlist_id = $1
        ORDER BY playlist_song_activities.time ASC
        `,
        values: [playlistId],
      };

      const result = await this._pool.query(query);
      const activities = result.rows;

      await this._cacheService.set(`activities:${playlistId}`, JSON.stringify(activities));

      return activities;
    }
  }
}

module.exports = ActivitiesService;
