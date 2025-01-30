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
    try {
      // Randomly select a replica pool for load balancing
      const replicaPool =
        this.replicaPools[Math.floor(Math.random() * this.replicaPools.length)];
      const result = await replicaPool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Replica read query failed:', error);
      throw error;
    }
  }

  // Execute a write query using the primary database
  async writeQuery(query: string, params: any[] = []): Promise<any> {
    try {
      const result = await this.primaryPool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Primary write query failed:', error);
      throw error;
    }
  }
}
