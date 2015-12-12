$(document).ready(function(){
    fetchProfile();
  $('.submitProfile').click(function(e) {
    e.preventDefault();
    var profileParameters = {
      name: $('.nameTextBox').val(),
      email: $('.emailTextBox').val(),
      bio: $('.bioTextBox').val(),
    };
    console.log('Submit Profile');
        $.get( '/updateProfile', profileParameters, function(data) {});
        alert('Profile Saved Succesfully!');
  });
  function fetchProfile(){
    $.get( '/fetchProfile', {}, function(data) {
      $('.nameTextBox').val(data.name),
      $('.bioTextBox').val(data.bio),
      $('.emailTextBox').val(data.email)
    });
  }
});
