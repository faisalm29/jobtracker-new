import { AppRouteHandler } from "../../lib/types";
import { StatsRoute } from "./stats.routes";
import { createDb } from "../../db";
import { getSession } from "../../lib/get-session";
import { applications, type ApplicationStatus } from "../../db/schema";
import { and, count, desc, eq, inArray, sql } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";

const ACTIVE_STATUSES = [
  "saved",
  "applied",
  "interviewing",
  "offered",
] as const;

const RESPONDED_STATUSES = [
  "interviewing",
  "offered",
  "accepted",
  "rejected",
] as const;

const STALE_THRESHOLD_DAYS = 7;

export const stats: AppRouteHandler<StatsRoute> = async (c) => {
  const db = createDb(c.env.DB);
  const user = getSession(c).user;

  const breakdownRows = await db
    .select({
      status: applications.status,
      count: count(),
    })
    .from(applications)
    .where(eq(applications.userId, user.id))
    .groupBy(applications.status);

  const responseRows = await db
    .select({
      status: applications.status,
      count: count(),
    })
    .from(applications)
    .where(
      and(
        eq(applications.userId, user.id),
        inArray(applications.status, ["applied", ...RESPONDED_STATUSES])
      )
    )
    .groupBy(applications.status);

  const recentApplications = await db
    .select({
      id: applications.id,
      companyName: applications.companyName,
      roleTitle: applications.roleTitle,
      status: applications.status,
      updatedAt: applications.updatedAt,
      createdAt: applications.createdAt,
    })
    .from(applications)
    .where(eq(applications.userId, user.id))
    .orderBy(
      desc(sql`coalesce(${applications.updatedAt}, ${applications.createdAt})`)
    )
    .limit(5);

  const staleApplications = await db
    .select({
      id: applications.id,
      companyName: applications.companyName,
      roleTitle: applications.roleTitle,
      status: applications.status,
      updatedAt: applications.updatedAt,
      createdAt: applications.createdAt,
      daysSinceActivity: sql<number>`cast((unixepoch('now') - coalesce(${applications.updatedAt}, ${applications.createdAt})) / 86400 as integer)`,
    })
    .from(applications)
    .where(
      and(
        eq(applications.userId, user.id),
        inArray(applications.status, ["applied", "interviewing", "offered"]),
        sql`cast((unixepoch('now') - coalesce(${applications.updatedAt}, ${applications.createdAt})) / 86400 as integer) >= ${STALE_THRESHOLD_DAYS}`
      )
    )
    .orderBy(
      desc(sql`coalesce(${applications.updatedAt}, ${applications.createdAt})`)
    )
    .limit(5);

  const applicationsByWeek = await db
    .select({
      period: sql<string>`strftime('%Y-W%W', ${applications.appliedDate}, 'unixepoch')`,
      count: count(),
    })
    .from(applications)
    .where(
      and(
        eq(applications.userId, user.id),
        sql`${applications.appliedDate} is not null`,
        sql`${applications.appliedDate} >= unixepoch('now', '-12 weeks')`
      )
    )
    .groupBy(sql`strftime('%Y-W%W', ${applications.appliedDate}, 'unixepoch')`)
    .orderBy(sql`strftime('%Y-W%W', ${applications.appliedDate}, 'unixepoch')`);

  const timeInStage = await db
    .select({
      id: applications.id,
      companyName: applications.companyName,
      roleTitle: applications.roleTitle,
      status: applications.status,
      createdAt: applications.createdAt,
      updatedAt: applications.updatedAt,
      stageEnteredAt: applications.stageEnteredAt,
      daysInStage: sql<number>`cast((unixepoch('now') - ${applications.stageEnteredAt}) / 86400 as integer)`,
    })
    .from(applications)
    .where(
      and(
        eq(applications.userId, user.id),
        inArray(applications.status, ["interviewing", "offered"]),
        sql`${applications.stageEnteredAt} is not null`
      )
    )
    .orderBy(sql`${applications.stageEnteredAt}`);

  const breakdown: Record<ApplicationStatus, number> = {
    saved: 0,
    applied: 0,
    interviewing: 0,
    offered: 0,
    accepted: 0,
    rejected: 0,
    withdrawn: 0,
  };

  for (const r of breakdownRows) {
    if (r.status in breakdown) {
      breakdown[r.status as ApplicationStatus] = r.count;
    }
  }

  const activePipelineCount = ACTIVE_STATUSES.reduce(
    (sum, status) => sum + (breakdown[status] || 0),
    0
  );

  const totalApplied = responseRows.reduce((sum, r) => sum + r.count, 0);
  const totalResponded = responseRows
    .filter((r) => (RESPONDED_STATUSES as readonly string[]).includes(r.status))
    .reduce((sum, r) => sum + r.count, 0);
  const responseRate =
    totalApplied > 0 ? Math.round((totalResponded / totalApplied) * 100) : null;

  return c.json(
    {
      data: {
        breakdown,
        activePipelineCount,
        responseRate,
        responseMeta: {
          responded: totalResponded,
          total: totalApplied,
        },
        recentApplications,
        staleApplications,
        staleThresholdDays: STALE_THRESHOLD_DAYS,
        applicationsByWeek,
        timeInStage,
      },
    },
    StatusCodes.OK
  );
};
