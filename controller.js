const quoteAPI = "https://api.quotable.io/random"
const defaultQuote = '"“People where you live," the little prince said, "grow five thousand roses in one garden... yet they don\'t find what they\'re looking for.""'
const defaultAuthor = "- Little Prince （Antoine de Saint-Exupéry) -"
const googleAPI = "https://www.google.com/search?q="
const wikiAPI = "https://en.wikipedia.org/w/api.php"
const randomWordAPI = "https://san-random-words.vercel.app/"
const dictionaryAPI = "https://api.dictionaryapi.dev/api/v2/entries/en/{0}"

var quote = $('#quote')
var authorDiv = $('#author .author-text')
var anotherQuoteBtn = $('.another-quote a')
var anotherWordsBtn = $('.another-word a')
var authorImg = $('#author-img img')
var authorInfo = $('#author-img .info .des')
var currentAuthor
var text_story = $('.text_story')

function getWord(callback) {
	$.ajax({
		type: "GET",
		url: randomWordAPI,
			dataType: 'json',
		success: callback
	});
}

function getDefination(word, callback, callbackFail) {
	$.ajax({
		type: "GET",
		url: dictionaryAPI.replace('{0}', word),
			dataType: 'json',
		success: callback,
		error: callbackFail
	});
}

authorDiv.on('click', function (event) {
	url = googleAPI + currentSearch;
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
		$(classAffect)[0].style.opacity = 0;
		setTimeout(function () {
			$(classAffect)[0].style.opacity = 1;
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

function changeLogoImg(fileName) {
	$('#logo .logo img')[0].src = fileName
}


function setTheme(val) {
	if (val) {
		$('body').addClass('dark-theme')
		changeLogoImg('logo-dark-mode.svg')
		setCookie('light-theme', 'on', 30)
	} else {
		$('body').removeClass('dark-theme')
		changeLogoImg('logo.svg')
		setCookie('light-theme', 'off', 30)
	}
}
$('.bulk-toggle').on('click', function (e) {
	value = $(e.currentTarget).is(":checked")
	setCookie('light-theme', 'on', 30)
	setTheme(value)
})

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
		setQuote(data.content, data.author, 1000)
	} else {
		setQuote(defaultQuote,defaultAuthor, 1000)
	}
		$('#author')[0].style.pointerEvents = 'none'
		getAuthorImg(data.author)

	text_story[0].style.display = 'block'
	setLoading(false)
}


anotherQuoteBtn.on('click', function (e) {
	setLoading(true)
	getQuote(function (data) {
		$('#author')[0].style.pointerEvents = 'none'
		$('#author-img')[0].style.display = ''
		getAuthorImg(data.author)		
		if (data.content) {
			setQuote(data.content, data.author, 1000)
		} else {
			setQuote(defaultQuote, defaultAuthor, 1000)
		}

		setLoading(false)
		})
})


function callDefinationAPI(data) {
	getDefination(data[0].word, function(result) {
		setWordAndDefination(result[0].word, result[0].meanings[0].definitions[0].definition)
		setLoading(false)
	}, function (err) {
		if (err.status == '404') {
			getWord(callDefinationAPI)
		}
	})
}


function setWordAndDefination(word, definition) {
	$('#author-img')[0].style.display = 'none'
	$('#word.css-typing')[0].style.display= 'block'
	$('#quote').addClass('defination-text')
	typeEffect(word, '#word.css-typing', 1000)
	typeEffect(definition, '#quote.css-typing', 1000)
	typeEffect('Click To See More','#author .author-text', 1000)
	currentSearch = word
}

anotherWordsBtn.on('click', function (e) {
	setLoading(true)
	if (window.innerWidth <= 768) {
		getWord(function (data) {
			setWordAndDefination(data[0].word, data[0].definition)
			setLoading(false)
		})
	} else {
		getWord(callDefinationAPI)
	}
})


function setQuote(content, author, timeout = 0) {
	let authorText = '- ' + author + ' -'
	currentSearch = author
	$('#word.css-typing')[0].style.display= 'none'
	$('#quote').removeClass('defination-text')
	typeEffect(content, '#quote.css-typing', timeout)
	typeEffect(authorText,'#author .author-text', timeout)
}



function setLoading(val) {
	if (val) {
		$('.wrapper-loading')[0].style.display = 'block'
		$('.lds-heart')[0].style.display = 'block'
	} else {
		$('.wrapper-loading')[0].style.display = 'none'
		$('.lds-heart')[0].style.display = 'none'
	}
}
function openWindown(url) {
	window.open(url,"_blank")
}

function checkCookie() {
  let lightTheme = getCookie("light-theme");
  if (lightTheme == 'on') {
		setTheme(true)
		$('.bulk-toggle').attr("checked", true);
  } else {
		setTheme(false)
		$('.bulk-toggle').attr("checked", false);
  }
}


function setCookie(cname,cvalue,exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function init() {
	setLoading(true)
	getQuote(callbackAfterGetQuote);
	checkCookie()
}

init()