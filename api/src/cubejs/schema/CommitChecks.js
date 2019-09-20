cube(`CommitChecks`, {
  sql: `SELECT * FROM \`anker-dev\`.commit_checks`,
  
  joins: {
    
  },
  
  measures: {
    count: {
      type: `count`,
      drillMembers: [Id, checksId]
    }
  },
  
  dimensions: {
    Id: {
      sql: `_id`,
      type: `string`,
      title: ` Id`,
      primaryKey: true
    },
    
    checksId: {
      sql: `${CUBE}.\`checks._id\``,
      type: `string`,
      title: `Checks. Id`
    },
    
    checksContext: {
      sql: `${CUBE}.\`checks.context\``,
      type: `string`,
      title: `Checks.context`
    },
    
    checksDescription: {
      sql: `${CUBE}.\`checks.description\``,
      type: `string`,
      title: `Checks.description`
    },
    
    checksState: {
      sql: `${CUBE}.\`checks.state\``,
      type: `string`,
      title: `Checks.state`
    }
  }
});
