import "server-only";
import bcrypt from "bcryptjs";

const COST = 12;
// Compared against when the user does not exist, so response time does not reveal accounts.
const DUMMY_HASH = bcrypt.hashSync("omnity-dummy-password", COST);

export function hashPassword(plain: string) {
  return bcrypt.hash(plain, COST);
}

export async function verifyPassword(plain: string, hash: string | null | undefined) {
  return bcrypt.compare(plain, hash ?? DUMMY_HASH).then((ok) => ok && !!hash);
}
