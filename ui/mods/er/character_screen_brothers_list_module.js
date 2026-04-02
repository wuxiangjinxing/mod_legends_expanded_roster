CharacterScreenBrothersListModule.mNumActiveMax = 36;
	
CharacterScreenBrothersListModule.prototype.createBrotherSlots = function (_parentDiv)
{
	var self = this;

	this.mSlots = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ];

	var dropHandler = function (ev, dd)
	{
		var drag = $(dd.drag);
		var drop = $(dd.drop);
		var proxy = $(dd.proxy);

		if (proxy === undefined || proxy.data('idx') === undefined || drop === undefined || drop.data('idx') === undefined)
		{
			return false;
		}

		drag.removeClass('is-dragged');

		if (drag.data('idx') == drop.data('idx'))
		{
			return false;
		}

		// number in formation is limited
		if (self.mNumActive >= self.mNumActiveMax && drag.data('idx') > 36 && drop.data('idx') <= 36 && self.mSlots[drop.data('idx')].data('child') == null)
		{
			return false;
		}

		// always keep at least 1 in formation
		if (self.mNumActive == 1 && drag.data('idx') <= 36 && drop.data('idx') > 36 && self.mSlots[drop.data('idx')].data('child') == null)
		{
			return false;
		}

		// do the swapping
		self.swapSlots(drag.data('idx'), drop.data('idx'));
	};

	for (var i = 0; i < 36; ++i)
	{
		if(i < 36)
			this.mSlots[i] = $('<div class="ui-control is-brother-slot is-roster-slot"/>');
		else
			this.mSlots[i] = $('<div class="ui-control is-brother-slot is-reserve-slot"/>');

		_parentDiv.append(this.mSlots[i]);

		this.mSlots[i].data('idx', i);
		this.mSlots[i].data('child', null);
		this.mSlots[i].drop("end", dropHandler);
	}

	/*$('.is-brother-slot')
	  .drop("start", function ()
	  {
		  $(this).addClass("is-active-slot");
	  })
	  .drop("end", function ()
	  {
		  $(this).removeClass("is-active-slot");
	  });*/
};

CharacterScreenBrothersListModule.prototype.addBrotherSlotDIV = function (_parentDiv, _data, _index, _allowReordering)
{
	var self = this;
	var screen = $('.character-screen');

	// create: slot & background layer
	var result = _parentDiv.createListBrother(_data[CharacterScreenIdentifier.Entity.Id]);
	result.attr('id', 'slot-index_' + _data[CharacterScreenIdentifier.Entity.Id]);
	result.data('ID', _data[CharacterScreenIdentifier.Entity.Id]);
	result.data('idx', _index);
	result.data('inReserves', _data['inReserves']);

	this.mSlots[_index].data('child', result);

	if (_index <= 36)
		++this.mNumActive;

	// drag handler
	if (_allowReordering)
	{
		result.drag("start", function (ev, dd)
		{
			// dont allow drag if this is an empty slot
			/*var data = $(this).data('item');
			if (data.isEmpty === true)
			{
				return false;
			}*/

			// build proxy
			var proxy = $('<div class="ui-control brother is-proxy"/>');
			proxy.appendTo(document.body);
			proxy.data('idx', _index);

			var imageLayer = result.find('.image-layer:first');
			if (imageLayer.length > 0)
			{
				imageLayer = imageLayer.clone();
				proxy.append(imageLayer);
			}

			$(dd.drag).addClass('is-dragged');

			return proxy;
		}, { distance: 3 });

		result.drag(function (ev, dd)
		{
			$(dd.proxy).css({ top: dd.offsetY, left: dd.offsetX });
		}, { relative: false, distance: 3 });

		result.drag("end", function (ev, dd)
		{
			var drag = $(dd.drag);
			var drop = $(dd.drop);
			var proxy = $(dd.proxy);

			var allowDragEnd = true; // TODO: check what we're dropping onto

			// not dropped into anything?
			if (drop.length === 0 || allowDragEnd === false)
			{
				proxy.velocity("finish", true).velocity({ top: dd.originalY, left: dd.originalX },
				{
					duration: 300,
					complete: function ()
					{
						proxy.remove();
						drag.removeClass('is-dragged');
					}
				});
			}
			else
			{
				proxy.remove();
			}
		}, { drop: '.is-brother-slot' });
	}

	// update image & name
	var character = _data[CharacterScreenIdentifier.Entity.Character.Key];
	var imageOffsetX = (CharacterScreenIdentifier.Entity.Character.ImageOffsetX in character ? character[CharacterScreenIdentifier.Entity.Character.ImageOffsetX] : 0);
	var imageOffsetY = (CharacterScreenIdentifier.Entity.Character.ImageOffsetY in character ? character[CharacterScreenIdentifier.Entity.Character.ImageOffsetY] : 0);

	result.assignListBrotherImage(Path.PROCEDURAL + character[CharacterScreenIdentifier.Entity.Character.ImagePath], imageOffsetX, imageOffsetY, 0.66);
	//result.assignListBrotherName(character[CharacterScreenIdentifier.Entity.Character.Name]);
	//result.assignListBrotherDailyMoneyCost(character[CharacterScreenIdentifier.Entity.Character.DailyMoneyCost]);

	if(CharacterScreenIdentifier.Entity.Character.LeveledUp in character && character[CharacterScreenIdentifier.Entity.Character.LeveledUp] === true)
	{
		result.assignListBrotherLeveledUp();
	}

	/*if(CharacterScreenIdentifier.Entity.Character.DaysWounded in character && character[CharacterScreenIdentifier.Entity.Character.DaysWounded] === true)
	{
		result.assignListBrotherDaysWounded();
	}*/

	if('inReserves' in character && character['inReserves'] && this.mDataSource.getInventoryMode() == CharacterScreenDatasourceIdentifier.InventoryMode.Stash)
	{
		result.showListBrotherMoodImage(true, 'ui/buttons/mood_heal.png');
	}
	else if('moodIcon' in character && this.mDataSource.getInventoryMode() == CharacterScreenDatasourceIdentifier.InventoryMode.Stash)
	{
		result.showListBrotherMoodImage(this.IsMoodVisible, character['moodIcon']);
	}

	for(var i = 0; i != _data['injuries'].length && i < 3; ++i)
	{
		result.assignListBrotherStatusEffect(_data['injuries'][i].imagePath, _data[CharacterScreenIdentifier.Entity.Id], _data['injuries'][i].id)
	}

	if(_data['injuries'].length <= 2 && _data['stats'].hitpoints < _data['stats'].hitpointsMax)
	{
		result.assignListBrotherDaysWounded();
	}

	result.assignListBrotherClickHandler(function (_brother, _event)
	{
		var data = _brother.data('brother');
		self.mDataSource.selectedBrotherById(data.id);
	});
};

CharacterScreenBrothersListModule.prototype.swapSlots = function (_a, _b)
{
	// dragging into empty slot
	if(this.mSlots[_b].data('child') == null)
	{
		var A = this.mSlots[_a].data('child');

		A.data('idx', _b);
		A.appendTo(this.mSlots[_b]);

		this.mSlots[_b].data('child', A);
		this.mSlots[_a].data('child', null);

		if (_a <= 36 && _b > 36)
			--this.mNumActive;
		else if (_a > 36 && _b <= 36)
			++this.mNumActive;

		this.updateBlockedSlots();

		this.mDataSource.swapBrothers(_a, _b);
		this.mDataSource.notifyBackendUpdateRosterPosition(A.data('ID'), _b);

		if(this.mDataSource.getSelectedBrotherIndex() == _a)
		{
			this.mDataSource.setSelectedBrotherIndex(_b, true);
		}
	}

	// swapping two full slots
	else
	{
		var A = this.mSlots[_a].data('child');
		var B = this.mSlots[_b].data('child');

		A.data('idx', _b);
		B.data('idx', _a);

		B.detach();

		A.appendTo(this.mSlots[_b]);
		this.mSlots[_b].data('child', A);

		B.appendTo(this.mSlots[_a]);
		this.mSlots[_a].data('child', B);

		this.mDataSource.swapBrothers(_a, _b);
		this.mDataSource.notifyBackendUpdateRosterPosition(A.data('ID'), _b);
		this.mDataSource.notifyBackendUpdateRosterPosition(B.data('ID'), _a);

		if (this.mDataSource.getSelectedBrotherIndex() == _a)
		{
			this.mDataSource.setSelectedBrotherIndex(_b, true);
		}
		else if (this.mDataSource.getSelectedBrotherIndex() == _b)
		{
			this.mDataSource.setSelectedBrotherIndex(_a, true);
		}
	}

	this.updateRosterLabel();
};