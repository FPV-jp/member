init:
	cat .env.example > .env
	composer install

run-app:
	composer serve

run-db:
	docker compose up -d --build

init-db:
	mariadb/doctrine orm:schema:update --dump-sql --force

down-db:
	docker compose down

destroy:
	docker system prune --all --force --volumes

git-clear:
	git branch | xargs git branch -D

restart: down-db run-db
