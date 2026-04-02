::ER <- {
	ID = "mod_ER_Legends",
	Name = "Expanded Roster Legends",
	Version = "1.0.0",
	FavoriteIDs = {},
	ForSaleIDs = {}
};

::ER.HookMod <- ::Hooks.register(::ER.ID, ::ER.Version, ::ER.Name);
::ER.HookMod.require("mod_msu > 1.2.0", "mod_legends >= 19.3.0");
::ER.HookMod.conflictWith("mod_smartLoot");

::ER.HookMod.queue(">mod_msu", ">mod_legends", ">mod_ROTUC", function() {
	::ER.Mod <- ::MSU.Class.Mod(::ER.ID, ::ER.Version, ::ER.Name)
	::include("mod_er/load.nut");
	::Const.Roster.Size[10] = 36;
	::Const.Roster.InCombatSize = ::Const.Roster.Size;
	::ER.HookMod.hookTree("scripts/scenarios/world/starting_scenario", function(q) {
		q.onSpawnAssets = @(__original) function() {
			__original();
			//this.m.StartingRosterTier = this.Const.Roster.getTierForSize(36);
			this.m.RosterTierMaxCombat = this.Const.Roster.getTierForSize(36);
			this.m.RosterTierMax = this.Const.Roster.getTierForSize(36);
		}
	})
})

/*::ER.HookMod.queue(">mod_msu", function(){
	::ER.JSConnection <- ::new("scripts/ui/mods/eimo_js_connection");
	::MSU.UI.registerConnection(::ER.JSConnection);
}, ::Hooks.QueueBucket.AfterHooks);*/
