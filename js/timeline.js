
(function(){

	function TimeLine (parentId, content) {
		this.parentId = parentId || '';
		this.content = content || '';
		this.parentElem = (this.parentId) ? document.getElementById(parentId) : null;
	}

	/**
	 * Create HTML of timeline.
	 */
	TimeLine.prototype.createHTML = function () {

		var html = '';

		html += this.createButton();

		if (this.content) {
			//Create all blocks (decades 1950, 1960, 1970...)
			for (var i = 0, amount = this.content.length; i < amount; i++) {
				html += this.createBlock(this.content[i]);
			}
		}

		html += this.createButton();

		if (this.parentElem) {
			this.parentElem.innerHTML = html;
		}


	}

	/**
	 * Create button of timeline (ExpandAll/ColapseAll).
	 */
	TimeLine.prototype.createButton = function() {

		var html = '';
		var buttonText = '+ expand all';

		html += '<button class="timeline-toggle">'+buttonText+'</button>';
		html +=	'<br class="clear">';

		return html;

	}

	/**
	 * Create a block of events.
	 *
	 * @block {Object} block content.
	 */
	TimeLine.prototype.createBlock = function(block) {

		var html = '';

		if (!block) {
			return '';
		}

		html += ['<div class="timeline-wrapper">',
				 '<h2 class="timeline-time"><span>'+block.decade+'</span></h2>',
				 '<dl class="timeline-series">'].join('');

		if (block['games']) {
			for (var i = 0, amount = block['games'].length; i < amount; i++) {
				html += this.createBlockItem(block['games'][i]);
			}	
		}

		html += ['</dl>', '</div>'].join('');


		return html;

	}

	/**
	 * Create an event (item) on block, in this case decade.
	 *
	 * @item {Object} game/console item.
	 */
	TimeLine.prototype.createBlockItem = function(item) {

		var html = '';
		var nameLowerTrimmed = ''; // lowercase without spaces

		if (!item) {
			return '';
		}

		html += '<span class="tick tick-before"></span>';
		
		if (item.name) {

			nameLowerTrimmed = item.name.replace(/ /g,'').toLowerCase();

			html += '<dt id="'+nameLowerTrimmed+'"><a>'+ item.year +' - '+ item.name+'</a></dt>';
		}
		
		html += '<span class="tick tick-after"></span>';
		html += '<dd class="timeline-event-content" id="'+nameLowerTrimmed+'EX" style="display: none;">';
		html += '<div class="media">';

		// add main image
		if (item.main_img) {

			var image_name = (item['main_img'].name) ? item['main_img'].name : item['main_img']; // temp
			html += '<img src="'+ this.getBaseImagePath(item) + image_name + '" alt="">';
		}

		html += '</div>';
		
		// add year
		//html += '<p><b>Ano:</b> ' + item.year + '</p>';

		// adding authors
		html += this.addAuthors(item);

		// adding company
		html += this.addCompany(item);

		// adding resume
		if (item.resume) {
			html += '<p>' + item.resume + '</p>';
		}

		// adding video
		html += this.addVideos(item);

		// adding demos
		html += this.addDemos(item);

		// adding references
		html += this.addReferences(item);

		html += '<br class="clear">';
		html += '</dd>';

		return html;
	}

	/**
	 * Create HTML for all authors of specific event.
	 *
	 * @item {Object} game/console item
	 */
	TimeLine.prototype.addAuthors = function (item) {

		var html = '';

		if (!item.authors) {
			return '';
		}

		if (item.authors.length > 0) {
			html += '<p><b>Criador:</b> ' + item.authors.join(', ') + '</p>';
		}

		return html;
	}

	/**
	 * Create HTML for all authors of specific event.
	 *
	 * @item {Object} game/console item
	 */
	TimeLine.prototype.addCompany = function (item) {

		var html = '';

		if (!item.company) {
			return '';
		}

		if (item.company.length > 0) {

			html += '<p><b>Empresa:</b> ';
			html += item.company.join(', ');
			html += '</p>';
		}

		return html;
	}

	/**
	 * Create HTML for all videos of specific event.
	 *
	 * @item {Object} game/console item
	 */
	TimeLine.prototype.addVideos = function (item) {

		var html = '';

		if (!item.video_gameplay) {
			return '';
		}

		if (item.video_gameplay.length > 0) {
			if (item.video_gameplay[0].url) { // get only first item
				html += '<p>'+'<b>';
				html += '<a href="'+item.video_gameplay[0].url+'" class="venobox_custom" data-type="youtube" data-overlay="rgba(0,0,0,0.5)">Gameplay Video</a>';
				html += '</b>'+'</p>';
			}
		}

		return html;
	}

	/**
	 * Create HTML for all Demos of specific event.
	 *
	 * @item {Object} game/console item
	 */
	TimeLine.prototype.addDemos = function (item) {

		var html = '';

		if (!item.demos) {
			return '';
		}

		if (item.demos.length > 0) {
			html += '<p><b>'+ 'Demos:' +'</b></p>';
			html += '<ol>';
			for (var i=0, amount=item.demos.length; i < amount; i++) {
				if (item.demos[i].url && item.demos[i].caption) {
					html += '<li>';
					html += '<a target="_blank" href="'+item.demos[i].url+'">' + Utils.capitalizeFirstLetter(item.demos[i].caption) + '</a>'; 
					html += '</li>';
				}
			}
			html += '</ol>';
		}

		return html;
	}

	/**
	 * Create HTML for all References of specific event.
	 *
	 * @item {Object} game/console item
	 */
	TimeLine.prototype.addReferences = function (item) {

		var html = '';

		if (!item.references) {
			return '';
		}

		if (item.references.length > 0) {
			html += '<p><b>'+ 'Referências:' +'</b></p>';
			html += '<ol>';
			for (var i=0, amount=item.references.length; i < amount; i++) {
				if (item.references[i].url && item.references[i].caption) {
					html += '<li>'; 
					html += '<a target="_blank" href="'+item.references[i].url+'">' + Utils.capitalizeFirstLetter(item.references[i].caption) + '</a>'; 
					html += '</li>';
				}
			}
			html += '</ol>';
		}

		return html;
	}

	/**
	 * Get base image path.
	 *
	 * @item {Object} game/console item
	 */
	TimeLine.prototype.getBaseImagePath = function(item) {

		var path = '';
		var name_dir = '';

		if (!item) {
			return '';
		}

		if (item.image_dir) {
			name_dir = item.image_dir;
		} else {
			name_dir = item.name.replace(/ /g,'').toLowerCase();
		}

		path = 'images/' + item.type + '/' + item.year +'/'+ name_dir + '/';

		return path;

	}


	// make it global
	if (!window.TimeLine) {
		window.TimeLine = TimeLine;	
	}
	

})();


