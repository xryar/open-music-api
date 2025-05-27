exports.up = (pgm) => {
  pgm.addConstraint('playlist', 'fk_playlist.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlist(id) ON DELETE CASCADE');
  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.songs_id_songs.id', 'FOREIGN KEY(songs_id) REFERENCES songs(id) ON DELETE CASCADE');
  pgm.addConstraint('songs', 'fk_songs.album_id_albums.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('playlist', 'fk_playlist.owner_users.id');
  pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlist.id');
  pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.songs_id_songs.id');
  pgm.dropConstraint('songs', 'fk_songs.album_id_albums.id');
};
