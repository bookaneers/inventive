/* exported data */

var data = {
  view: 'entry-form',
  entries: [],
  editing: null,
  nextEntryId: 1
};

var dataJSON = localStorage.getItem('code-journal');

if (dataJSON !== null) {
  data = JSON.parse(dataJSON);
}

window.addEventListener('beforeunload', function (event) {
  var stateJSON = JSON.stringify(data);
  localStorage.setItem('code-journal', stateJSON);
});
