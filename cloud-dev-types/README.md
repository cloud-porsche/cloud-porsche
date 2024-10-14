# @cloud-porsche/types

This package contains the types used in the cloud-porsche project.

## Guide

Define types that are used in multiple services in this package.
To make them usable, export them in the `index.ts` file.

If you want to use the type via `typeorm`,
you have to define an interface that can be used to implement the `@Entity()`
decorator.

## Packaging

For now this package is used via `pnpm link` but eventually might be replaced with a published package.
