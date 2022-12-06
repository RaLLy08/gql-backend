# Graphql backend 

## Requirements:
	Redis
	Postgresql
	SMTP credentials

## Run

### Setup dev environment
```shell
npx prisma migrate dev --name migration-name
npx prisma generate
```


### Start 

1) Run docker container with env file by the command
docker-compose --env-file .env up 

2) Run server on local
```shell
pnpm dev
```
