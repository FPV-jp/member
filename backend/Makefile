init:
	cat .env.example > .env
	composer install

run:
	composer serve

db:
	docker compose up --build

dbd:
	docker compose up -d --build

down:
	docker compose down

destroy:
	docker system prune --all --force --volumes

restart-api: down up
