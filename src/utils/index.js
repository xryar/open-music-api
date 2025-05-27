/* eslint-disable camelcase */
const mapDBToAlbums = ({
  id,
  name,
  year
}) => ({
  id: id,
  name: name,
  year: year,
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
  owner,
}) => ({
  id: id,
  name: name,
  username: owner,
});

module.exports = { mapDBToAlbums, mapDBToSongs, mapDBToPlaylist };