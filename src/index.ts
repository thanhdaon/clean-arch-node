import "~/common/instrumentation";

import { makeUserRepository } from "~/adapters/drizzle-user-repository";
import type { App } from "~/app";
import { makeCommandAddUser } from "~/app/command/add-user";
import { makeQueryAllUsers } from "~/app/query/all-users";
import { log } from "~/common/logger";
import { runHttpServer } from "~/ports/http/server";

async function main() {
  const userRepository = makeUserRepository();

  const app: App = {
    command: {
      addUser: makeCommandAddUser({ users: userRepository }),
    },
    query: {
      allUsers: makeQueryAllUsers({ users: userRepository }),
    },
  };

  runHttpServer(app);
}

main().catch((error) => {
  log.error(error);
});
