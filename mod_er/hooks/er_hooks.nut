::ER.HookMod.hook("scripts/states/world/asset_manager", function(q){
	::logInfo("MOD_ER: increasing max roster size to 36");

	/* needs to be fully reimplemented as the original function hardcodes a max slot size of 27*/
	q.updateFormation = @( ) function( considerMaxBros = false )
	{
		local NOT_IN_FORMATION = 255;
		local formation = [];
		formation.resize(36, false); // this is hardcoded in vanilla at 27
		local roster = this.World.getPlayerRoster().getAll();
		local hasUnplaced = false;
		local inCombat = 0;

		foreach( b in roster )
		{
			if (b.getPlaceInFormation() != NOT_IN_FORMATION && formation[b.getPlaceInFormation()] == false && (!considerMaxBros || inCombat < this.m.BrothersMaxInCombat))
			{
				formation[b.getPlaceInFormation()] = true;

				if (b.getPlaceInFormation() <= 17)
				{
					inCombat = ++inCombat;
				}
			}
			else
			{
				b.setPlaceInFormation(NOT_IN_FORMATION);
				hasUnplaced = true;
			}
		}

		if (hasUnplaced)
		{
			foreach( b in roster )
			{
				if (b.getPlaceInFormation() != NOT_IN_FORMATION)
				{
					continue;
				}

				local i = 0;

				if (inCombat >= this.m.BrothersMaxInCombat)
				{
					i = 18;
				}

				while (i != formation.len())
				{
					if (formation[i] == false)
					{
						b.setPlaceInFormation(i);
						formation[i] = true;

						if (i <= 17)
						{
							inCombat = ++inCombat;
						}

						break;
					}

					i = ++i;
				}
			}
		}

		if (inCombat == 0)
		{
			foreach( b in roster )
			{
				b.setPlaceInFormation(3);
				break;
			}
		}
	}
})