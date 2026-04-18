import { createHmac } from "crypto";

/**
 * Deterministic, cheerful anonymous username.
 *
 * Derived from the ballotHash with a dedicated pepper so the same visitor
 * sees the same name every time, but nobody else can reverse it.
 *
 *   Winsome Walrus 42
 *   Radiant Raven 07
 *   Plucky Platypus 11
 */

const ADJECTIVES = [
  "Amber", "Bold", "Breezy", "Bright", "Brisk", "Buoyant", "Candid", "Clever",
  "Cozy", "Crafty", "Curious", "Dapper", "Dauntless", "Earnest", "Fervent",
  "Fleet", "Genial", "Gentle", "Gleeful", "Gracious", "Hearty", "Honest",
  "Humble", "Intrepid", "Jolly", "Jovial", "Kind", "Lively", "Loyal", "Lucid",
  "Luminous", "Mellow", "Merry", "Mighty", "Mindful", "Nimble", "Noble",
  "Optimistic", "Patient", "Plucky", "Poised", "Prudent", "Quiet", "Radiant",
  "Resolute", "Savvy", "Serene", "Spry", "Stalwart", "Steadfast", "Stellar",
  "Stout", "Sturdy", "Sunny", "Swift", "Tenacious", "True", "Unruffled",
  "Valiant", "Vibrant", "Warm", "Whimsical", "Winsome", "Wise", "Zesty",
];

const ANIMALS = [
  "Albatross", "Alpaca", "Axolotl", "Badger", "Bandicoot", "Beaver", "Bison",
  "Bluejay", "Bobcat", "Capybara", "Caracal", "Cardinal", "Chickadee",
  "Chinchilla", "Coati", "Cormorant", "Cougar", "Crane", "Curlew", "Dingo",
  "Dolphin", "Dormouse", "Egret", "Elk", "Ermine", "Falcon", "Ferret",
  "Finch", "Fox", "Gecko", "Gibbon", "Goldfinch", "Goshawk", "Grouse",
  "Hare", "Hawk", "Hedgehog", "Heron", "Ibex", "Iguana", "Impala", "Jackal",
  "Jackalope", "Jackrabbit", "Jay", "Kestrel", "Kingfisher", "Kinkajou",
  "Koala", "Kookaburra", "Lemur", "Lynx", "Magpie", "Manatee", "Marmot",
  "Meerkat", "Mink", "Moose", "Muskrat", "Narwhal", "Newt", "Nightingale",
  "Numbat", "Ocelot", "Opossum", "Orca", "Oriole", "Osprey", "Otter", "Owl",
  "Panda", "Pangolin", "Partridge", "Pelican", "Penguin", "Pika", "Platypus",
  "Porcupine", "Possum", "Puffin", "Quokka", "Raccoon", "Raven", "Red Panda",
  "Robin", "Salamander", "Seahorse", "Skunk", "Sparrow", "Squirrel",
  "Starling", "Swan", "Tanager", "Tapir", "Tern", "Thrush", "Tortoise",
  "Toucan", "Vireo", "Vole", "Walrus", "Warbler", "Weasel", "Whippet",
  "Wolverine", "Wombat", "Woodpecker", "Yak", "Zebra",
];

function pickFromHash(hash: string, segment: number, modulo: number): number {
  // 8 hex chars = 32 bits; plenty of range. Take a different slice per segment.
  const start = segment * 8;
  const slice = hash.slice(start, start + 8);
  return parseInt(slice, 16) % modulo;
}

export function usernameForBallot(ballotHash: string): string {
  const seed = createHmac("sha256", "avm-username-v1").update(ballotHash).digest("hex");
  const adj = ADJECTIVES[pickFromHash(seed, 0, ADJECTIVES.length)];
  const animal = ANIMALS[pickFromHash(seed, 1, ANIMALS.length)];
  const number = (pickFromHash(seed, 2, 89) + 10).toString().padStart(2, "0");
  return `${adj} ${animal} ${number}`;
}
