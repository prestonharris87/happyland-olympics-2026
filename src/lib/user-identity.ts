import { cookies, headers } from "next/headers";

const ADJECTIVES = [
  "crazy", "wild", "sneaky", "bold", "jolly", "mighty", "swift", "clever",
  "brave", "dizzy", "fierce", "gentle", "happy", "icy", "keen", "lazy",
  "noble", "proud", "quick", "rowdy", "silly", "tiny", "vivid", "witty",
  "zany", "grumpy", "spicy", "cosmic", "salty", "chunky", "funky", "shady",
  "peppy", "snappy", "gritty", "fluffy", "crispy", "stormy", "dusty", "rusty",
  "breezy", "cheeky", "plucky", "scrappy", "feisty", "nifty", "wacky", "lumpy",
];

const ANIMALS = [
  "coyote", "eagle", "falcon", "gopher", "hawk", "jaguar", "koala",
  "lemur", "moose", "otter", "panda", "quail", "raccoon", "shark",
  "tiger", "urchin", "viper", "walrus", "fox", "bear", "wolf", "lynx",
  "badger", "bison", "crane", "donkey", "ferret", "gecko", "heron",
  "ibex", "jackal", "kiwi", "lobster", "marmot", "newt", "ocelot",
  "parrot", "rabbit", "squid", "toucan", "wombat", "yak", "zebra", "alpaca",
];

const MI_ANIMALS = [
  "bunny", "pony", "kitten", "duckling", "fawn", "lamb", "piglet",
  "butterfly", "ladybug", "hummingbird", "seahorse", "chinchilla",
  "hamster", "puppy", "goldfish", "lovebird", "sugar glider", "hedgehog",
];

function generateUsername(region?: string | null): string {
  const adj = region === "CA"
    ? "gay"
    : region === "MI"
    ? "testosterone"
    : region === "NY"
    ? "evil"
    : ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animalList = region === "MI" ? MI_ANIMALS : ANIMALS;
  const animal = animalList[Math.floor(Math.random() * animalList.length)];
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

  const headerStore = await headers();
  const region = headerStore.get("x-vercel-ip-country-region");

  const identity: UserIdentity = {
    id: crypto.randomUUID(),
    username: generateUsername(region),
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
