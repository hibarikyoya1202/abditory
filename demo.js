var quoteAPI = "https://api.quotable.io/random"


$.get(
  quoteAPI,
  function(data) {
     alert('page content: ' + data);
  }
);

