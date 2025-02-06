import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import {
  PG_CONNECTION,
  PG_READ_REPLICA_CONNECTION,
} from './database.providers';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject(PG_CONNECTION) private readonly primaryPool: Pool, // Primary DB
    @Inject(PG_READ_REPLICA_CONNECTION) private readonly replicaPools: Pool[], // Replica DBs
  ) {}

  // Execute a read query using replicas
  async readQuery(query: string, params: any[] = []): Promise<any> {
    const replicaPools = [...this.replicaPools]; // Clone the replica pools array to avoid modifying the original
    let lastError: Error | null = null;

    while (replicaPools.length > 0) {
      try {
        // Randomly select a replica pool for load balancing
        const randomIndex = Math.floor(Math.random() * replicaPools.length);
        const replicaPool = replicaPools.splice(randomIndex, 1)[0]; // Remove the selected replica from the list

        // Attempt to execute the query on the selected replica
        const result = await replicaPool.query(query, params);
        return result.rows; // Return result if successful
      } catch (error) {
        // Log the error for the failed replica and continue with the next
        console.error(
          'Replica read query failed on one replica. Retrying with another...',
          error,
        );
        lastError = error;
      }
    }

    // If all replicas fail, throw the last captured error
    console.error('All replicas failed to process the query.');
    throw lastError;
  }

  // Execute a write query using the primary database
  async writeQuery(query: string, params: any[] = []): Promise<any> {
    const client = await this.primaryPool.connect();

    try {
      const result = await client.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Primary write query failed:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}
