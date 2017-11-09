const express = require('express');
const app = express();

const { RGAPI_KEY, CGGAPI_KEY } = process.env;
const TeemoJS = require('teemojs');
const rgapi = new TeemoJS(RGAPI_KEY);

const cGG = require("cgg").cGG;
const cggapi = new cGG(CGGAPI_KEY);

console.log("RGAPI_KEY: " + (RGAPI_KEY && RGAPI_KEY.replace(/[a-f0-9]/g, '*')));
console.log("CGGAPI_KEY: " + (CGGAPI_KEY && CGGAPI_KEY.replace(/[a-f0-9]/g, '*')));

Object.entries(rgapi.config.endpoints).forEach(kv => {
  const [ endpointName, methods ] = kv;
  Object.entries(methods).forEach(kv => {
    const [ methodName, url ] = kv;
    let route = '/rgapi/:platform/' + endpointName + '/' + methodName + '/';
    if (url.includes('%s'))
      route += ':id';
    console.log('Adding route: "' + route + '".')
    app.get(route, (req, res) => {
      let { platform, id } = req.params;
      rgapi.get(platform, endpointName + '.' + methodName, id)
        .then(data => {
          if (!data)
            res.status(404).end();
          else
            res.json(data).end();
        })
        .catch(error => res.status(500).json({ error }).end());
    });
  });
});

const config = require('../config.json')
const port = config.apiproxy.port;
const mask = '0.0.0.0';
app.listen(port, mask, () => console.log('Listening on ' + mask + ':' + port + '.'));
