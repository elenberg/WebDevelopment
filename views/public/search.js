$(document).ready(function(){
  var currentFilter = "";
  var address = window.location.href;

  if (address.indexOf('%') != -1)
  {
    currentFilter = address.substring(address.indexOf('%') + 1, address.length);
    $('.searchInput').val(currentFilter);
  }

  updateSearches();

  $('.toggleSavedSearches').click(function(e){
    if ($(this).hasClass('visible'))
    {
      $(this).removeClass('visible');
      $('.savedSearches').hide('slide', {direction: 'up'}, 1000);
    }
    else
    {
      $(this).addClass('visible');
      $('.savedSearches').show('slide', {direction: 'up'}, 1000);
    }
  });

  // Modify search function
  $('.searchSubmit').click(function(e){
    var currentFilter = $('.searchInput').val();

    if (currentFilter.indexOf('#') != -1)
    {
      $('.searchInput').addClass('error');
    }
    else
    {
      $('.searchInput').removeClass('error');
      runSearch(currentFilter);
    }
  });

  $('.searchInput').keypress(function (e) {
    if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
        $('.searchSubmit').click();
    }
  });

$(document).on('click', '.removeSearch', function(e){
    removeSearch(e.target.id);
  });

$(document).on('click', '.applySearch', function(e){
    runSearch(e.target.id);
  });

  // Modify search function
$(document).on('click', '.searchSave', function(e){
    var currentFilter = $('.searchInput').val();

    if (currentFilter.indexOf('#') != -1)
    {
      $('.searchInput').addClass('error');
    }
    else
    {
      $('.searchInput').removeClass('error');
      saveSearch(currentFilter);
      runSearch(currentFilter);
    }
  });


  function parseSearchTerms(data)
  {
    var firstTags = "<div id='pair'><button class='removeSearch' id='";
    var secondTags = "''> X</button><a class='applySearch' id='";
    var thirdTags = "'>";
    var finalTags = "</a></div>";
    var allHtml = "<ul>";

    for (i = 0; i < data.length; i++)
    {
      allHtml += firstTags + data[i] + secondTags + data[i] +
      thirdTags + data[i] + finalTags;
    }

    allHtml += "</ul>";
    return allHtml;
  }

  function removeSearch(searchTerm)
  {
    var parameters = { search: searchTerm };
    $.get( '/removeSearch', parameters, function(data) {
      var htmlTerms = parseSearchTerms(data);
      $('.savedSearches').html(htmlTerms);
    });
  };

  function saveSearch(searchTerm)
  {
    var parameters = { search: searchTerm };
    $.get( '/saveSearch', parameters, function(data) {
      var htmlTerms = parseSearchTerms(data);
      $('.savedSearches').html(htmlTerms);
    });
  };

  function updateSearches()
  {
    $.get( '/updateSearch', {}, function(data) {
      var htmlTerms = parseSearchTerms(data);
      $('.savedSearches').html(htmlTerms);
    });
  }

  function runSearch(searchTerm)
  {
    var newAddress = window.location.href;

    if (newAddress.indexOf('%') != -1)
    {
      newAddress = newAddress.substring(0, newAddress.indexOf('%'));
    }

    newAddress += "%" + searchTerm;
    window.location.href = newAddress;
  }
});
