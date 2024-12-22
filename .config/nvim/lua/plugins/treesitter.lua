---@type LazySpec
return {
  "nvim-treesitter/nvim-treesitter",
  opts = {
    ensure_installed = {
      "lua", -- Lua parser
      "javascript", -- JavaScript
      "typescript", -- TypeScript
      "html", -- HTML
      "css", -- CSS
      "python", -- Python
      "json", -- JSON
      "bash", -- Bash
    },
    auto_install = true, -- Automatically install missing parsers
  },
}
