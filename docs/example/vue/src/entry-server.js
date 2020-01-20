import { createApp } from "./main";
import { createRenderer } from "vue-server-renderer";

const template = require("fs").readFileSync("./index.template.html", "utf-8");
const clientManifest = require("../dist/client/vue-ssr-client-manifest.json");

const render = (preloadedState, metas) => {
  const { app } = createApp();

  const context = {
    title: metas.title,
    state: preloadedState
  };
  const renderer = createRenderer({
    template,
    clientManifest
  });

  return renderer.renderToString(app, context, (err, html) => {
    return html;
  });
};

global.render = render;
