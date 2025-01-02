## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Service Account Roles

`gcloud projects add-iam-policy-binding cloud-porsche --member="serviceAccount:firebase-adminsdk-di96c@cloud-porsche.iam.gserviceaccount.com" --role="roles/pubsub.subscriber"`

`gcloud projects add-iam-policy-binding cloud-porsche --member="serviceAccount:firebase-adminsdk-di96c@cloud-porsche.iam.gserviceaccount.com" --role="roles/pubsub.viewer"`
