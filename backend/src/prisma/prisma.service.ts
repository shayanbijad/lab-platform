import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly pool: Pool;
  private readonly connectionTarget: string;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not set for Prisma');
    }

    const url = new URL(databaseUrl);
    const connectionTarget = `${url.hostname}:${url.port || '5432'}${url.pathname}`;

    const pool = new Pool({
      connectionString: databaseUrl,
    });

    super({
      adapter: new PrismaPg(pool),
    });

    this.pool = pool;
    this.connectionTarget = connectionTarget;
  }

  async onModuleInit() {
    try {
      await this.$connect();
      await this.$queryRaw`SELECT 1`;
      console.log(`✅ Prisma connected to ${this.connectionTarget}`);
    } catch (error) {
      console.error(
        `❌ Prisma failed to connect to ${this.connectionTarget}. Check DATABASE_URL and make sure Postgres is running.`,
      );
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}
