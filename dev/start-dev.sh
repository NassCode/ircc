#!/usr/bin/env bash

cd /home/nas/Desktop/dev/ircc/ircc || exit 1

# Desktop launchers do not load the interactive shell's Node configuration.
export PATH="/home/nas/.nvm/versions/node/v24.16.0/bin:$PATH"

if ! command -v npm >/dev/null 2>&1; then
    printf 'Node/npm was not found. Check the Node path in dev/start-dev.sh.\n'
    read -r -p 'Press Enter to close…'
    exit 1
fi

printf 'Starting the local IRCC development server.\nOpen https://canada.ca in your browser.\nKeep this terminal open; press Ctrl+C to stop.\n\n'
npm run dev
result=$?

if [ "$result" -ne 0 ] && [ "$result" -ne 130 ]; then
    printf '\nThe dev server exited with code %s. See the message above.\n' "$result"
    read -r -p 'Press Enter to close…'
fi
exit "$result"
