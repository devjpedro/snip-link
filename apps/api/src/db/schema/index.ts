import { accounts } from "./accounts";
import { clicks } from "./clicks";
import { jwkss } from "./jwks";
import { links } from "./links";
import { sessions } from "./sessions";
import { users } from "./users";
import { verifications } from "./verifications";

import "./relations";

export const schema = {
  users,
  accounts,
  sessions,
  verifications,
  links,
  clicks,
  jwkss,
};
