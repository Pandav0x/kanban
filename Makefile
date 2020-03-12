composer.lock: composer.json
	composer update

vendor: composer.lock
	composer install

yarn.lock: package.json
	yarn upgrade

node_modules: yarn.lock
	yarn install

db:
	php bin/console doctrine:database:drop --force
	php bin/console doctrine:database:create
	php bin/console doctrine:migration:migrate -q

fixture: db
	php bin/console doctrine:fixtures:load -q

ut:
	php bin/phpunit --testsuite unit

ft:
	php bin/phpunit --testsuite functional

test:
	php bin/phpunit

install: vendor node_modules db