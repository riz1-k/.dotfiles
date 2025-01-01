if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

alias nv="nvim"
alias gt="git"
alias cl="clear"
alias su="sudo"
alias e="exit"
alias tm="tmux"
# Function to simplify git add, commit, and push workflow
gg() {
    if [ -z "$1" ]; then
        echo "Error: Commit message is required"
        echo "Usage: gg \"commit message\" [branch]"
        return 1
    fi
    git add .
    git commit -m "$1"
    if [ -z "$2" ]; then
        branch=$(git rev-parse --abbrev-ref HEAD)
    else
        branch="$2"
    fi
    if ! git rev-parse --abbrev-ref @{u} >/dev/null 2>&1; then
        git push --set-upstream origin "$branch"
    else
        git push
    fi
}

# ---- Eza (better ls) -----
alias ls="eza --icons=auto"

# ---- Zoxide (better cd) ----
eval "$(zoxide init zsh)"
alias cd="z"


# Path to your Oh My Zsh installation.
export ZSH="$HOME/.oh-my-zsh"

ZSH_THEME="robbyrussell"

plugins=(git zsh-autosuggestions zsh-syntax-highlighting fast-syntax-highlighting )

source $ZSH/oh-my-zsh.sh

source ~/powerlevel10k/powerlevel10k.zsh-theme

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

# history setup
HISTFILE=$HOME/.zhistory
SAVEHIST=1000
HISTSIZE=999
setopt share_history
setopt hist_expire_dups_first
setopt hist_ignore_dups
setopt hist_verify

# completion using arrow keys (based on history)
bindkey '^[[A' history-search-backward
bindkey '^[[B' history-search-forward

# bun completions
[ -s "/home/riz1/.bun/_bun" ] && source "/home/riz1/.bun/_bun"

# bun
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

export PATH=$HOME/.local/bin:$PATH

# pnpm
export PNPM_HOME="/home/riz1/.local/share/pnpm"
case ":$PATH:" in
  *":$PNPM_HOME:"*) ;;
  *) export PATH="$PNPM_HOME:$PATH" ;;
esac
# pnpm end

#flutter
export PATH="$PATH:/usr/local/flutter/bin"

#java
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

export ANDROID_HOME=/home/riz1/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

# Turso
export PATH="$PATH:/home/riz1/.turso"
#zig
export PATH="/opt/zig:$PATH"
