const CubejsServerCore = require('@cubejs-backend/server-core');
const MongoBiDriver = require('@cubejs-backend/mongobi-driver');
const path = require('path');

module.exports = async function(app) {
  try {
    const { apiSecret } = app.get('cubejs');
    const options = {
      dbType: 'mongobi',
      apiSecret,
      driverFactory: () => new MongoBiDriver({
        host: 'mongo-bi-connector',
        database: 'anker-dev',
        user: '',
        password: '',
        port: 3307
      }),
      devServer: false,
      logger: (msg, params) => {
        console.log(`${msg}: ${JSON.stringify(params)}`);
      },
      schemaPath: path.join('src', 'cubejs', 'schema')
    };
    const core = CubejsServerCore.create(options);
    
    await core.initApp(app);


  } catch(error) {
    console.error(error);
  }
};

