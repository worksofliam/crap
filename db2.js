const {
  DBPool, Statement, NUMERIC, CHAR, IN
} = require('idb-pconnector');

module.exports = {
  connect: function() {
    this.pool = new DBPool({
      url: '*LOCAL'
    });
    this.connection = this.pool.attach();
  },

  executeStatement: async function(sqlStatement, bindParams) {
    const conn = this.pool.attach();

    var statement, bindings, results;
    
    statement = new Statement(conn.connection);
    statement.stmt.asNumber(true);

    if (bindParams === null) {
      results = await statement.exec(sqlStatement);
    } else {
      await statement.prepare(sqlStatement);

      bindings = [];

      for (var i in bindParams) {
        switch (typeof bindParams[i]) {
          case 'number':
            bindings.push([bindParams[i], IN, NUMERIC]);
            break;
          case 'string':
            bindings.push([bindParams[i], IN, CHAR]);
            break;
        }
      }

      await statement.bindParam(bindings);
      await statement.execute();
      results = await statement.fetchAll();
    }

    await statement.close();

    this.pool.detach(conn);
  
    return results;
  },

  pool: null,
  connection: null
}