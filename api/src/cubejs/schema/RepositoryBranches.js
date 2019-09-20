cube(`RepositoryBranches`, {
  sql: `SELECT * FROM \`anker-dev\`.repository_branches`,
  
  joins: {
    
  },
  
  measures: {
    count: {
      type: `count`,
      drillMembers: [Id, branchesId, branchesName]
    }
  },
  
  dimensions: {
    Id: {
      sql: `_id`,
      type: `string`,
      title: ` Id`,
      primaryKey: true
    },
    
    branchesId: {
      sql: `${CUBE}.\`branches._id\``,
      type: `string`,
      title: `Branches. Id`
    },
    
    branchesName: {
      sql: `${CUBE}.\`branches.name\``,
      type: `string`,
      title: `Branches.name`
    }
  }
});
