import { reset, seed } from "drizzle-seed";
import { db } from "~/db/db";
import * as schema from "~/db/schema";

async function main() {
  await reset(db, schema);

  await seed(db, schema).refine((f) => ({
    videos: {
      count: 10,
      columns: {
        title: f.loremIpsum({ sentencesCount: 1 }),
      },
    },
  }));
}

main()
  .then(() => {
    console.log("Seed success!");
  })
  .catch((error) => {
    console.log(error);
  })
  .finally(() => {
    process.exit(0);
  });
