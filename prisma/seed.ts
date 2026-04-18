/**
 * Demo seed — populates both vertical pulse surveys with plausible data so
 * the page has visible bars on first load. Safe to re-run: it skips ballots
 * that already exist (keyed on the deterministic seed hash).
 *
 *   npm run db:seed
 */

import { createHmac } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { homeHealthSurvey } from "../src/content/surveys/home-health";
import { homeHospiceSurvey } from "../src/content/surveys/home-hospice";
import { DISCIPLINES } from "../src/content/disciplines";
import { HOME_HEALTH_AGENCIES } from "../src/content/agencies/home-health";
import { HOME_HOSPICE_AGENCIES } from "../src/content/agencies/home-hospice";
import { usernameForBallot } from "../src/lib/username";

const db = new PrismaClient();

// The seed uses its own pepper — it does NOT read IDENTITY_HASH_PEPPER. This
// way demo ballots can't collide with real ones on a shared DB.
const SEED_PEPPER = "avm-demo-seed-v1";

function seededRng(tag: string) {
  let state = Number.parseInt(
    createHmac("sha256", SEED_PEPPER).update(tag).digest("hex").slice(0, 12),
    16
  );
  return () => {
    // mulberry32
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashBallot(tag: string): string {
  return createHmac("sha256", SEED_PEPPER).update(tag).digest("hex");
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

type VerticalSeed = {
  vertical: string;
  survey: typeof homeHealthSurvey;
  agencies: typeof HOME_HEALTH_AGENCIES;
  ballots: number;
};

const plan: VerticalSeed[] = [
  {
    vertical: "home-health",
    survey: homeHealthSurvey,
    agencies: HOME_HEALTH_AGENCIES,
    ballots: 28,
  },
  {
    vertical: "home-hospice",
    survey: homeHospiceSurvey,
    agencies: HOME_HOSPICE_AGENCIES,
    ballots: 22,
  },
];

const SAMPLE_GENERAL_FEEDBACK = [
  "Mileage has been flat for three years while gas keeps climbing. The math stopped working a while ago.",
  "Leadership says \"safety first\" in every huddle but caseload hasn't budged. Words vs. schedule.",
  "Love my branch team. Love my patients. Would love corporate to trust our clinical judgment more.",
  "Documentation expectations keep expanding, visit window hasn't. Something has to give.",
  "On-call rotation is the single biggest source of turnover in our office.",
  "Productivity expectations don't account for windshield time. A 60-mile day isn't 30 visits.",
  "Bereavement support for clinicians is minimal. We carry a lot that no one asks about.",
];

const SAMPLE_QUESTION_SUGGESTIONS = [
  "Ask about weekend on-call stipends vs. weekday.",
  "How many patients are on your caseload this week vs. six months ago?",
  "Do you get dedicated charting time inside your shift, or is it all after-hours?",
  "What EMR does your agency use, and how many clicks to complete an OASIS?",
  "Are you reimbursed for CEUs? License renewal? BLS?",
];

async function seedVertical(v: VerticalSeed) {
  console.log(`\n→ seeding ${v.vertical} (${v.ballots} ballots)`);
  const rng = seededRng(v.vertical);

  for (let i = 0; i < v.ballots; i++) {
    const tag = `${v.vertical}:${i}`;
    const ballotHash = hashBallot(tag);
    const username = usernameForBallot(ballotHash);

    const discipline = pick(rng, DISCIPLINES);
    // Leave the write-in slot open unless we hit "other".
    const agency = pick(rng, v.agencies.filter((a) => a.key !== "other"));

    await db.ballotProfile.upsert({
      where: { ballotHash_vertical: { ballotHash, vertical: v.vertical } },
      create: {
        ballotHash,
        vertical: v.vertical,
        username,
        discipline: discipline.key,
        agencyKey: agency.key,
      },
      update: {
        discipline: discipline.key,
        agencyKey: agency.key,
      },
    });

    for (const q of v.survey.questions) {
      if (q.kind === "single_choice") {
        const opt = pick(rng, q.options);
        await db.surveyResponse.upsert({
          where: {
            vertical_questionSlug_gridKey_ballotHash: {
              vertical: v.vertical,
              questionSlug: q.slug,
              gridKey: "",
              ballotHash,
            },
          },
          create: {
            vertical: v.vertical,
            questionSlug: q.slug,
            gridKey: "",
            optionKey: opt.key,
            ballotHash,
          },
          update: { optionKey: opt.key, numericValue: null },
        });
      }

      if (q.kind === "numeric") {
        const min = q.min ?? 0;
        const max = q.max ?? 100;
        // Bias toward plausible values using a triangular-ish distribution
        const mid = (min + max) / 2;
        const value = Number(
          (mid + (rng() + rng() - 1) * (max - min) * 0.25).toFixed(q.step && q.step < 1 ? 2 : 0)
        );
        const clamped = Math.min(max, Math.max(min, value));
        await db.surveyResponse.upsert({
          where: {
            vertical_questionSlug_gridKey_ballotHash: {
              vertical: v.vertical,
              questionSlug: q.slug,
              gridKey: "",
              ballotHash,
            },
          },
          create: {
            vertical: v.vertical,
            questionSlug: q.slug,
            gridKey: "",
            numericValue: clamped,
            ballotHash,
          },
          update: { numericValue: clamped, optionKey: null },
        });
        if (q.context) {
          const ctxOpt = pick(rng, q.context.options);
          const composedSlug = `${q.slug}__${q.context.slug}`;
          await db.surveyResponse.upsert({
            where: {
              vertical_questionSlug_gridKey_ballotHash: {
                vertical: v.vertical,
                questionSlug: composedSlug,
                gridKey: "",
                ballotHash,
              },
            },
            create: {
              vertical: v.vertical,
              questionSlug: composedSlug,
              gridKey: "",
              optionKey: ctxOpt.key,
              ballotHash,
            },
            update: { optionKey: ctxOpt.key },
          });
        }
      }

      if (q.kind === "grid_numeric") {
        for (const row of q.rows) {
          // 70% of ballots fill each row; stays realistic.
          if (rng() > 0.7) continue;
          const base = 1 + rng() * 1.5; // 1.0–2.5 feels right for unit weights
          const value = Number(base.toFixed(2));
          await db.surveyResponse.upsert({
            where: {
              vertical_questionSlug_gridKey_ballotHash: {
                vertical: v.vertical,
                questionSlug: q.slug,
                gridKey: row.key,
                ballotHash,
              },
            },
            create: {
              vertical: v.vertical,
              questionSlug: q.slug,
              gridKey: row.key,
              numericValue: value,
              ballotHash,
            },
            update: { numericValue: value },
          });
        }
      }

      if (q.kind === "free_text" && rng() > 0.55) {
        const pool =
          q.feedbackKind === "question-suggestion"
            ? SAMPLE_QUESTION_SUGGESTIONS
            : SAMPLE_GENERAL_FEEDBACK;
        const text = pick(rng, pool);
        await db.freeTextFeedback.create({
          data: {
            vertical: v.vertical,
            kind: q.feedbackKind,
            text,
            username,
            discipline: discipline.key,
            agencyKey: agency.key,
            ballotHash,
          },
        });
      }
    }
  }
}

async function main() {
  console.log("AVM demo seed — populating pulse surveys with sample data.");
  for (const v of plan) await seedVertical(v);
  const hh = await db.surveyResponse.count({ where: { vertical: "home-health" } });
  const hs = await db.surveyResponse.count({ where: { vertical: "home-hospice" } });
  console.log(`\n✓ Done. home-health responses: ${hh} · home-hospice responses: ${hs}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
