var savedSearchesList = [];
var currentFilterList = [];

document.addEventListener('DOMContentLoaded', function() {
    loadSavedSearches();
}, false);

function loadSavedSearches() {
  savedSearchesList = JSON.parse(localStorage.getItem("savedSearchesList"));
  updatePinnedSearches();
}

function addToCurrentFilters(index) {
  currentFilterList.push(savedSearchesList[index]);
  updateCurrentFilters();
}

function removeCurrentFilter(index) {
  currentFilterList.splice(index, 1);
  updateCurrentFilters();
}

function updateCurrentFilters() {  var htmlText = "";
  var searchId = currentFilterList.length;
  var opening = "<li><button onclick=\"removeCurrentFilter(";
  var middle = ")\"> X</button><a>";
  var closing = "</a></li>";
  for (i = 0; i < currentFilterList.length; i++) {
    htmlText += opening + i + middle + currentFilterList[i] + closing;
  }
  document.getElementById("currentSearchFilters").innerHTML = htmlText;
}

function pinHashtag(){
  if (document.getElementById("hashtagText").value) {
    savedSearchesList.push(document.getElementById("hashtagText").value);
    updatePinnedSearches();
  }
}

function pinCaption(){
  if (document.getElementById("captionText").value) {
    savedSearchesList.push(document.getElementById("captionText").value);
    updatePinnedSearches();
  }
}

function pinComment(){
  if (document.getElementById("commentText").value) {
    savedSearchesList.push(document.getElementById("commentText").value);
    updatePinnedSearches();
  }
}

function pinDate(){
  if (document.getElementById("dateText").value) {
    savedSearchesList.push(document.getElementById("dateText").value);
    updatePinnedSearches();
  }
}

function pinLocation(){
  if (document.getElementById("locationText").value) {
    savedSearchesList.push(document.getElementById("locationText").value);
    updatePinnedSearches();
  }
}

function removeSavedTerm(index) {
  savedSearchesList.splice(index, 1);
  updatePinnedSearches();
}

function updatePinnedSearches(){
  var htmlText = "";
  var searchId = savedSearchesList.length;
  var opening = "<li><button onclick=\"removeSavedTerm(";
  var middle = ")\"> X</button><a onclick=\"addToCurrentFilters(";
  var nextMiddle = ")\">";
  var closing = "</a></li>";
  for (i = 0; i < savedSearchesList.length; i++) {
    htmlText += opening + i + middle + i + nextMiddle + savedSearchesList[i] + closing;
  }
  document.getElementById("pinnedSearchItems").innerHTML = htmlText;
  localStorage.setItem("savedSearchesList", JSON.stringify(savedSearchesList));
}
