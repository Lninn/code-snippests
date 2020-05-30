# sudo bash setup.sh
echo "Hello, World";

apt-get -yq install rlwrap mit-scheme;

echo "alias sicp='rlwrap mit-scheme'" > ~/.bash_aliases && source ~/.bash_aliases;