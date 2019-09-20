cube(`Issue`, {
  sql: `SELECT * FROM \`anker-dev\`.issue`,
  
  joins: {
    Project: {
      sql: `${CUBE}.\`projectId\` = ${Project}._id`,
      relationship: `belongsTo`
    }
  },
  
  measures: {
    count: {
      type: `count`,
      drillMembers: [Id, jiraid, projectid, createdat, updatedat]
    }
  },
  
  dimensions: {
    Id: {
      sql: `_id`,
      type: `string`,
      title: ` Id`,
      primaryKey: true
    },
    
    description: {
      sql: `description`,
      type: `string`
    },
    
    jiraid: {
      sql: `${CUBE}.\`jiraId\``,
      type: `string`
    },
    
    projectid: {
      sql: `${CUBE}.\`projectId\``,
      type: `string`
    },
    
    summary: {
      sql: `summary`,
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
