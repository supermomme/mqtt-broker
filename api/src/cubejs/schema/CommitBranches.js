cube(`CommitBranches`, {
  sql: `SELECT * FROM \`anker-dev\`.commit_branches`,
  
  joins: {
    
  },
  
  measures: {
    count: {
      type: `count`,
      drillMembers: [Id]
    }
  },
  
  dimensions: {
    Id: {
      sql: `_id`,
      type: `string`,
      title: ` Id`,
      primaryKey: true
    },
    
    branches: {
      sql: `branches`,
      type: `string`
    }
  }
});
