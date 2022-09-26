#!/bin/sh

echo "Installing frontend dependencies"
cd "$PWD/frontend"
/usr/local/bin/npm install

echo "Installing backend dependencies"
cd "../backend"
/usr/local/bin/npm install