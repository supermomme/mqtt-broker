cube(`Repository`, {
  sql: `SELECT * FROM \`anker-dev\`.repository`,
  
  joins: {
    Project: {
      sql: `${CUBE}.\`projectId\` = ${Project}._id`,
      relationship: `belongsTo`
    }
  },
  
  measures: {
    count: {
      type: `count`,
      drillMembers: [Id, name, projectid, createdat, updatedat]
    }
  },
  
  dimensions: {
    homepage: {
      sql: `homepage`,
      type: `string`
    },
    
    description: {
      sql: `description`,
      type: `string`
    },
    
    Id: {
      sql: `_id`,
      type: `string`,
      title: ` Id`,
      primaryKey: true
    },
    
    language: {
      sql: `language`,
      type: `string`
    },
    
    name: {
      sql: `name`,
      type: `string`
    },
    
    projectid: {
      sql: `${CUBE}.\`projectId\``,
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
