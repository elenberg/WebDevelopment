$(document).ready(function(){
  // Global variables
  var myCenter = new google.maps.LatLng(41.742021, -111.814519);

  savedSearchesList = JSON.parse(localStorage.getItem("savedSearchesList"));
  updatePinnedSearches();

  $('.pinned-search-toggle').click(function(e){
    e.preventDefault();
    e.stopPropagation();

    if ($(this).hasClass('visible'))
    {
      $(this).removeClass('visible');
      $('.pinned-search-items').hide('slide', {direction: 'up'}, 1000);
    }
    else
    {
      $(this).addClass('visible');
      $('.pinned-search-items').show('slide', {direction: 'up'}, 1000);
    }
  });

  // Modify search function
  $('.search').click(function(e){
    e.preventDefault();
    e.stopPropagation();

    var query = $('.search-input').val();

    if (query === '')
    {
      $('.search-input').addClass('error');
    }
    else if (query.indexOf('#') != -1)
    {
      $('.search-input').addClass('error');
    }
    else
    {
      $('.search-input').removeClass('error');
      $('.search-results').html(query);
    }
  });

  // ************************
  //      Map Search
  // ************************
  	var mapOptions = {
  		center: myCenter,
  		zoom: 11,
  		mapTypeId: google.maps.MapTypeId.ROADMAP,
      streetViewControl: false,
      zoomControl: false,
      mapTypeControl: false
  	};

  	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    map.data.setDrawingMode("Point");
});

// ************************
//      Global Vars
// ************************
var savedSearchesList = [[], [], [], []];
var currentFilterList = [];
var activeHastagFilter = "";
var activeCaptionFilter = "";
var activeCommentFilter = "";
var activeDateilter = "";
var activeMapFilter = "";

// ************************
//    Current Filters
// ************************
function setActiveSearchFilters()
{
  activeHastagFilter = document.getElementById("hashtagText").value;
  activeCaptionFilter = document.getElementById("captionText").value;
  activeCommentFilter = document.getElementById("commentText").value;
  activeDateFilter = document.getElementById("dateText").value;

  var htmlText = "";
  var opening = "<div><li>";
  var closing = "</li></div>";

  if (activeHastagFilter != "")
  {
    htmlText += opening + "Hashtag: " + activeHastagFilter + closing;
  }

  if (activeCaptionFilter != "")
  {
    htmlText += opening + "Caption: " + activeCaptionFilter + closing;
  }

  if (activeCommentFilter != "")
  {
    htmlText += opening + "Comment: " + activeCommentFilter + closing;
  }

  if (activeDateFilter != "")
  {
    htmlText += opening + "Date: " + activeDateFilter + closing;
  }

  document.getElementById("activeSearchFilters").innerHTML = htmlText;
}

function addToCurrentFilters(index) {
  currentFilterList.push(savedSearchesList[index]);
  updateCurrentFilters();
}

function removeCurrentFilter(index) {
  currentFilterList.splice(index, 1);
  updateCurrentFilters();
}

function addAsCurrentFilter(type, index)
{
  if (type == 0)
  {
    document.getElementById('hashtagText').value = savedSearchesList[type][index];
  }
  else if (type == 1)
  {
    document.getElementById('captionText').value = savedSearchesList[type][index];
  }
  else if (type == 2)
  {
    document.getElementById('commentText').value = savedSearchesList[type][index];
  }
  else if (type == 3)
  {
    document.getElementById('dateText').value = savedSearchesList[type][index];
  }

  setActiveSearchFilters();
}

function pinAllSearches()
{
  pinHashtag();
  pinCaption();
  pinDate();
  pinComment();
}

function updateCurrentFilters() {
  var htmlText = "";
  var opening = "<li><button onclick=\"removeCurrentFilter(";
  var middle = ")\"> X</button><a>";
  var closing = "</a></li>";
  for (i = 0; i < currentFilterList.length; i++)
  {
    htmlText += opening + i + middle + currentFilterList[i] + closing;
  }
  document.getElementById("currentSearchFilters").innerHTML = htmlText;
}

// ************************
//     Pinned Searches
// ************************
function pinHashtag(){
  if (document.getElementById("hashtagText").value) {
    savedSearchesList[0].push(document.getElementById("hashtagText").value);
    updatePinnedSearches();
  }
}

function pinCaption(){
  if (document.getElementById("captionText").value) {
    savedSearchesList[1].push(document.getElementById("captionText").value);
    updatePinnedSearches();
  }
}

function pinComment(){
  if (document.getElementById("commentText").value) {
    savedSearchesList[2].push(document.getElementById("commentText").value);
    updatePinnedSearches();
  }
}

function pinDate(){
  if (document.getElementById("dateText").value) {
    savedSearchesList[3].push(document.getElementById("dateText").value);
    updatePinnedSearches();
  }
}

function pinLocation(){
  if (document.getElementById("locationText").value) {
    savedSearchesList[3].push(document.getElementById("locationText").value);
    updatePinnedSearches();
  }
}

function removeSavedTerm(searchType, searchNumber) {
  savedSearchesList[searchType].splice(searchNumber, 1);
  updatePinnedSearches();
}

function updatePinnedSearches()
{
  var htmlText = "";
  var opening = "<li><button onclick=\"removeSavedTerm(";
  var middle = ")\"> X</button><a onclick=\"addAsCurrentFilter(";
  var nextMiddle = ")\">";
  var closing = "</a></li>";
  for (i = 0; i < savedSearchesList.length; i++)
  {
    for (j = 0; j < savedSearchesList[i].length; j++)
    {
      htmlText += opening + i + "," + j + middle + i + "," + j + nextMiddle;
      htmlText += savedSearchesList[i][j] + closing;
    }
  }

  document.getElementById("pinnedSearchItems").innerHTML = htmlText;
  localStorage.setItem("savedSearchesList", JSON.stringify(savedSearchesList));
}
