![Kanban](.readme/project_title.png)

# Kanban

A custom kanban system using a symfony backend and a Vanilla JS frontend.

## Getting Started

### Prerequisites

You will need a database. The project is already setup for a **mysql** database, but you can configure any DBMS in the limit of the ones handled by doctrine 2.

### Installing

* `git clone https://github.com/Pandav0x/kanban.git`
* `cd kanban`
* `composer install`
* `yarn install` or `npm install` or (any node package manager).
* `cp .env .env.local`
* Change the `.env.local` content to make it fit your config.
* `php bin/console application:install` to create the database.

 Then you will need to either start a web server using the symfony application (downloadable [here](https://symfony.com/download)) or to use a real server.
 
 ## Result
 
 ![Overview](.readme/overview.png | width=100)
 
 ## Built With
 
 * Symfony 5.0
 * Vanilla JS (witch is not a library)
