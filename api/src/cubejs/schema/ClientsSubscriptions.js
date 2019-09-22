cube(`ClientsSubscriptions`, {
  sql: `SELECT * FROM \`mqtt-broker\`.clients_subscriptions`,
  
  joins: {
    
  },
  
  measures: {
    count: {
      type: `count`,
      drillMembers: []
    }
  },
  
  dimensions: {
    Id: {
      sql: `_id`,
      type: `string`,
      title: ` Id`,
      primaryKey: true
    }
    
  }
});
