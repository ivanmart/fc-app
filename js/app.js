(function ($) {
	'use strict';

	// backend url
	var baseUrl = 'http://www.fashiontime.ru';
	var dataUrl = baseUrl + '/groups/fashioncommunity/?json';

	// caching
	var indexTemplate = Handlebars.compile($('#index-template').html());
	var listTemplate = Handlebars.compile($('#list-template').html());
	var detailTemplate = Handlebars.compile($('#detail-template').html());
	var blogTemplate = Handlebars.compile($('#blog-template').html());
	var aboutTemplate = Handlebars.compile($('#about-template').html());
	var enrollTemplate = Handlebars.compile($('#enroll-template').html());
	var $fcApp = $('#fc-app');
	var $header = $fcApp.find('#header');
	var $main = $fcApp.find('#main');
	var $detail = $('#detail-content');

	// binding events
	var bindEvents = function () {

		// open menu
		$('.burger, .menu .close').on('click',function(){$('.menu').toggleClass('menu-open')});

		// menu icon animation
		$('.burger').on({
			mouseenter: function() {
				$( this ).addClass('burger-hover');
			}, mouseleave: function() {
				$( this ).removeClass('burger-hover');
			}
		});

		// menu click
		$('.menu a').on('click',function(){
			$('.menu a').removeClass('active');
			$(this).addClass('active');
		});

		// next slide
		var next = function () {
			if(shown <= cnt-1) {
				$('.detail-gallery li').css('display','none');
				shown = shown + 2;
				$('.detail-gallery li:nth-child('+shown+'), .detail-gallery li:nth-child('+(shown+1)+')').css('display','inline-block');
			}
		}
		$(document).on('click', '.detail-gallery a.next', next);

		// prev slide
		var prev = function () {
			if(shown > 1) {
				$('.detail-gallery li').css('display','none');
				shown = shown - 2;
				$('.detail-gallery li:nth-child('+shown+'), .detail-gallery li:nth-child('+(shown+1)+')').css('display','inline-block');
			}
		}
		$(document).on('click', '.detail-gallery a.prev', prev);

		// close detail view
		var close = function () {
			$('#detail-holder').fadeOut();
			window.location.href = '#/'+curGen+'/';
		}
		$('#detail-holder .close').on('click',close);

		// keys events
		$(document).on('keydown', function(e){
		    if (e.keyCode == 27) {
		    	close();
		    } else if (e.keyCode == 39) {
		    	next();
		    } else if(e.keyCode == 37) {
		    	prev();
		    }
		});

	};

	// index page
	var index = function() {
		curGen = false;
		$main.html(indexTemplate());
	};

	// list models
	var list = function (gen) {
		if(curGen) $('#detail-holder').fadeOut();
		if (gen != curGen) {
			$main.html(listTemplate({gen: gen, models: data.models[gen]}));

			// Isotope
			var $grid = $('.list-holder ul').isotope({itemSelector: '.grid-item'});

			// layout Isotope after each image loads
			$grid.imagesLoaded().progress( function() {
				$grid.isotope('layout');
			});

			curGen = gen;
		}
	};

	// detail model view
	var detail = function (gen, id) {
		shown = 1;
		var model = $.grep(data.models[gen], function(e){return e.id == id});
		cnt = model[0].photos.length;
		$detail.html(detailTemplate({model: model[0], baseUrl: baseUrl}));
		$('#detail-holder').fadeIn();
		if(!curGen) list(gen);
	};

	// about page
	var about = function () {
		curGen = false;
		$main.html($(aboutTemplate({agency: data})));
	};

	// blog page
	var blog = function () {
		curGen = false;
		console.log(data);
		$main.html(blogTemplate({agency: data, baseUrl: baseUrl}));
	};

	// enrollment form
	var enroll = function () {
		curGen = false;
		$main.html('Enrollment form here will be.');
	};


	// main

	bindEvents ();

	// current displayed photo
	var shown;

	// count of photos
	var cnt;

	// current gender
	var curGen;

	// get all data at once
	var data;
	$.ajaxSetup({ cache: false });
	$.getJSON(dataUrl, function(json){
		
		data = json;

		// router
		var router = Router({
		    '/': index,
		    '/(men|women)/?': list,
		    '/(men|women)/:id/?': detail,
		    '/about/?': about,
		    '/blog/?': blog,
		    '/enroll/?': enroll
		    }).configure({
		    	before: function() {
					$('.menu').removeClass('menu-open');
				}
		    }).init();
		
		if(!window.location.hash) router.setRoute('/');

	    $('#loading').animate({opacity:0}, 500, function(){this.remove()});

	});

	// intro animation
	for (var i = 1; i < 4; i++)
		(function(i){
			setTimeout(function() {$('#intro').addClass('animate'+i)}, i*500);
		}(i))
	setTimeout(function() {$('#intro').remove()}, 3000);

})(jQuery);