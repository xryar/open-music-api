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
  albumId,
}) => ({
  id: id,
  title: title,
  year: year,
  performer: performer,
  genre: genre,
  duration: duration,
  albumId: albumId,
});

module.exports = { mapDBToAlbums, mapDBToSongs };