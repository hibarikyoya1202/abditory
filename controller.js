const quoteAPI = "https://api.quotable.io/random"
const defaultQuote = '"“People where you live," the little prince said, "grow five thousand roses in one garden... yet they don\'t find what they\'re looking for.""'
const defaultAuthor = "- Little Prince （Antoine de Saint-Exupéry) -"
const googleAPI = "https://www.google.com/search?q="
var quote = $('#quote')
var authorDiv = $('#author .author-text')
var anotherQuoteBtn = $('.another-quote a')
var currentAuthor

var text_story = $('.text_story')



authorDiv.on('click', function (event) {
	url = googleAPI + currentAuthor;
	openWindown(url)
})



function getQuote(callback) {
  params = {minLength: 50}
  if (window.innerWidth <= 768) {
    params = {
      maxLength: 100
    }
  }
	$.get(
		quoteAPI,
		params,
		callback
	);
}

function typeEffect(string, classAffect, timeout = 0) {
	var spans = '<span>' + string.split('').join('</span><span>') + '</span>';  
  setTimeout(function () {
    $('.css-typing')[0].style.opacity = 1;
    $(classAffect)[0].innerText = ''
    $(spans).hide().appendTo(classAffect).each(function (i) {
      $(this).delay(50 * i).css({
        display: 'inline',
        opacity: 0
      }).animate({
        opacity: 1
      }, 100);
    });
  }, timeout)

}



function callbackAfterGetQuote(data) {
	if (data.content) {
		setInfo(data.content)
		setAuthor(data.author)
	} else {
		setQuote(defaultQuote)
		setAuthor(defaultAuthor)
	}

		text_story[0].style.display = 'block'
}


anotherQuoteBtn.on('click', function (e) {
	getQuote(function (data) {
    $('.css-typing')[0].style.opacity = 0;
    if (data.content) {
      setQuote(data.content, data.author, 1000)
    } else {
      setQuote(defaultQuote, defaultAuthor, 1000)
    }
  })
})


function setQuote(content, author, timeout = 0) {
  let authorText = '- ' + author + ' -'
  currentAuthor = author
  typeEffect(content, '.css-typing', timeout)
  typeEffect(authorText,'#author .author-text', timeout)
}

function setInfo(content) {
	typeEffect(content, '.css-typing')
}


function setAuthor(author) {
	let authorText = '- ' + author + ' -'
	currentAuthor = author
  typeEffect(authorText,'#author .author-text')
	
}



function openWindown(url) {
	window.open(url,"_blank")
}

function init() {
	getQuote(callbackAfterGetQuote);
}

init()
