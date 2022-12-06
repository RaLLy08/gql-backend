# Animakuro backend 

## Requirements:
1.	Redis
2.	Postgresql
3.	SMTP credentials

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

## Todos
- Add auth middleware
- Add express request to graphQL ctx
- Solve issue with nanoid
- Write error handler and custom errors


