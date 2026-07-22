// Il badgeId del clan (player.clan.badgeId) non ha nessun endpoint pubblico
// nell'API ufficiale per risalire all'immagine (provato sia il dominio
// ufficiale che vari percorsi della CDN di RoyaleAPI: solo 403/404). L'unico
// posto dove esiste davvero l'asset grafico è il repo pubblico open source
// RoyaleAPI/cr-api-assets su GitHub, con un file per ogni badge con il nome
// che risulta da RoyaleAPI/cr-api-data (docs/json/alliance_badges.json,
// campi id/name): i badgeId sono contigui da 16000000, quindi qui basta un
// array ordinato invece di una mappa id→nome. Verificato scaricando a mano
// badges/Bolt_02.png (id 16000009) il 2026-07-21: è davvero lo scudo del
// clan con fulmine, uguale a quello mostrato da RoyaleAPI.
const BADGE_NAMES = [
  "Flame_01", "Flame_02", "Flame_03", "Flame_04", "Sword_01", "Sword_02", "Sword_03", "Sword_04",
  "Bolt_01", "Bolt_02", "Bolt_03", "Bolt_04", "Crown_01", "Crown_02", "Crown_03", "Crown_04",
  "Arrow_01", "Arrow_02", "Arrow_03", "Arrow_04", "Diamond_Star_01", "Diamond_Star_02", "Diamond_Star_03", "Diamond_Star_04",
  "Skull_01", "Skull_02", "Skull_03", "Skull_04", "Skull_05", "Skull_06", "Moon_01", "Moon_02",
  "Moon_03", "Pine_01", "Pine_02", "Pine_03", "Traditional_Star_01", "Traditional_Star_02", "Traditional_Star_03", "Traditional_Star_04",
  "Traditional_Star_05", "Traditional_Star_06", "Star_Shine_01", "Star_Shine_02", "Star_Shine_03", "Diamond_01", "Diamond_02", "Diamond_03",
  "flag_a_01", "flag_a_02", "flag_a_03", "flag_b_01", "flag_b_02", "flag_b_03", "flag_c_03", "flag_c_04",
  "flag_c_05", "flag_c_06", "flag_c_07", "flag_c_08", "flag_d_01", "flag_d_02", "flag_d_03", "flag_d_04",
  "flag_d_05", "flag_d_06", "flag_f_01", "flag_f_02", "flag_g_01", "flag_g_02", "flag_i_01", "flag_i_02",
  "flag_h_01", "flag_h_02", "flag_h_03", "flag_j_01", "flag_j_02", "flag_j_03", "flag_k_01", "flag_k_02",
  "flag_k_03", "flag_k_04", "flag_k_05", "flag_k_06", "flag_l_01", "flag_l_02", "flag_l_03", "flag_m_01",
  "flag_m_02", "flag_m_03", "flag_n_01", "flag_n_02", "flag_n_03", "flag_n_04", "flag_n_05", "flag_n_06",
  "Twin_Peaks_01", "Twin_Peaks_02", "Gem_01", "Gem_02", "Gem_03", "Gem_04", "Coin_01", "Coin_02",
  "Coin_03", "Coin_04", "Elixir_01", "Elixir_02", "Heart_01", "Heart_02", "Heart_04", "Heart_03",
  "Tower_01", "Tower_02", "Tower_03", "Tower_04", "Fan_01", "Fan_02", "Fan_03", "Fan_04",
  "Fugi_01", "Fugi_02", "Fugi_03", "Fugi_04", "YingYang_01", "YingYang_02", "flag_c_01", "flag_c_02",
  "Cherry_Blossom_01", "Cherry_Blossom_02", "Cherry_Blossom_03", "Cherry_Blossom_04", "Cherry_Blossom_06", "Cherry_Blossom_05", "Cherry_Blossom_07", "Cherry_Blossom_08",
  "Bamboo_01", "Bamboo_02", "Bamboo_03", "Bamboo_04", "Orange_01", "Orange_02", "Lotus_01", "Lotus_02",
  "A_Char_King_01", "A_Char_King_02", "A_Char_King_03", "A_Char_King_04", "A_Char_Barbarian_01", "A_Char_Barbarian_02", "A_Char_Prince_01", "A_Char_Prince_02",
  "A_Char_Knight_01", "A_Char_Knight_02", "A_Char_Goblin_01", "A_Char_Goblin_02", "A_Char_DarkPrince_01", "A_Char_DarkPrince_02", "A_Char_DarkPrince_03", "A_Char_DarkPrince_04",
  "A_Char_MiniPekka_01", "A_Char_MiniPekka_02", "A_Char_Pekka_01", "A_Char_Pekka_02", "A_Char_Hammer_01", "A_Char_Hammer_02", "A_Char_Rocket_01", "A_Char_Rocket_02",
  "Freeze_01", "Freeze_02", "Clover_01", "Clover_02", "flag_h_04", "flag_e_02", "flag_i_03", "flag_e_01",
  "A_Char_Barbarian_03", "A_Char_Prince_03", "A_Char_Bomb_01", "A_Char_Bomb_02",
];

const BADGE_ID_START = 16000000;
const ASSETS_BASE = "https://cdn.jsdelivr.net/gh/RoyaleAPI/cr-api-assets@master/badges";

export function clanBadgeUrl(badgeId) {
  const name = BADGE_NAMES[badgeId - BADGE_ID_START];
  return name ? `${ASSETS_BASE}/${name}.png` : null;
}
