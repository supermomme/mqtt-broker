cube(`Retains`, {
  sql: `SELECT * FROM \`mqtt-broker\`.retains`,
  
  joins: {
    
  },
  
  measures: {
    count: {
      type: `count`,
      drillMembers: [createdat, updatedat]
    }
  },
  
  dimensions: {
    payload: {
      sql: `payload`,
      type: `string`
    },
    
    topic: {
      sql: `topic`,
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
