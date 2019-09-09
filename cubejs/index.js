const CubejsServer = require('@cubejs-backend/server');

const server = new CubejsServer({ devServer: true });

server.listen().then(({ port }) => {
  console.log(`🚀 Cube.js server is listening on ${port}`);
});