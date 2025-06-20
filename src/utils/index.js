/* eslint-disable camelcase */
const mapDBToAlbums = ({
  id,
  name,
  year,
  cover,
}) => ({
  id: id,
  name: name,
  year: year,
  coverUrl: cover ?? null,
});

const mapDBToSongs = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id: id,
  title: title,
  year: year,
  performer: performer,
  genre: genre,
  duration: duration,
  albumId: album_id,
});

const mapDBToPlaylist = ({
  id,
  name,
  username,
}) => ({
  id: id,
  name: name,
  username: username,
});

module.exports = { mapDBToAlbums, mapDBToSongs, mapDBToPlaylist };