// Traduzione italiana dei nomi delle carte: l'API ufficiale restituisce solo
// il nome inglese (player.cards[].name), non esiste un parametro lingua.
// Questa tabella è stata compilata incrociando la wiki ufficiale italiana
// (clashroyale.fandom.com/it/wiki/Carte) con le pagine RoyaleAPI che mostrano
// side-by-side lo slug inglese e il nome italiano (es. royaleapi.com/card/
// mighty-miner?lang=it mostra "Minatore colossale"), verificata il 2026-07-12.
// Per le carte più recenti/ambigue (es. Warmth→Calduccio, Vines→Groviglio,
// Void→Nihil) ho controllato singolarmente invece di indovinare dal nome
// inglese. Un paio di carte molto recenti non le ho trovate con una fonte
// abbastanza affidabile (vedi commento in fondo) e restano quindi in inglese
// finché non si trova una conferma.
export const CARD_NAMES_IT = {
  // comuni
  Minions: "Sgherri",
  Archers: "Arcieri",
  Knight: "Cavaliere",
  "Spear Goblins": "Goblin lancieri",
  Goblins: "Goblin",
  Bomber: "Bombarolo",
  Skeletons: "Scheletri",
  Barbarians: "Barbari",
  "Electro Spirit": "Spirito elettrico",
  "Skeleton Dragons": "Draghi d'ossa",
  "Fire Spirit": "Spirito del fuoco",
  Bats: "Pipistrelli",
  "Royal Recruits": "Reclute Royale",
  "Royal Giant": "Gigante Royale",
  "Ice Spirit": "Spirito del ghiaccio",
  "Skeleton Barrel": "Barile d'ossa",
  "Goblin Gang": "Gang di goblin",
  "Elite Barbarians": "Barbari scelti",
  "Minion Horde": "Orda di sgherri",
  Firecracker: "Arciere pirotecnico",
  Rascals: "Mascalzoni",
  Berserker: "Berserker",

  // rare
  "Mini P.E.K.K.A": "Mini P.E.K.K.A",
  Musketeer: "Moschettiere",
  Giant: "Gigante",
  Valkyrie: "Valchiria",
  "Mega Minion": "Megasgherro",
  "Battle Ram": "Ariete da battaglia",
  Wizard: "Stregone",
  "Flying Machine": "Macchina volante",
  "Hog Rider": "Domatore di cinghiali",
  "Royal Hogs": "Maiali Royale",
  "Three Musketeers": "Tre moschettiere",
  "Battle Healer": "Guaritrice guerriera",
  "Ice Golem": "Golem del ghiaccio",
  "Dart Goblin": "Goblin cerbottaniere",
  Furnace: "Fornace",
  Zappies: "Scaricuccioli",
  "Goblin Demolisher": "Goblin demolitore",
  "Heal Spirit": "Spirito della cura",
  "Suspicious Bush": "Cespuglio sospetto",
  "Elixir Golem": "Golem di elisir",

  // epiche
  Guards: "Guardie",
  "Baby Dragon": "Cucciolo di drago",
  "Skeleton Army": "Orda di scheletri",
  Witch: "Strega",
  "P.E.K.K.A": "P.E.K.K.A",
  "Dark Prince": "Principe nero",
  Prince: "Principe",
  Balloon: "Mongolfiera",
  "Giant Skeleton": "Scheletro gigante",
  "Rune Giant": "Gigantessa delle rune",
  "Goblin Giant": "Gigante goblin",
  Hunter: "Cacciatore",
  Golem: "Golem",
  "Electro Dragon": "Drago elettrico",
  "Wall Breakers": "Spaccamuro",
  Bowler: "Bocciatore",
  Executioner: "Boia",
  "Cannon Cart": "Cannone a rotelle",
  "Electro Giant": "Gigante elettrico",

  // leggendarie
  "Mega Knight": "Gran cavaliere",
  "Ram Rider": "Domatrice di arieti",
  "Electro Wizard": "Stregone elettrico",
  "Inferno Dragon": "Drago infernale",
  Sparky: "Scintilla",
  Miner: "Minatore",
  Princess: "Principessa",
  Phoenix: "Fenice",
  "Royal Ghost": "Fantasma Royale",
  "Ice Wizard": "Stregone di ghiaccio",
  "Magic Archer": "Arciere magico",
  Bandit: "Fuorilegge",
  "Lava Hound": "Mastino lavico",
  "Night Witch": "Strega notturna",
  Lumberjack: "Boscaiolo",
  "Spirit Empress": "Imperatrice degli spiriti",
  "Goblin Machine": "Macchina goblin",
  "Mother Witch": "Strega madre",
  Fisherman: "Pescatore",
  Ronin: "Ronin",

  // campioni
  "Golden Knight": "Cavaliere d'oro",
  "Skeleton King": "Re degli scheletri",
  "Boss Bandit": "Fuorilegge boss",
  "Archer Queen": "Regina degli arcieri",
  "Mighty Miner": "Minatore colossale",
  Monk: "Monaco",
  "Little Prince": "Principino",
  Goblinstein: "Goblinstein",

  // incantesimi
  Arrows: "Frecce",
  Zap: "Scarica",
  "Giant Snowball": "Palla di neve gigante",
  "Royal Delivery": "Consegna Royale",
  Warmth: "Calduccio",
  Fireball: "Sfera infuocata",
  Rocket: "Razzo",
  Earthquake: "Terremoto",
  Heal: "Cura",
  "Goblin Barrel": "Barile goblin",
  Vines: "Groviglio",
  Lightning: "Fulmine",
  Freeze: "Congelamento",
  "Barbarian Barrel": "Barile barbarico",
  Poison: "Veleno",
  "Goblin Curse": "Maledizione goblin",
  Rage: "Furia",
  Void: "Nihil",
  Clone: "Clonazione",
  Tornado: "Tornado",
  Mirror: "Specchio",
  "The Log": "Il tronco",
  Graveyard: "Cimitero",
  "Party Rocket": "Razzo festaiolo",

  // edifici
  Cannon: "Cannone",
  Mortar: "Mortaio",
  Tesla: "Tesla",
  "Goblin Cage": "Gabbia per goblin",
  "Goblin Hut": "Capanna goblin",
  Tombstone: "Lapide",
  "Bomb Tower": "Torre bombardiera",
  "Inferno Tower": "Torre infernale",
  "Barbarian Hut": "Capanna dei barbari",
  "Elixir Collector": "Estrattore di elisir",
  "X-Bow": "Arco-X",
  "Goblin Drill": "Trivella goblin",

  // truppe delle torri
  "Tower Princess": "Principessa della torre",
  "Dagger Duchess": "Duchessa dei pugnali",
  "Royal Chef": "Chef reale",

  // Carte non ancora verificate con una fonte abbastanza affidabile, quindi
  // lasciate in inglese: "Party Hut" e "Rocket Silo" (edifici leggendari) e
  // "Cannoneer" (truppa delle torri epica) — i loro nomi italiani ("Capanna
  // festaiola"?, "Razzo-silo"?, "Cannoniere"?) sono probabili ma non
  // confermati incrociando due fonti indipendenti.
};

export function cardNameIt(englishName) {
  return CARD_NAMES_IT[englishName] || englishName;
}
