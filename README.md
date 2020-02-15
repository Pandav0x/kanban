# Kanban

A custom kanban system with a symfony backend

## Installation

* `git clone https://github.com/Pandav0x/kanban.git`
* `cd kanban/backend`
* `composer install`
* `cp .env .env.local`
* Change the `.env.local` content to make it fit your config
* `cd ../frontend`
* Change the `let apiUrl = 'http://127.0.0.1:8000';` to the correct url

There is two folders: `backend/` and `frontend/`. The backend must be inside a web server using php7.2 or above.

You can put the `frontend/` anywhere you want.
