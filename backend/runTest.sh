#!/usr/bin/env bash

npm test

if [ $? -eq 0 ]; then
  echo "Tests passed"
  git pull origin main
else
  echo "Tests failed"
  echo "Not pulling latest code."
  exit 1
fi