-- This file needs to have same structure as nvconfig.lua 
-- https://github.com/NvChad/ui/blob/v3.0/lua/nvconfig.lua
-- Please read that file to know all available options :( 

---@type ChadrcConfig
local M = {}

M.base46 = {
<<<<<<< HEAD
	theme = "ayu_light",
=======
	theme = "ayu_dark",
>>>>>>> fe35df1d5978ec258f9c5b475936c74aeba54db6

	-- hl_override = {
	-- 	Comment = { italic = true },
	-- 	["@comment"] = { italic = true },
	-- },
}

M.ui = {
  tabufline = {
    enabled = false
  },
}

return M
