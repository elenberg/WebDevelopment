$(document).ready(function(){
    fetchProfile();
  $('.submitProfile').click(function(e) {
    var profileParameters = {
      name: $('.nameTextBox').val(),
      email: $('.emailTextBox').val(),
      bio: $('.bioTextBox').val(),
    };
    console.log('Submit Profile');
        $.get( '/updateProfile', profileParameters, function(data) {});
  });
  function fetchProfile(){
    $.get( '/updateProfile', {}, function(data) {
      $('.nameTextBox').val(data.name),
      $('.bioTextBox').val(data.bio),
      $('.emailTextBox').val(data.email)
    });
  }
});
