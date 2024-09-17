#!/bin/bash

OPENAI_API_KEY = `cat ~/.config/openai.token`

curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
