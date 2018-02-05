#!/bin/bash 
if [[ -z "$TMUX" ]] ;then
	tmux new-session -s "fish" -d -c "~/dev/fish/"
fi
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo $DIR
tmux set pane-border-status top
tmux rename-window "fish-dev"
# tmux setw remain-on-exit on
tmux split-window -h -c ${DIR}/../server
tmux split-window -v -c ${DIR}/../server 'printf "\033]2;%s\033\\" "client compilation";npm run watch'
tmux respawn-pane -k -t .bottom-left -c ${DIR}/..  'printf "\033]2;%s\033\\" "listener";sudo /home/pi/dev/fish/scripts/service_listen.sh'
if [[ -z "$TMUX" ]] ;then
	tmux -2 attach-session -d 
fi
