

$(document).ready(function(){
  var currentFilter = "";
  var address = window.location.href;

  $('.savedSearches').hide();

  if (address.indexOf('%') != -1)
  {
    currentFilter = address.substring(address.indexOf('%') + 1, address.length);
    $('.searchInput').val(currentFilter);
  }

  $('.toggleSavedSearches').click(function(e){
    e.preventDefault();
    e.stopPropagation();

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
    e.preventDefault();
    e.stopPropagation();

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

  $('.removeSearch').click(function(e){
    e.preventDefault();
    e.stopPropagation();

    removeSearch(e.target.id);
  });

  $('.applySearch').click(function(e){
    e.preventDefault();
    e.stopPropagation();

    runSearch(e.target.id);
  });

  // Modify search function
  $('.searchSave').click(function(e){
    e.preventDefault();
    e.stopPropagation();

    var currentFilter = $('.searchInput').val();

    if (currentFilter.indexOf('#') != -1)
    {
      $('.searchInput').addClass('error');
    }
    else
    {
      $('.searchInput').removeClass('error');
      saveSearch(currentFilter);
    }
  });

  function removeSearch(searchTerm)
  {

  };

  function saveSearch(searchTerm)
  {
    var saveTermUrl = "http://localhost:8080/saveSearch%" + searchTerm;
    $.ajax({
        type: 'POST',
        url: saveTermUrl
    });
  };

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
