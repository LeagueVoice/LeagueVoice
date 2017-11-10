const req = require('request-promise-native');
// https://github.com/request/request

const URL = 'https://api.dialogflow.com/v1/';
const { DIALOGFLOW_KEY } = process.env;
const Authorization = 'Bearer ' + DIALOGFLOW_KEY;


function getIntents() {
  return req({
    url: URL + 'intents',
    headers: {
      Authorization
    }
  }).then(JSON.parse);
}

function addIntent(intent) {
  return req({
    url: URL + 'intents',
    method: 'POST',
    headers: {
      Authorization
    },
    json: intent
  });
}

function updateIntent(intent) {
  return req({
    url: URL + 'intents/' + intent.id,
    method: 'PUT',
    headers: {
      Authorization
    },
    json: intent
  });
}


function getEntities() {
  return req({
    url: URL + 'entities',
    headers: {
      Authorization
    }
  });
}
function getEntity(id) {
  return req({
    url: URL + 'entities/' + id,
    headers: {
      Authorization
    }
  });
}

getEntities().then(console.log);

//getIntents().then(console.log);

let intent = {
  "id": "9e9214b9-66c6-4e72-b4bf-d79107a0d634",
  "name": "Static.ChampionAbilityDamage",
  "auto": true,
  "contexts": [],
  "responses": [
    {
      "resetContexts": false,
      "action": "Static.ChampionAbilityDamage",
      "affectedContexts": [],
      "parameters": [
        {
          "id": "a8f786e3-38d5-4149-96d1-ad7ce536dcb3",
          "dataType": "@Champion",
          "name": "champion",
          "value": "$champion",
          "isList": false
        },
        {
          "id": "7dc76d24-3a78-4168-ae14-f04261daa796",
          "dataType": "@Ability",
          "name": "ability",
          "value": "$ability",
          "isList": false
        }
      ],
      "messages": [
        {
          "type": 0,
          "lang": "en",
          "speech": []
        }
      ],
      "defaultResponsePlatforms": {},
      "speech": []
    }
  ],
  "userSays": [
    {
      "id": "18670537-965e-4634-8cf9-c70e26ed6c41",
      "data": [
        {
          "text": "whats the ",
          "userDefined": false
        },
        {
          "text": "damage",
          "meta": "@sys.ignore",
          "userDefined": false
        },
        {
          "text": " for ",
          "userDefined": false
        },
        {
          "text": "zyras",
          "alias": "champion",
          "meta": "@Champion",
          "userDefined": false
        },
        {
          "text": " ",
          "userDefined": false
        },
        {
          "text": "q",
          "alias": "ability",
          "meta": "@Ability",
          "userDefined": false
        },
        {
          "text": "?",
          "userDefined": false
        }
      ],
      "isTemplate": false,
      "count": 1
    },
    {
      "id": "cff85310-7d13-4253-955b-686d5a223364",
      "data": [
        {
          "text": "whats the ",
          "userDefined": false
        },
        {
          "text": "damage",
          "meta": "@sys.ignore",
          "userDefined": false
        },
        {
          "text": " on ",
          "userDefined": false
        },
        {
          "text": "zyras",
          "alias": "champion",
          "meta": "@Champion",
          "userDefined": false
        },
        {
          "text": " ",
          "userDefined": false
        },
        {
          "text": "q",
          "alias": "ability",
          "meta": "@Ability",
          "userDefined": false
        },
        {
          "text": "?",
          "userDefined": false
        }
      ],
      "isTemplate": false,
      "count": 0
    },
    {
      "id": "0da6eb78-e885-485c-b965-99d553220c98",
      "data": [
        {
          "text": "how much ",
          "userDefined": false
        },
        {
          "text": "damage",
          "meta": "@sys.ignore",
          "userDefined": false
        },
        {
          "text": " does ",
          "userDefined": false
        },
        {
          "text": "zyras",
          "alias": "champion",
          "meta": "@Champion",
          "userDefined": false
        },
        {
          "text": " ",
          "userDefined": false
        },
        {
          "text": "q",
          "alias": "ability",
          "meta": "@Ability",
          "userDefined": false
        },
        {
          "text": " deal?",
          "userDefined": false
        }
      ],
      "isTemplate": false,
      "count": 0
    },
    {
      "id": "3d7af293-7ce8-4d19-bed0-0b28a571cde6",
      "data": [
        {
          "text": "how much ",
          "userDefined": false
        },
        {
          "text": "damage",
          "meta": "@sys.ignore",
          "userDefined": false
        },
        {
          "text": " does ",
          "userDefined": false
        },
        {
          "text": "zyras",
          "alias": "champion",
          "meta": "@Champion",
          "userDefined": false
        },
        {
          "text": " ",
          "userDefined": false
        },
        {
          "text": "q",
          "alias": "ability",
          "meta": "@Ability",
          "userDefined": false
        },
        {
          "text": " do?",
          "userDefined": false
        }
      ],
      "isTemplate": false,
      "count": 0
    },
    {
      "id": "44a5bda1-8124-46ad-a5a8-58ff58caef5b",
      "data": [
        {
          "text": "zyra",
          "alias": "champion",
          "meta": "@Champion",
          "userDefined": false
        },
        {
          "text": " ",
          "userDefined": false
        },
        {
          "text": "q",
          "alias": "ability",
          "meta": "@Ability",
          "userDefined": false
        },
        {
          "text": " ",
          "userDefined": false
        },
        {
          "text": "damage",
          "meta": "@sys.ignore",
          "userDefined": false
        }
      ],
      "isTemplate": false,
      "count": 0,
      "updated": 1510301282
    }
  ],
  "priority": 500000,
  "webhookUsed": true,
  "webhookForSlotFilling": false,
  "lastUpdate": 1510301282412,
  "fallbackIntent": false,
  "events": []
};

//updateIntent(intent).then(console.log).catch(console.error);
