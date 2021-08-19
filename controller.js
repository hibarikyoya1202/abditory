const quoteAPI = "https://api.quotable.io/random"
const defaultQuote = '"“People where you live," the little prince said, "grow five thousand roses in one garden... yet they don\'t find what they\'re looking for.""'
const defaultAuthor = "- Little Prince （Antoine de Saint-Exupéry) -"
const googleAPI = "https://www.google.com/search?q="
const wikiAPI = "https://en.wikipedia.org/w/api.php"
var quote = $('#quote')
var authorDiv = $('#author .author-text')
var anotherQuoteBtn = $('.another-quote a')
var authorImg = $('#author-img img')
var authorInfo = $('#author-img .info .des')
var currentAuthor
var text_story = $('.text_story')



authorDiv.on('click', function (event) {
	url = googleAPI + currentAuthor;
	openWindown(url)
})

function getImg(titles, callback) {
	params = {
		action: 'query',
		titles: titles,
		prop: 'pageimages|extracts',
    explaintext: 1,
		format: 'json',
		pithumbsize: '720'
	}
	$.ajax({
		type: "GET",
		"headers": {
			"accept": "application/json",
			"Access-Control-Allow-Origin":"*"
			},
		url: wikiAPI,
		data: params,
    crossDomain: true,
    dataType: 'jsonp',
		success: callback
	});
}


function getQuote(callback) {
	params = {minLength: 50}
	if (window.innerWidth <= 768) {
		params = {
			maxLength: 100
		}
	}
	$.ajax({
		type: "GET",
		data: params,
		url: quoteAPI,
		success: callback
	});
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

function getAuthorImg(author) {
  getImg(author, function (data) {
    setAuthorImg(data)
    $('#author')[0].style.pointerEvents = ''
  })
}

function setAuthorImg(data) {
  try {
    if (data.query.pages[Object.keys(data.query.pages)[0]]) {
      authorImg[0].src = data.query.pages[Object.keys(data.query.pages)[0]].thumbnail.source
      authorInfo[0].innerHTML ='<p>' + data.query.pages[Object.keys(data.query.pages)[0]].extract + '</p>'
    }
  } catch (err) {
    $('#author-img')[0].style.display = 'none'
  }
  
}



function callbackAfterGetQuote(data) {
	if (data.content) {
		setInfo(data.content)
		setAuthor(data.author)
	} else {
		setQuote(defaultQuote)
		setAuthor(defaultAuthor)
	}
  $('#author')[0].style.pointerEvents = 'none'
  getAuthorImg(data.author)

	text_story[0].style.display = 'block'
}


anotherQuoteBtn.on('click', function (e) {
	getQuote(function (data) {
    $('#author')[0].style.pointerEvents = 'none'
    getAuthorImg(data.author)
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
