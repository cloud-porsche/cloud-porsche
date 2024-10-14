# Cloud Porsche Managment Solution

This is the combined monorepo of all the services that are part of the Cloud Porsche Management Solution for
`Cloud Application Development @ HTWG`.

## Docker Compose

To run the entire solution locally, you can use the provided `docker-compose.yml` file. This file contains all the
services that are part of the Cloud Porsche Management Solution.

### Prerequisites

- All services that need the `@cloud-porsche/types` package have to be linked to it. To do this, run
  `npm run link-types` in the service that needs the package.
- The `@cloud-porsche/types` package has to be built before running the services. To do this, run `pnpm run build` in
  the
  `cloud-dev-types` directory.
- The context of the Dockerfiles (for each directory) needs to be set to the root  
  (e.g. `.` instead of `./cloud-dev-ui`). Check the provided IntelliJ run configurations for an example.
