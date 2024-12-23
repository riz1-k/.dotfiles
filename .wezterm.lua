local wezterm = require("wezterm")
local config = wezterm.config_builder()

config.default_cursor_style = "SteadyBlock"
config.automatically_reload_config = true
config.window_close_confirmation = "NeverPrompt"
config.adjust_window_size_when_changing_font_size = false
config.window_decorations = "RESIZE"
config.check_for_updates = false
config.use_fancy_tab_bar = false
config.tab_bar_at_bottom = false
config.font_size = 13.5
config.font = wezterm.font(".", { weight = "Medium" })
config.line_height = 2.2
config.enable_tab_bar = false
config.use_resize_increments = true
config.window_padding = {
	left = 0,
	right = 0,
	top = 0,
	bottom = 0,
}
config.max_fps = 120
config.warn_about_missing_glyphs = false
config.colors = {
	foreground = "#ADB0BB",
	background = "#1A1D23",
	cursor_bg = "#ADB0BB",
	cursor_border = "#ADB0BB",
	cursor_fg = "#1A1D23",
	selection_bg = "#26343F",
	selection_fg = "#ADB0BB",
	split = "#50A4E9",
	compose_cursor = "#EB8332",
	scrollbar_thumb = "#696C76",

	ansi = { "#111317", "#FF838B", "#87C05F", "#DFAB25", "#5EB7FF", "#DD97F1", "#4AC2B8", "#9B9FA9" },
	brights = { "#34363A", "#FFA6AE", "#AAE382", "#FFCE48", "#81DAFF", "#FFBAFF", "#6DE5DB", "#D0D3DE" },

	tab_bar = {
		inactive_tab_edge = "#3A3E47",
		background = "#1A1D23",
		active_tab = {
			fg_color = "#ADB0BB",
			bg_color = "#50A4E9",
		},
		inactive_tab = {
			fg_color = "#494D56",
			bg_color = "#16181D",
		},
		inactive_tab_hover = {
			fg_color = "#50A4E9",
			bg_color = "#16181D",
		},
		new_tab_hover = {
			fg_color = "#50A4E9",
			bg_color = "#1A1D23",
		},
		new_tab = {
			fg_color = "#50A4E9",
			bg_color = "#1A1D23",
		},
	},
}
-- config.colors = {
-- 	foreground = "#CDD6F4",   -- Text color
-- 	background = "#1E1E2E",   -- Background color
-- 	cursor_bg = "#A6E3A1",    -- Cursor background
-- 	cursor_border = "#A6E3A1", -- Cursor border
-- 	cursor_fg = "#1E1E2E",    -- Cursor foreground (matches background)
-- 	selection_bg = "#45475A", -- Background of selected text
-- 	selection_fg = "#F5E0DC", -- Foreground of selected text
-- 	ansi = {
-- 		"#45475A",              -- Black (ansi 0)
-- 		"#F38BA8",              -- Red (ansi 1)
-- 		"#A6E3A1",              -- Green (ansi 2)
-- 		"#F9E2AF",              -- Yellow (ansi 3)
-- 		"#89B4FA",              -- Blue (ansi 4)
-- 		"#CBA6F7",              -- Magenta (ansi 5)
-- 		"#94E2D5",              -- Cyan (ansi 6)
-- 		"#BAC2DE",              -- White (ansi 7)
-- 	},
-- 	brights = {
-- 		"#585B70", -- Bright Black (bright 0)
-- 		"#F38BA8", -- Bright Red (bright 1)
-- 		"#A6E3A1", -- Bright Green (bright 2)
-- 		"#F9E2AF", -- Bright Yellow (bright 3)
-- 		"#89B4FA", -- Bright Blue (bright 4)
-- 		"#CBA6F7", -- Bright Magenta (bright 5)
-- 		"#94E2D5", -- Bright Cyan (bright 6)
-- 		"#A6ADC8", -- Bright White (bright 7)
-- 	},
-- }
config.window_background_opacity = 1

config.hyperlink_rules = {
	-- Matches: a URL in parens: (URL)
	{
		regex = "\\((\\w+://\\S+)\\)",
		format = "$1",
		highlight = 1,
	},
	-- Matches: a URL in brackets: [URL]
	{
		regex = "\\[(\\w+://\\S+)\\]",
		format = "$1",
		highlight = 1,
	},
	-- Matches: a URL in curly braces: {URL}
	{
		regex = "\\{(\\w+://\\S+)\\}",
		format = "$1",
		highlight = 1,
	},
	-- Matches: a URL in angle brackets: <URL>
	{
		regex = "<(\\w+://\\S+)>",
		format = "$1",
		highlight = 1,
	},
	-- Then handle URLs not wrapped in brackets
	{
		-- Before
		--regex = '\\b\\w+://\\S+[)/a-zA-Z0-9-]+',
		--format = '$0',
		-- After
		regex = "[^(]\\b(\\w+://\\S+[)/a-zA-Z0-9-]+)",
		format = "$1",
		highlight = 1,
	},
	-- implicit mailto link
	{
		regex = "\\b\\w+@[\\w-]+(\\.[\\w-]+)+\\b",
		format = "mailto:$0",
	},
}

return config
