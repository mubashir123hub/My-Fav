export const VIDEO_CATEGORIES = [
  "Technology",
  "Gaming",
  "Music",
  "Entertainment",
  "Education",
  "Sports",
  "News",
  "Comedy",
  "Travel",
  "Cooking",
  "Fashion",
  "Health",
  "Science",
  "Documentary",
  "Animation",
] as const;

export const THEMES = {
  DARK: "dark",
  LIGHT: "light",
  SYSTEM: "system",
} as const;

export const MOCK_THUMBNAILS = [
  "https://pixabay.com/get/gedfeb26a63f0597eae9c70e48cc80a38b58da8af0eeacc1a4ef91b028ef8358cb57c18724604f0f1d4afeec56411542e0b172e4bd9d29abe7390e238721d1993_1280.jpg",
  "https://pixabay.com/get/gab8aa72fd627d9a95e61101b87c6b29372d1f8665df0ee6e8dd150d50d1b9c745b156fc5dbdea4c6d6ab9e3bc0840ca2022499337b34aedf72e39c0a9335dd0a_1280.jpg",
  "https://pixabay.com/get/gdd3a5e911e46679cdc6d8fc741d3108c4c81eb80ae41b5e714c8aca6de41e3d79f2cd5ba2cf2f11ea64904d59590853ba22df46f5c7d13db92d648bb8d2ecfec_1280.jpg",
  "https://pixabay.com/get/gfd94128f3408e78da2073a070e46a1198d1ee9ac894907d53ac137544728f5dd3368be63b8d8d3038a5731f08aa5b7b83452bd51e642adf8be7534fa5b3f3c5a_1280.jpg",
  "https://pixabay.com/get/gf2048b6e80155db28767686481239905f5cf7c9fba83ec703544644559b5fdf5906fb1f70d1581fabf65ea1eb494d889876fe41c1a8b1be73784b1a7d974edb9_1280.jpg",
  "https://pixabay.com/get/g340b2f9d2b2611ac8f32878012be9b91a26c1340a032b4a579becfc5774301e8d0f6242f0788c934821c2a97c2d6d414815ca7ffd9aadc0aa6fb2d4b22ad83d2_1280.jpg",
  "https://pixabay.com/get/g4159c3a35eb941207b14d023703e07d6ccbca61005b6d1ae46d57c19f7a073ebb97feca9f6778b10358fe7c6161927efbad6dd2c3e9eabe487d87330aa518ccd_1280.jpg",
  "https://pixabay.com/get/g19be04137a64f69cc24203916edea0da0683f3df4c4748c1fae6425205f3aaeca82d5601c9f96a0a828cf68decdfde7643250accad807d16ebb98cb2564710d1_1280.jpg",
];

export const MOCK_AVATARS = [
  "https://pixabay.com/get/g8fc303b5facd9c177ca4dbca501ae5f5f3a525cd937d9c4fe21f30267b8dbcc6ce8dc6a07ae4c392311bacc9d44132c451694e3c434ac0913a7b21a1413b8a27_1280.jpg",
  "https://pixabay.com/get/gb61fa876fd58d73156cb47fdd4c6fb6833a4c5f4fcb8d45cdabc4b3a5fbc4abf525c44fba761e711823c4ee6c5deb406d6c177eaec899fee7467d493c3f65044_1280.jpg",
  "https://pixabay.com/get/g7944eecb84bc6cb6993e7362b6015dfce088844c4906d8ee8fe92059e98bff311303a3f3f64ecb862a36df0e8d79d50277ffaaaff2fbf2fd64e0d5e2b20ba288_1280.jpg",
  "https://pixabay.com/get/g9e360acdb88f735f868d511a0c80ceabd8e6b23e2913e3c40b3a5f91b9122da3daaece7ef6c90b6df2a6dfc832fc64b1783e359a86345a27f8dd3ee8e931a583_1280.jpg",
  "https://pixabay.com/get/g6aaf51ad84d5c422eccd9a219cb13a036d0ab2d585ed0eacab6b2c2ab97f6cdd6ce4ab039d3d6fdf348d2307d5186ac960fc95ed09e296eccd4574157fe9a9a5_1280.jpg",
  "https://pixabay.com/get/gd22b716ec8001b900ce15f5e0b270587ae50c13ffa699f27aa1c785a0cb7c9243783d5031c418a00b41baf30bfc5e204fe18c18e4893e968ecc7ed2a59d0140b_1280.jpg",
];

export const API_ENDPOINTS = {
  USERS: "/api/users",
  CHANNELS: "/api/channels",
  VIDEOS: "/api/videos",
  SUBSCRIPTIONS: "/api/subscriptions",
  COMMENTS: "/api/comments",
  VIDEO_VIEWS: "/api/video-views",
  VIDEO_LIKES: "/api/video-likes",
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
  },
} as const;
