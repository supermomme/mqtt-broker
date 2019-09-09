cube(`Users`, {
  sql: `SELECT * FROM \`mqtt-broker\`.users`,
  
  joins: {
    
  },
  
  measures: {
    count: {
      type: `count`,
      drillMembers: [firstname, lastname, username, createdat, updatedat]
    }
  },
  
  dimensions: {
    email: {
      sql: `email`,
      type: `string`
    },
    
    firstname: {
      sql: `firstname`,
      type: `string`
    },
    
    lastname: {
      sql: `lastname`,
      type: `string`
    },
    
    password: {
      sql: `password`,
      type: `string`
    },
    
    role: {
      sql: `role`,
      type: `string`
    },
    
    username: {
      sql: `username`,
      type: `string`
    },
    
    createdat: {
      sql: `${CUBE}.\`createdAt\``,
      type: `time`
    },
    
    updatedat: {
      sql: `${CUBE}.\`updatedAt\``,
      type: `time`
    }
  }
});
