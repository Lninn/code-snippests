FROM gitpod/workspace-full
                    
RUN sudo apt-get -q update && sudo apt-get -yq install mit-scheme rlwrap

ENV sicp="$rlwrap $mit-scheme"
