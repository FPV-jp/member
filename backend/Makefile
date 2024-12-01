init:
	cat .env.example > .env
	composer install

run-app:
	composer serve

run-db:
	docker compose up -d --build

down-db:
	docker compose down

destroy:
	docker system prune --all --force --volumes

restart: down-db run-db
