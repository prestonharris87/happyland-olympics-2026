import { cookies } from "next/headers";

const ADJECTIVES = [
  "crazy", "wild", "sneaky", "bold", "jolly", "mighty", "swift", "clever",
  "brave", "dizzy", "fierce", "gentle", "happy", "icy", "keen", "lazy",
  "noble", "proud", "quick", "rowdy", "silly", "tiny", "vivid", "witty",
];

const ANIMALS = [
  "coyote", "eagle", "falcon", "gopher", "hawk", "jaguar", "koala",
  "lemur", "moose", "otter", "panda", "quail", "raccoon", "shark",
  "tiger", "urchin", "viper", "walrus", "fox", "bear", "wolf", "lynx",
];

function generateUsername(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `${adj} ${animal}`;
}

export interface UserIdentity {
  id: string;
  username: string;
}

export async function ensureUserIdentity(): Promise<UserIdentity> {
  const cookieStore = await cookies();
  const existing = cookieStore.get("hl-user");

  if (existing) {
    try {
      return JSON.parse(existing.value) as UserIdentity;
    } catch {
      // Corrupted cookie, fall through to create new one
    }
  }

  const identity: UserIdentity = {
    id: crypto.randomUUID(),
    username: generateUsername(),
  };

  cookieStore.set("hl-user", JSON.stringify(identity), {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
    httpOnly: false, // Client needs to read it
  });

  return identity;
}

export async function getUserIdentity(): Promise<UserIdentity | null> {
  const cookieStore = await cookies();
  const existing = cookieStore.get("hl-user");

  if (existing) {
    try {
      return JSON.parse(existing.value) as UserIdentity;
    } catch {
      return null;
    }
  }

  return null;
}
