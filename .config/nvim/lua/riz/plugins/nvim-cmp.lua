return {
	{
		"hrsh7th/nvim-cmp",
		version = false,
		event = "InsertEnter",
		dependencies = {
			"hrsh7th/cmp-nvim-lsp",
			"hrsh7th/cmp-buffer",
			"hrsh7th/cmp-path",
			"saadparwaiz1/cmp_luasnip",
			"hrsh7th/cmp-cmdline",
		},
		opts = function()
			local cmp = require("cmp")
			local luasnip = require("luasnip")
			-- VSCode-like icons
			local icons = {
				Field = "󰆧",
				Property = "󰜢",
				Method = "󰆧",
				Function = "󰊕",
				Constructor = "󰆧",
				Variable = "󰀫",
				Class = "󰠱",
				Interface = "󰜰",
				Module = "󰏗",
				Unit = "󰑭",
				Value = "󰎠",
				Enum = "󰕘",
				Keyword = "󰌋",
				Snippet = "󰩫",
				Text = "󰉿",
				Package = "󰏗",
				Event = "",
				Operator = "󰆕",
				Reference = "󰈇",
				TypeParameter = "󰊄",
			}

			return {
				enabled = function()
					local buftype = vim.api.nvim_get_option_value("buftype", { buf = 0 })
					if buftype == "prompt" then
						return false
					end
					return true
				end,
				preselect = cmp.PreselectMode.Item,
				completion = {
					completeopt = "menu,menuone,noinsert",
				},
				formatting = {
					fields = { "kind", "abbr", "menu" },
					format = function(entry, vim_item)
						-- Get the kind icon
						local kind_icon = icons[vim_item.kind] or "󰆧" -- Default to method/field icon

						-- Show LSP source info like VSCode
						vim_item.kind = string.format("%s %s", kind_icon, "")

						-- Remove the extra type info to match VSCode style
						vim_item.menu = nil

						-- Show the full property/type info in the details
						if entry.completion_item.detail then
							vim_item.menu = entry.completion_item.detail
						end

						return vim_item
					end,
				},
				snippet = {
					expand = function(args)
						luasnip.lsp_expand(args.body)
					end,
				},
				window = {
					completion = {
						border = "none",
						winhighlight = "Normal:Pmenu,CursorLine:PmenuSel,Search:None",
						scrollbar = false,
						col_offset = 0,
						side_padding = 1,
					},
					documentation = {
						border = "single",
						winhighlight = "Normal:Pmenu,FloatBorder:Pmenu,Search:None",
					},
				},
				mapping = cmp.mapping.preset.insert({
					["<C-n>"] = cmp.mapping.select_next_item(),
					["<C-p>"] = cmp.mapping.select_prev_item(),
					["<C-b>"] = cmp.mapping(cmp.mapping.scroll_docs(-4), { "i", "c" }),
					["<C-f>"] = cmp.mapping(cmp.mapping.scroll_docs(4), { "i", "c" }),
					["<C-Space>"] = cmp.mapping(cmp.mapping.complete(), { "i", "c" }),
					["<C-e>"] = cmp.mapping({
						i = cmp.mapping.abort(),
						c = cmp.mapping.close(),
					}),
					["<CR>"] = cmp.mapping.confirm({ select = true }),
				}),
				sources = cmp.config.sources({
					{
						name = "nvim_lsp",
						entry_filter = function(entry)
							local item = entry:get_completion_item()
							return not (item.label and item.label:match("^Snippet"))
						end,
					},
					{ name = "luasnip" },
					{ name = "buffer" },
					{ name = "path" },
				}),
			}
		end,
	},
}
