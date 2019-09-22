cube(`Clients`, {
  sql: `SELECT * FROM \`mqtt-broker\`.clients`,
  
  joins: {
    
  },
  
  measures: {
    count: {
      type: `count`,
      drillMembers: [clientid, userid, createdat, updatedat]
    }
  },
  
  dimensions: {
    Id: {
      sql: `_id`,
      type: `string`,
      title: ` Id`,
      primaryKey: true
    },
    
    clientid: {
      sql: `${CUBE}.\`clientId\``,
      type: `string`
    },
    
    status: {
      sql: `status`,
      type: `string`
    },
    
    userid: {
      sql: `${CUBE}.\`userId\``,
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
