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
config.font_size = 11
config.font = wezterm.font(".", { weight = "Bold" })
config.line_height = 1.3
config.enable_tab_bar = false
config.window_padding = {
	left = 3,
	right = 3,
	top = 0,
	bottom = 0,
}
config.max_fps = 120
config.warn_about_missing_glyphs = false
config.colors = {
	foreground = "#CDD6F4", -- Text color
	background = "#1E1E2E", -- Background color
	cursor_bg = "#A6E3A1", -- Cursor background
	cursor_border = "#A6E3A1", -- Cursor border
	cursor_fg = "#1E1E2E", -- Cursor foreground (matches background)
	selection_bg = "#45475A", -- Background of selected text
	selection_fg = "#F5E0DC", -- Foreground of selected text
	ansi = {
		"#45475A", -- Black (ansi 0)
		"#F38BA8", -- Red (ansi 1)
		"#A6E3A1", -- Green (ansi 2)
		"#F9E2AF", -- Yellow (ansi 3)
		"#89B4FA", -- Blue (ansi 4)
		"#CBA6F7", -- Magenta (ansi 5)
		"#94E2D5", -- Cyan (ansi 6)
		"#BAC2DE", -- White (ansi 7)
	},
	brights = {
		"#585B70", -- Bright Black (bright 0)
		"#F38BA8", -- Bright Red (bright 1)
		"#A6E3A1", -- Bright Green (bright 2)
		"#F9E2AF", -- Bright Yellow (bright 3)
		"#89B4FA", -- Bright Blue (bright 4)
		"#CBA6F7", -- Bright Magenta (bright 5)
		"#94E2D5", -- Bright Cyan (bright 6)
		"#A6ADC8", -- Bright White (bright 7)
	},
}
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
