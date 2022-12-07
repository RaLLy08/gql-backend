# Graphql backend 

## used technologies
    graphql
    graphql-express
    type-graphql
    prisma

## realised: 
    Gql schemas validation 
    Error handling
    Authorisation, sessions, thirdparty(facebook)
    Gql schemas permissions(all fields)
    Basic crud

    
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

## project structure
    -src
	- api
        -studio
            -input-schema
                create/read... 
            studio.schema(object.type)
            studio.resolver(api entry)
        -series
            -input-schema
                create/read...
            series.schema(object.type)
            series.resolver(api entry)
        -auth 
            -input-schema
                create/read...
            auth.schema(object.type)
            auth.resolver(api entry)

    -studio
        studio.service
        ...
    -auth
        -strategy
        -permission
        -definitions
        -middleware
    -paginator
        -strategy
        -permission
        -definitions
