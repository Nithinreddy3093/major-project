import { desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";
import { predictionsTable } from "./schema";
import type { InsertPrediction, Prediction } from "./schema";

const { Pool } = pg;

export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);
export const storageMode = isDatabaseConfigured ? "postgres" : "memory";

export const pool = isDatabaseConfigured
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

export const db = pool ? drizzle(pool, { schema }) : null;

const memoryPredictions: Prediction[] = [];
let nextMemoryId = 1;

function clonePrediction(row: Prediction): Prediction {
  return {
    ...row,
    created_at: new Date(row.created_at),
  };
}

export async function savePrediction(input: InsertPrediction): Promise<void> {
  if (db) {
    await db.insert(predictionsTable).values(input);
    return;
  }

  memoryPredictions.unshift({
    id: nextMemoryId++,
    created_at: new Date(),
    ...input,
    threat_level: input.threat_level ?? "None",
    ai_score: input.ai_score ?? 0,
    urls: input.urls ?? "[]",
    tone: input.tone ?? "Neutral",
    explanation: input.explanation ?? "",
  });
}

export async function getPredictionHistory(limit: number): Promise<Prediction[]> {
  if (db) {
    return db
      .select()
      .from(predictionsTable)
      .orderBy(desc(predictionsTable.created_at))
      .limit(limit);
  }

  return memoryPredictions.slice(0, limit).map(clonePrediction);
}

export async function getAllPredictions(): Promise<Prediction[]> {
  if (db) {
    return db
      .select()
      .from(predictionsTable)
      .orderBy(desc(predictionsTable.created_at));
  }

  return memoryPredictions.map(clonePrediction);
}

export * from "./schema";
