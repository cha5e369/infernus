# @infernus/fs

[![npm](https://img.shields.io/npm/v/@infernus/fs)](https://www.npmjs.com/package/@infernus/fs) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/fs)

A collection of all built-in filterscripts, implemented with [@infernus/core](https://github.com/dockfries/omp-node).

## Getting started

```sh
pnpm add @infernus/core @infernus/fs
```

## Example

```ts
import { GameMode } from "@infernus/core";
import { useA51BaseFS } from "@infernus/fs";

GameMode.use(useA51BaseFS({ debug: true }));
```