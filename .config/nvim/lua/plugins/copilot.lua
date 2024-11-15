return {
  "zbirenbaum/copilot.lua",
  lazy = false,
  cmd = "Copilot",
  event = "InsertEnter",
  config  = function ()
    require("copilot").setup({
      suggestion = {
        enabled = true,
        auto_trigger = true,
        keymap = {
          accept = "<Tab>",
        }
      }
    })
  end
}
