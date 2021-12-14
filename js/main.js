/* global data */

var PLACEHOLDER_IMAGE = 'images/placeholder-image-square.jpg';

// querying the entry-form id form tag
var $entryForm = document.querySelector('#entry-form');

// querying the photo-preview id img tag
var $photoPreview = document.querySelector('#photo-preview');

// queryng the entry-form-title id h1 tag
var $entryFormTitle = document.querySelector('#entry-form-title');

// routine to show image from link
$entryForm.addEventListener('input', function (event) {
  if (event.target.name === 'photoUrl') {
    $photoPreview.setAttribute('src', event.target.value);
  }
});

// querying the entry-list id ol tag
var $entriesList = document.querySelector('#entries-list');

// adding an entries to the database
$entryForm.addEventListener('submit', function (event) {
  event.preventDefault();

  // condition to add a new entry
  // if data.editing is not empty, it's an editing
  if (data.editing !== null) {
    // iterate over data.editing to add val;ues to the database
    for (var field in data.editing) {
      // if entryId is found continue (don not add anyvalue to entryId)
      if (field === 'entryId') continue;
      //if field is not entryId add value from form to data.editing
      data.editing[field] = $entryForm.elements[field].value;
    }

    var entryId = $entryForm.elements.entryId.value;

    for (var i = 0; i < $entriesList.childNodes.length; i++) {
      var $entry = $entriesList.childNodes[i];
      if ($entry.getAttribute('data-entry-id') === entryId) {
        $entry.replaceWith(renderEntry(data.editing));
        break;
      }
    }
    data.editing = null;

  // replacing a existing entry
  } else {
    var entry = {
      entryId: data.nextEntryId++,
      title: $entryForm.elements.title.value,
      notes: $entryForm.elements.notes.value,
      photoUrl: $entryForm.elements.photoUrl.value
    };
    data.entries.unshift(entry);
    $entriesList.prepend(renderEntry(entry));
  }
  $entryForm.reset();
  $photoPreview.setAttribute('src', PLACEHOLDER_IMAGE);
  showView('entries');
});


// to delete an entry
$entryForm.addEventListener('click', function (event) {
  if (event.target.tagName !== 'BUTTON') return;
  if (event.target.getAttribute('data-action') === 'delete') {
    $deleteEntryModal.className = 'modal open';
  }
});

var $deleteEntryModal = document.querySelector('#delete-entry-modal');

$deleteEntryModal.addEventListener('click', function (event) {
  if (event.target.tagName !== 'BUTTON') return;
  $deleteEntryModal.className = 'modal';
  var action = event.target.getAttribute('data-action');
  if (action === 'confirm-delete') {
    for (var i = 0; i < data.entries.length; i++) {
      var entry = data.entries[i];
      var $entry = $entriesList.childNodes[i];
      if (entry === data.editing) {
        data.entries.splice(i, 1);
        $entry.remove();
        break;
      }
    }
    showView('entries');
  }
});

document.addEventListener('click', function (event) {
  if (event.target.tagName !== 'A') return;
  var viewName = event.target.getAttribute('data-view');
  var $entry = event.target.closest('[data-entry-id]');
  if ($entry !== null) {
    var entryId = parseInt($entry.getAttribute('data-entry-id'), 10);
    data.editing = findEntryById(data.entries, entryId);
  } else {
    data.editing = null;
  }
  showView(viewName);
});

document.addEventListener('DOMContentLoaded', function (event) {
  for (var i = 0; i < data.entries.length; i++) {
    var $entry = renderEntry(data.entries[i]);
    $entriesList.append($entry);
  }
  showView(data.view, data.entryId);
});

function renderEntry(entry) {

  var $entry = document.createElement('li');
  $entry.className = 'entry';
  $entry.setAttribute('data-entry-id', entry.entryId);

  var $row = document.createElement('div');
  $row.className = 'row';

  var $leftColum = document.createElement('div');
  $leftColum.className = 'column-half';

  var $photo = document.createElement('img');
  $photo.className = 'entry-photo';
  $photo.setAttribute('src', entry.photoUrl);

  var $rightColumn = document.createElement('div');
  $rightColumn.className = 'column-half';

  var $title = document.createElement('h2');
  $title.className = 'entry-heading';
  $title.textContent = entry.title;

  var $notes = document.createElement('p');
  $notes.textContent = entry.notes;

  var $edit = document.createElement('a');
  $edit.className = 'edit fas fa-pen';
  $edit.setAttribute('href', '#');
  $edit.setAttribute('data-view', 'entry-form');
  $edit.setAttribute('data-entry-id', entry.entryId);

  $title.append($edit);
  $leftColum.append($photo);
  $rightColumn.append($title, $notes);
  $row.append($leftColum, $rightColumn);
  $entry.append($row);

  return $entry;
}

var $views = document.querySelectorAll('div[data-view]');

function showView(viewName) {

  if (viewName === 'entry-form') {
    if (data.editing === null) {
      $entryForm.setAttribute('data-action', 'create');
      $entryForm.reset();
      $photoPreview.setAttribute('src', PLACEHOLDER_IMAGE);
      $entryFormTitle.textContent = 'New Entry';
    } else {
      $entryForm.setAttribute('data-action', 'edit');
      for (var field in data.editing) {
        $entryForm.elements[field].value = data.editing[field];
      }
      $photoPreview.setAttribute('src', data.editing.photoUrl);
      $entryFormTitle.textContent = 'Edit Entry';
    }
  }

  for (var i = 0; i < $views.length; i++) {
    var $view = $views[i];
    if ($view.getAttribute('data-view') === viewName) {
      $view.className = '';
    } else {
      $view.className = 'hidden';
    }
  }

  window.scrollTo(0, 0);

  data.view = viewName;
}

function findEntryById(allEntries, entryId) {
  for (var i = 0; i < allEntries.length; i++) {
    var entry = allEntries[i];
    if (entry.entryId === entryId) {
      return entry;
    }
  }
}
