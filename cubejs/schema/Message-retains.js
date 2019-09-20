cube(`messageRetains`, {
  sql: `SELECT * FROM \`mqtt-broker\`.\`message-retains\``,
  
  joins: {
    
  },
  
  measures: {
    count: {
      type: `count`,
      drillMembers: [messageid, createdat, updatedat]
    }
  },
  
  dimensions: {
    Id: {
      sql: `_id`,
      type: `string`,
      title: ` Id`,
      primaryKey: true
    },

    messageid: {
      sql: `${CUBE}.\`messageId\``,
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
