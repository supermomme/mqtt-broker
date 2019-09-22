cube(`Messages`, {
  sql: `SELECT * FROM \`mqtt-broker\`.messages`,
  
  joins: {
    Clients: {
      sql: `${CUBE}.\`clientId\` = ${Clients}.\`clientId\``,
      relationship: `belongsTo`
    }
  },
  
  measures: {
    count: {
      type: `count`,
      drillMembers: [clientid, userid, createdat, updatedat]
    },
    dd: {
      type: `number`,
      sql: `CAST(${CUBE}.\`payload.val\` as decimal(10,5))`,
    }
  },


  dimensions: {
    Id: {
      sql: `_id`,
      type: `string`,
      title: ` Id`,
      primaryKey: true
    },

    payloadVal: {
      sql: `${CUBE}.\`payload.val\``,
      type: `number`,
      title: `Payload.val`
    },
    
    clientid: {
      sql: `${CUBE}.\`clientId\``,
      type: `string`
    },
    
    topic: {
      sql: `topic`,
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
