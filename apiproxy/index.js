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
    app.get(route, (req, res) => {
      let { platform, id } = req.params;
      rgapi.get(platform, endpointName + '.' + methodName, id, req.query)
        .then(data => {
          if (!data)
            res.status(204).end();
          else
            res.json(data).end();
        })
        .catch(error => res.status(500).json({ error }).end());
    });
  });
});

app.get('/cggapi/champions', (req, res) => {
  cggapi.champions(req.query)
    .then(data => {
      if (!data)
        res.status(204).end();
      else
        res.json(JSON.parse(data)).end();
    })
    .catch(error => res.status(500).json({ error }).end());
});

app.get('/cggapi/matchupsByRole/:id/:role', (req, res) => {
  let { id, role } = req.params;
  cggapi.matchupsByRole(id, role, req.query)
    .then(data => {
      if (!data)
        res.status(204).end();
      else
        res.json(JSON.parse(data)).end();
    })
    .catch(error => res.status(500).json({ error }).end());
});

app.get('/cggapi/matchupsByChamp/:id', (req, res) => {
  let { id } = req.params;
  cggapi.matchupsByChamp(id, req.query)
    .then(data => {
      if (!data)
        res.status(204).end();
      else
        res.json(JSON.parse(data)).end();
    })
    .catch(error => res.status(500).json({ error }).end());
});

app.get('/cggapi/averagesByChamp/:id/', (req, res) => {
  let { id } = req.params;
  cggapi.averagesByChampion(id, req.query)
    .then(data => {
      if (!data)
        res.status(204).end();
      else
        res.json(JSON.parse(data)).end();
    })
    .catch(error => res.status(500).json({ error }).end());
});

app.get('/cggapi/generalSiteInformation', (req, res) => {
  cggapi.generalSiteInformation(req.query)
    .then(data => {
      if (!data)
        res.status(204).end();
      else
        res.json(JSON.parse(data)).end();
    })
    .catch(error => res.status(500).json({ error }).end());
});

app.get('/cggapi/overall', (req, res) => {
  cggapi.overall(req.query)
    .then(data => {
      if (!data)
        res.status(204).end();
      else
        res.json(JSON.parse(data)).end();
    })
    .catch(error => res.status(500).json({ error }).end());
});


console.log('Available routes:')
app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log('  - "' + r.route.path + '"');
  }
})

const config = require('../config.json')
const port = config.apiproxy.port;
const mask = '0.0.0.0';
app.listen(port, mask, () => console.log('Listening on ' + mask + ':' + port + '.'));
