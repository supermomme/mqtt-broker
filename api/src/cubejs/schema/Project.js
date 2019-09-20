cube(`Project`, {
  sql: `SELECT * FROM \`anker-dev\`.project`,
  
  joins: {
    
  },
  
  measures: {
    count: {
      type: `count`,
      drillMembers: [Id, jiraid, name, createdat, updatedat]
    }
  },
  
  dimensions: {
    avatarurls48x48: {
      sql: `${CUBE}.\`avatarUrls.48x48\``,
      type: `string`,
      title: `Avatarurls.48x48`
    },
    
    avatarurls16x16: {
      sql: `${CUBE}.\`avatarUrls.16x16\``,
      type: `string`,
      title: `Avatarurls.16x16`
    },
    
    avatarurls24x24: {
      sql: `${CUBE}.\`avatarUrls.24x24\``,
      type: `string`,
      title: `Avatarurls.24x24`
    },
    
    avatarurls32x32: {
      sql: `${CUBE}.\`avatarUrls.32x32\``,
      type: `string`,
      title: `Avatarurls.32x32`
    },
    
    Id: {
      sql: `_id`,
      type: `string`,
      title: ` Id`,
      primaryKey: true
    },
    
    jiraid: {
      sql: `${CUBE}.\`jiraId\``,
      type: `string`
    },
    
    name: {
      sql: `name`,
      type: `string`
    },
    
    projecttypekey: {
      sql: `${CUBE}.\`projectTypeKey\``,
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
