start: 
	docker compose up -d

startall: 
	docker compose up --build -d

down:
	docker stop gold_back

reset: down
	docker rm gold_back

tar: 
	docker build -t gold_back -f Dockerfile .
	docker save gold_back -o gold_back.tar

install:
	docker stop gold_back
	docker rm gold_back
	docker image rm gold_back
	docker load -i gold_back.tar
	docker compose -f docker-compose.prod.yml up -d

help:
	@echo ""
	@echo "~~ Gold Apis Makefile ~~"
	@echo ""
	@echo "\033[33m make start\033[39m    : Démarre le projet"
	@echo "\033[33m make startall\033[39m : Build et démarre le projet"
	@echo "\033[33m make down\033[39m     : Stop le projet"
	@echo "\033[33m make reset\033[39m    : Reset les containers, les volumes, les networks et les données local"
	@echo ""