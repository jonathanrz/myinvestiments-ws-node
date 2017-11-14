run:
	yarn start

run-db:
	docker run -p27017:27017 --name myinvestments-db -d mongo

deploy:
	git push heroku master
