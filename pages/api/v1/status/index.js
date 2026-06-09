import database from "infra/database.js";

async function getStatisticsPostgres() {
  const postgresVersionResult = await database.query("SHOW server_version;");
  const postgresVersion = postgresVersionResult.rows[0].server_version;

  const maxConnectionsResult = await database.query("SHOW max_connections;");
  const maxConnections = parseInt(maxConnectionsResult.rows[0].max_connections);

  const databaseName = process.env.POSTGRES_DB;
  const oppenedConnectionsResult = await database.query({
    text: "SELECT count(*) FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const oppenedConnections = parseInt(oppenedConnectionsResult.rows[0].count);

  return {
    postgresVersion: postgresVersion,
    maxConnections: maxConnections,
    oppenedConnections: oppenedConnections,
  };
}

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const pgStats = await getStatisticsPostgres();

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: pgStats.postgresVersion,
        max_connections: pgStats.maxConnections,
        oppened_connections: pgStats.oppenedConnections,
      },
    },
  });
}

export default status;
