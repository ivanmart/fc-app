/*global jQuery, Handlebars, Router */
jQuery(function ($) {
	'use strict';

	// Handlebars equality helper
	Handlebars.registerHelper('eq', function (a, b, options) {
		return a === b ? options.fn(this) : options.inverse(this);
	});


	// Utilities
	var util = {
	};


	// Application
	var App = {

		cacheElements: function () {
			this.indexTemplate = Handlebars.compile($('#index-template').html());
			this.listTemplate = Handlebars.compile($('#list-template').html());
			this.detailTemplate = Handlebars.compile($('#detail-template').html());
			this.blogTemplate = Handlebars.compile($('#blog-template').html());
			this.aboutTemplate = Handlebars.compile($('#about-template').html());
			this.anketaTemplate = Handlebars.compile($('#anketa-template').html());
			this.$fcApp = $('#fc-app');
			this.$header = this.$fcApp.find('#header');
			this.$main = this.$fcApp.find('#main');
			this.snapper = new Snap({element: $('#fc-app')});
		},

		bindEvents: function () {
			$('.menu-toggle').on('click', function() {this.snapper.open('right')}.bind(this));
		},

		index: function() {
			console.log('index page');
		},

		list: function () {
			console.log('list avoked');
		},
	
		detail: function (sex, id) {
			this.$main.html(this.detailTemplate({id: sex + ' ' + id}));
		},
	
		about: function () {
			console.log('about avoked');
		},
	
		blog: function () {
			console.log('blog avoked');
		},
	
		init: function () {
			this.cacheElements ();
			this.bindEvents ();
			new Router({
			    '/': function () { this.index() }.bind(this),
			    '/(men|women)/?': function (gen) { this.list(gen) }.bind(this),
			    '/(men|women)/:id/?': function (gen, id) { this.detail(gen, id) }.bind(this),
			    '/about/?': function () { this.about() }.bind(this),
			    '/blog/?': function () { this.blog() }.bind(this)
		    }).init();
		},

	};

	App.init();

});