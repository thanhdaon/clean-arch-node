import "~/common/instrumentation";

import { startHttpServer } from "~/ports/http/server";
import { log } from "./common/logger";
import { makeUserRepository } from "~/adapters/drizzle-task-repository";
import { makeCommandAddUser } from "./app/command/add-user";

async function main() {
  const userRepository = makeUserRepository();
  startHttpServer();
}

main()
  .catch((error) => {
    log.error(error);
  })
  .finally(() => {
    process.exit(0);
  });
