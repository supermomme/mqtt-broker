cube(`Deployment`, {
  sql: `SELECT * FROM \`anker-dev\`.deployment`,
  
  joins: {
    Repository: {
      sql: `${CUBE}.\`repositoryId\` = ${Repository}._id`,
      relationship: `belongsTo`
    }
  },
  
  measures: {
    count: {
      type: `count`,
      drillMembers: [Id, repositoryid]
    }
  },
  
  dimensions: {
    Id: {
      sql: `_id`,
      type: `string`,
      title: ` Id`,
      primaryKey: true
    },
    
    environment: {
      sql: `environment`,
      type: `string`
    },
    
    repositoryid: {
      sql: `${CUBE}.\`repositoryId\``,
      type: `string`
    },
    
    sha: {
      sql: `sha`,
      type: `string`
    },
    
    status: {
      sql: `status`,
      type: `string`
    },
    
    task: {
      sql: `task`,
      type: `string`
    }
  }
});
