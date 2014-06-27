/**
 * MyWidearea 0.0.1
 * @author Martin Endler me@martinendler.cz
 */
var MyWidearea = function(settings) {
	if (settings)
	{
		if (settings.scheme)
		{
			this.scheme = settings.scheme;
		}
		if (settings.iconActivate)
		{
			this.iconActivate = settings.iconActivate;
		}
		if (settings.iconClose)
		{
			this.iconClose = settings.iconClose;
		}
		if (settings.iconClose)
		{
			this.iconClose = settings.iconClose;
		}
		
	}
	this.initialize();
};

MyWidearea.prototype = {
	scheme: 'light',
	iconClose: '<i class="fa fa-times"></i>',
	iconActivate: '<i class="fa fa-arrows-alt"></i>',
	iconContrast: '<i class="fa fa-adjust"></i>',
	textareas: {},
	iconsWrapper: null,
	overlay: null,
	state: 0,
	recalculator: null,
	fullscreen: false,
	/**
	 * Create base elements
	 */
	initialize: function()
	{
		console.log('MyWidearea: initializing');
		var self = this;
		//overlay
		this.overlay = $(document.createElement('div'));
		this.overlay.addClass('mywidearea-overlay');
		this.overlay.addClass('hidden');
		this.overlay.addClass(this.scheme);
		this.overlay.appendTo('body');

		var controlWrapper = $(document.createElement('div'));
		controlWrapper.addClass('mywidearea-control-wrapper');

		var iClose = $(document.createElement('a'));
		iClose.html(this.iconClose);
		iClose.attr('href', '#');
		iClose.appendTo(controlWrapper);

		iClose.click(function(event) {
			event.preventDefault();
			self.fullscreenOff();
		});

		var iContrast = $(document.createElement('a'));
		iContrast.html(this.iconContrast);
		iContrast.attr('href', '#');
		iContrast.appendTo(controlWrapper);

		iContrast.click(function(event) {
			event.preventDefault();
			self.toogleScheme();
		});

		controlWrapper.appendTo(this.overlay);

		//icon wrapper
		this.iconsWrapper = $(document.createElement('div'));
		this.iconsWrapper.addClass('mywidearea-icons-wrapper');
		this.iconsWrapper.appendTo('body');

		$(document).on('keyup', function(event) {
			if (event.keyCode === 27) //ESC
			{
				self.fullscreenOff();
			}
		});
	},
	/**
	 * Enable wideareas
	 * ! reenable is supported
	 */
	enable: function()
	{
		console.log('MyWidearea: enabling');
		if (this.state === 1)
		{
			//reenable
			//cleanig
			console.log('MyWidearea: cleaning');
			clearInterval(this.recalculator);
			this.textareas = {};
			this.state = 0;
			this.overlay.find('textarea').remove();
			this.iconsWrapper.html('');
			this.fullscreen = false;
		}

		var self = this;

		$('textarea[data-mywidearea="true"]').each(function(index, elem) {
			var textarea = $(elem);
			textarea.attr('data-mywidearea-id', index);
			self.textareas[index] = textarea;
			self.addIcon(index);
		});

		this.calculateIconsPosition();

		this.recalculator = setInterval(function() {
			self.calculateIconsPosition();
		}, 200);

		this.state = 1;

	},
	addIcon: function(textareaId)
	{
		var iconWrapper = $(document.createElement('div'));
		iconWrapper.addClass('mywidearea-icon-wrapper');
		iconWrapper.addClass('hidden');
		iconWrapper.attr('data-mywidearea-id', textareaId);

		var icon = $(document.createElement('a'));
		icon.html(this.iconActivate);
		icon.attr('href', '#');
		icon.appendTo(iconWrapper);

		var self = this;

		icon.click(function(event) {
			event.preventDefault();
			var id = $(this).parents('.mywidearea-icon-wrapper').attr('data-mywidearea-id');
			self.fullscreenOn(id);
		});

		iconWrapper.appendTo(this.iconsWrapper);
	},
	calculateIconsPosition: function()
	{
		//console.log('MyWidearea: calculating position of icons');
		for (i in this.textareas)
		{
			var id = i;
			var area = this.textareas[i];
			var icon = $('.mywidearea-icon-wrapper[data-mywidearea-id="' + id + '"]');

			if (area.css('display') !== 'none')
			{
				var areaPosition = area.offset();
				var areaWidth = area.outerWidth();

				areaPosition = {
					top: Math.round(areaPosition.top),
					left: Math.round(areaPosition.left)
				};

				var iconPosition = {
					top: areaPosition.top + 5,
					left: areaPosition.left + areaWidth - 25
				};

				icon.removeClass('hidden');
				icon.css({
					top: iconPosition.top + 'px',
					left: iconPosition.left + 'px'
				});
			}
			else
			{
				icon.addClass('hidden');
			}
		}
	},
	toogleScheme: function()
	{
		console.log('MyWidearea: toogling scheme');

		if (this.scheme === 'light')
		{
			this.overlay.removeClass('light');
			this.overlay.addClass('dark');
			this.scheme = 'dark';
		}
		else if (this.scheme === 'dark')
		{
			this.overlay.removeClass('dark');
			this.overlay.addClass('light');
			this.scheme = 'light';
		}
	},
	fullscreenOn: function(textareaId)
	{
		console.log('MyWidearea: turning fullscreen ON for textarea ' + textareaId);
		var area = this.textareas[textareaId];
		var copy = $(document.createElement('textarea'));
		copy.attr('placeholder', area.attr('placeholder'));
		copy.attr('data-mywidearea-id', textareaId);
		copy.val(area.val());
		copy.appendTo(this.overlay);
		this.fullscreen = true;
		this.overlay.removeClass('hidden');
		copy.focus();

	},
	fullscreenOff: function()
	{
		if (this.fullscreen)
		{
			console.log('MyWidearea: turning fullscreen OFF');
			var copy = this.overlay.find('textarea');
			var area = this.textareas[copy.attr('data-mywidearea-id')];
			area.val(copy.val());
			this.fullscreen = false;
			this.overlay.addClass('hidden');
			copy.remove();
		}
	}
};
