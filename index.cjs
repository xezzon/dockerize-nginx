const fs = require('fs')
const { execSync } = require('child_process')
const { default: yargs } = require('yargs')
const { hideBin } = require('yargs/helpers')

const packageName = process.env.npm_package_name.replace('@', '')
const packageVersion = process.env.npm_package_version
const { distDir, imageName, writeDockerIgnore, build: building } = yargs(hideBin(process.argv))
  .option('distDir', {
    alias: 'o',
    type: 'string',
    default: 'dist',
    describe: 'Output directory of SPA application',
  })
  .option('imageName', {
    alias: 't',
    type:'string',
    default: `${packageName}:${packageVersion}`,
    describe: 'Name and optionally a container tag (format: "name:tag")'
  })
  .option('writeDockerIgnore', {
    alias: 'w',
    type: 'boolean',
    default: false,
    describe: 'Whether to generate a .dockerignore file in the root directory'
  })
  .option('build', {
    alias: 'b',
    type: 'boolean',
    default: true,
    describe: 'Set to false, only files will be created without building a Docker image.',
  })
  .parse()
console.debug(`dockerize-nginx argv: ${JSON.stringify({
  distDir, imageName, writeDockerIgnore,
})}\n`)  

const dockerPath = 'node_modules/.docker'
const dockerfilePath = `${dockerPath}/Dockerfile`
const nginxConfPath = `${dockerPath}/default.conf`
const dockerIgnorePath = '.dockerignore'

const dockerfile = `
FROM nginx:stable-alpine
COPY ${distDir} /usr/share/nginx/html
COPY ${nginxConfPath} /etc/nginx/conf.d
EXPOSE 80
`.trim()
const nginxConf = `
server {
  listen       80;
  listen  [::]:80;
  server_name  localhost;

  gzip_static on;

  location / {
      root   /usr/share/nginx/html;
      index  index.html index.htm;
      try_files $uri /index.html;
  }

  error_page   500 502 503 504  /50x.html;
  location = /50x.html {
      root   /usr/share/nginx/html;
  }
}
`.trim()
const dockerIgnore = `
*
!${distDir}
!${dockerPath}
`.trim()

if (!fs.existsSync(dockerPath)) {
  fs.mkdirSync(dockerPath)
}
fs.writeFileSync(dockerfilePath, dockerfile)
fs.writeFileSync(nginxConfPath, nginxConf)
if (writeDockerIgnore) {
  fs.writeFileSync(dockerIgnorePath, dockerIgnore)
}

if (building) {
  const dockerBuildCmd = `docker build -t ${imageName} -f ${dockerfilePath} .`
  console.log(dockerBuildCmd)
  execSync(dockerBuildCmd, { stdio: 'inherit' })
}
