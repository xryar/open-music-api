const mapDBToModel = ({
  id,
  name,
  year
}) => ({
  id: id,
  name: name,
  year: year,
});

module.exports = mapDBToModel;