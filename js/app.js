/*global jQuery, Handlebars, Router */
(function ($) {
	'use strict';

	var baseUrl = "http://www.fashiontime.ru";
	var dataUrl = baseUrl + "/groups/fashioncommunity/?json";


	var indexTemplate = Handlebars.compile($('#index-template').html());
	var listTemplate = Handlebars.compile($('#list-template').html());
	var detailTemplate = Handlebars.compile($('#detail-template').html());
	var blogTemplate = Handlebars.compile($('#blog-template').html());
	var aboutTemplate = Handlebars.compile($('#about-template').html());
	var anketaTemplate = Handlebars.compile($('#anketa-template').html());
	var $fcApp = $('#fc-app');
	var $header = $fcApp.find('#header');
	var $main = $fcApp.find('#main');
	var $detail = $('#detail-content');


	var bindEvents = function () {

		$('.burger, .menu .close').on('click',function(){$('.menu').toggleClass('menu-open')});

		$('.burger').on({
			mouseenter: function() {
				$( this ).addClass( "burger-hover" );
			}, mouseleave: function() {
				$( this ).removeClass( "burger-hover" );
			}
		});

		$('.menu a').on('click',function(){
			$('.menu a').removeClass('active');
			$(this).addClass('active');
		});

		// slider

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

		var close = function () {
			$('#detail-holder').fadeOut();
			window.location.href = '#/'+curGen+'/';
		}
		$('#detail-holder .close').on('click',close);

		// keys
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

	var index = function() {
		$main.html(indexTemplate());
	};

	var list = function (gen) {
		if(curGen) $('#detail-holder').fadeOut();
		if (gen != curGen) {
			$main.html(listTemplate({gen: gen, models: data.models[gen]}));

			// Isotope
			var $grid = $('.list-holder ul');

			// layout Isotope after each image loads
			$grid.imagesLoaded().progress( function() {
				$grid.isotope();
			});

			curGen = gen;
		}
	};

	var detail = function (gen, id) {
		shown = 1;
		var model = $.grep(data.models[gen], function(e){return e.id == id});
		cnt = model[0].photos.length;
		console.log(cnt);
		$detail.html(detailTemplate({model: model[0]}));
		$('#detail-holder').fadeIn();
		if(!curGen) list(gen);
	};

	var about = function () {
		$main.html(aboutTemplate({agency: data}));
	};

	var blog = function () {
		console.log('blog invoked');
	};

	var anketa = function () {
		console.log('anketa invoked');
	};

	// var beforeRoute = function () {
	// 	console.log('beforeRoute');
	// 	$main.css('opacity', 0);
	// 	$main.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
	// 		$main.css('opacity',1);
	// 	});
	// }

	bindEvents ();

	// current displayed photo
	var shown;

	// count of photos
	var cnt;

	// current gender
	var curGen;

	// get all data at once
	var data;
	$.getJSON(dataUrl, function(json){
		
		data = json;
//		console.log (data);

		new Router({
		    '/': index,
		    '/(men|women)/?': list,
		    '/(men|women)/:id/?': detail,
		    '/about/?': about,
		    '/blog/?': blog,
		    '/anketa/?': anketa
		    }).configure({
		    	before: function() {
					$('.menu').removeClass('menu-open');
				}
		    }).init();

	    $('#loading').animate({opacity:0}, 500, function(){this.remove()});

	});

	// intro animation
	for (var i = 1; i < 4; i++)
		(function(i){
			setTimeout(function() {$('#intro').addClass('animate'+i)}, i*500);
		}(i))
	setTimeout(function() {$('#intro').remove()}, 3000);

})(jQuery);