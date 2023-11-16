## Feature

- Packaging application as Docker image based on [Nginx](https://hub.docker.com/_/nginx).
- Generate a [.dockerignore](https://docs.docker.com/engine/reference/builder/#dockerignore-file) file in the root directory.
- Support for [Browser Router](https://reactrouter.com/en/main/router-components/browser-router).
- Support for [gzip_static](https://nginx.org/en/docs/http/ngx_http_gzip_static_module.html).

## Prerequisite

- [Docker](https://www.docker.com/)

## Install

Install with npm:

```bash
npm i -D dockerize-nginx
```

## Get Started

Add following to `npm scripts`

```json
{
  "scripts": {
    "dockerize": "dockerize"
  }
}
```

It will copy the contents of the `dist/` directory to the `/usr/share/nginx/html` directory in the image.

## Configuration

These arguments are supported on the command line:

| argument          | alias | default                                      | description                                                               |
| ----------------- | ----- | -------------------------------------------- | ------------------------------------------------------------------------- |
| distDir           | o     | dist                                         | Output directory of SPA application                                       |
| imageName         | t     | \${npm_package_name}:\${npm_package_version} | Name and optionally a container tag (format: "name:tag")                  |
| writeDockerIgnore | w     | false                                        | Whether to generate a .dockerignore file in the root directory            |
| build             | b     | true                                         | Set to `false`, only files will be created without building a Docker image. |
