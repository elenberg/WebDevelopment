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

  // Toggle sidebar function
  $('.sidebar-toggle').click(function(e)
  {
    e.preventDefault();
    e.stopPropagation();

    if ($(this).hasClass('visible'))
    {
      $(this).removeClass('visible');
      $('.sidebar').hide('slide', {direction: 'left'}, 1000);
    }
    else
    {
      $(this).addClass('visible');
      $('.sidebar').show('slide', {direction: 'left'}, 1000);
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
var savedSearchesList = [];
var currentFilterList = [];
var activeHastagFilter = "";
var activeCaptionFilter = "";
var activeCommentFilter = "";
var activeDateilter = "";
var activeMapFilter = "";

// ************************
//    Current Filters
// ************************
function setActiveSearchFilters(){
  alert("Sup");
  activeHastagFilter = document.getElementById("hashtagText").value;
  activeCaptionFilter = document.getElementById("captionText").value;
  activeCommentFilter = document.getElementById("commentText").value;
  activeDateFilter = document.getElementById("dateText").value;

  var htmlText = "";
  var opening = "<li>";
  var closing = "</li>";

  if (activeHastagFilter != "")
  {
    htmlText += opening + activeHastagFilter + closing;
  }

  if (activeCaptionFilter != "")
  {
    htmlText += opening + activeCaptionFilter + closing;
  }

  if (activeCommentFilter != "")
  {
    htmlText += opening + activeCommentFilter + closing;
  }

  if (activeDateFilter != "")
  {
    htmlText += opening + activeDateFilter + closing;
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

// ************************
//     Pinned Searches
// ************************
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
