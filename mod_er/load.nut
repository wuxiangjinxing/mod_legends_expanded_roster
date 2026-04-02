::include("mod_er/hooks/er_hooks.nut");

local function registerJS( _file )
{
	::Hooks.registerJS("ui/mods/er/" + _file);
}

local function registerCSS( _file )
{
	::Hooks.registerCSS("ui/mods/er/css/" + _file);
}

registerJS("character_screen_brothers_list_module.js");
registerCSS("character_screen.css");
registerCSS("character_screen_brothers_list_module.css");
registerCSS("character_screen_stats_module.css");
registerCSS("character_screen_skills_module.css");

