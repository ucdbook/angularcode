const path = require('path');
const ip = require('ip');
const Koa = require('koa');
const mount = require('koa-mount');
const serve = require('koa-static');
const logger = require('koa-logger');
const router = require('koa-router')();
const opn = require('open');
const liveload = require('./util/liveload');
const proxies = require('./util/proxy');

const devServer = new Koa();
const projectRoot = process.env.configJson.replace('abc.json', '');

module.exports = (options, projectConfig) => {
  const { port, open, reload } = options;
  const { workspace, proxy } = projectConfig;

  //devServer.use(logger());
  if (reload) {
    devServer.use(liveload(projectRoot));
  }

  // setup static files
  Object.keys(workspace).forEach(moduleName => {
    const c = workspace[moduleName];
    const relativePath = c.relativePath || '';
    if (c.active) {
      // active current project
      if (c.route) {
        devServer.use(mount(c.route, serve(path.join(projectRoot, moduleName, c.branch, relativePath))));
      } else {
        devServer.use(mount(`/${moduleName}`, serve(path.join(projectRoot, moduleName, c.branch, relativePath))));
      }
    }
  });


  devServer.use(async (ctx, next) => {
      console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
      await next();
  });
  router.get('/getCompileJson', async (ctx, next) => {
      ctx.response.body = process.env.compileJsonData;
  });
  devServer.use(router.routes());


  // setup proxy

  Object.keys(proxy).forEach(path => {
    devServer.use(proxies(path, {
      target: proxy[path],
      changeOrigin: true,
      logs: true,
    }));
  });




  // start server
  devServer.listen(port);
 
  

  //if (open) {
    //const host = ip.address();
    //opn(`http://${host}:${port}`);
  //}
};