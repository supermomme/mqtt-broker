const CubejsServerCore = require('cubejs-server-core');
const MongoBiDriver = require('@cubejs-backend/mongobi-driver');
const path = require('path');
const express = require('express')

module.exports = async function(app) {
  try {
    const { apiSecret } = app.get('cubejs');
    const options = {
      dbType: 'mongobi',
      apiSecret,
      driverFactory: () => new MongoBiDriver({
        host: 'mongo-bi-connector',
        database: 'mqtt-broker',
        user: '',
        password: '',
        port: 3307
      }),
      devServer: true,
      logger: (msg, params) => {
        console.log(`${msg}: ${JSON.stringify(params)}`);
      },
      schemaPath: path.join('src', 'cubejs', 'schema')
    };
    const test = express()
    const core = CubejsServerCore.create(options);
    test.get('/test', (req, res) => res.send('ok'))
    app.use('/cubejs', test)
    
    await core.initApp(test);
    


    // console.log(app._router.stack)

  } catch(error) {
    console.error(error);
  }
};

