cube(`Commit`, {
  sql: `SELECT * FROM \`anker-dev\`.commit`,
  
  joins: {
    Repository: {
      sql: `${CUBE}.\`repositoryId\` = ${Repository}._id`,
      relationship: `belongsTo`
    }
  },
  
  measures: {
    count: {
      type: `count`,
      drillMembers: [commitAuthorName, Id, commitCommitterName, repositoryid, createdat, updatedat, commitAuthorDate, commitCommitterDate]
    }
  },
  
  dimensions: {
    commitCommitterEmail: {
      sql: `${CUBE}.\`commit.committer.email\``,
      type: `string`,
      title: `Commit.committer.email`
    },
    
    commitAuthorEmail: {
      sql: `${CUBE}.\`commit.author.email\``,
      type: `string`,
      title: `Commit.author.email`
    },
    
    commitAuthorName: {
      sql: `${CUBE}.\`commit.author.name\``,
      type: `string`,
      title: `Commit.author.name`
    },
    
    Id: {
      sql: `_id`,
      type: `string`,
      title: ` Id`,
      primaryKey: true
    },
    
    commitCommitterName: {
      sql: `${CUBE}.\`commit.committer.name\``,
      type: `string`,
      title: `Commit.committer.name`
    },
    
    commitMessage: {
      sql: `${CUBE}.\`commit.message\``,
      type: `string`,
      title: `Commit.message`
    },
    
    repositoryid: {
      sql: `${CUBE}.\`repositoryId\``,
      type: `string`
    },
    
    sha: {
      sql: `sha`,
      type: `string`
    },
    
    createdat: {
      sql: `${CUBE}.\`createdAt\``,
      type: `time`
    },
    
    updatedat: {
      sql: `${CUBE}.\`updatedAt\``,
      type: `time`
    },
    
    commitAuthorDate: {
      sql: `${CUBE}.\`commit.author.date\``,
      type: `time`,
      title: `Commit.author.date`
    },
    
    commitCommitterDate: {
      sql: `${CUBE}.\`commit.committer.date\``,
      type: `time`,
      title: `Commit.committer.date`
    }
  }
});
