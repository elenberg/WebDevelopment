var savedSearchesList = [];

function pinSearchCritera(){
  savedSearchesList.push(document.getElementById("captionText").value);
  var htmlText = "";
  var opening = "<li><button>X</button><a>";
  var closing = "</a></li>";
  for (i = 0; i < savedSearchesList.length; i++) {
    htmlText += opening + savedSearchesList[i] + closing;
  }
  document.getElementById("pinnedSearchItems").innerHTML = htmlText;
}

function pinHashtag(){
  savedSearchesList.push("#" + document.getElementById("hashtagText").value);
  updatePinnedSearches();
}

function updatePinnedSearches(){
  var htmlText = "";
  var opening = "<li><button>X</button><a>";
  var closing = "</a></li>";
  for (i = 0; i < savedSearchesList.length; i++) {
    htmlText += opening + savedSearchesList[i] + closing;
  }
  document.getElementById("pinnedSearchItems").innerHTML = htmlText;
}
