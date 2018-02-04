#!/bin/sh 
if [[ -z "$TMUX" ]] ;then
	tmux new-session -s "fish" -d -c "~/dev/fish/"
fi
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo $DIR
tmux set pane-border-status top
tmux rename-window "fish-dev"
# tmux setw remain-on-exit on
tmux split-window -h -c ${DIR}/../ptt/ts
tmux split-window -v -c ${DIR}/../ptt/ts 'printf "\033]2;%s\033\\" "client compilation";npm run watch'
tmux respawn-pane -k -t .bottom-left -c ${DIR}/../ptt/ts  'printf "\033]2;%s\033\\" "listener";nodemon dist/app.js listen'
if [[ -z "$TMUX" ]] ;then
	tmux -2 attach-session -d 
fi