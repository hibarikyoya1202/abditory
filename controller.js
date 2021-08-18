const quoteAPI = "https://api.quotable.io/random"
const defaultQuote = '"“People where you live," the little prince said, "grow five thousand roses in one garden... yet they don\'t find what they\'re looking for.""'
const defaultAuthor = "- Little Prince （Antoine de Saint-Exupéry) -"
const googleAPI = "https://www.google.com/search?q="
var quote = $('#quote')
var authorDiv = $('.author-text')
var currentAuthor

var text_story = $('.text_story')



authorDiv.on('click', function (event) {
  url = googleAPI + currentAuthor;
  openWindown(url)
})

$.get(
	quoteAPI,
  {minLength: 50},
	callbackAfterGetQuote
);



function callbackAfterGetQuote(data) {
  console.log(data)
	if (data.content) {
		setInfo(data.content)
    setAuthor(data.author)
	} else {
    setQuote(defaultQuote)
    setAuthor(data.defaultAuthor)
  }



  text_story[0].style.display = 'block'
}



function setInfo(content) {
  quote[0].innerHTML = content
  
}


function setAuthor(author) {
  let authorText = '- ' + author + ' -'
  currentAuthor = author
  console.log(authorText);
  console.log(author)
  authorDiv[0].innerText = authorText
}



function openWindown(url) {
  window.open(url,"_self")
}