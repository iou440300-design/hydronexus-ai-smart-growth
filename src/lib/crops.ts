export interface CropInfo {
  slug: string;
  name: string;
  emoji: string;
  ph: [number, number];
  ec: [number, number];
  temp: [number, number];
  humidity: [number, number];
  tips: string;
  harvestDays: number;
  yield: string;
}

export const crops: CropInfo[] = [
  { slug: "lettuce", name: "Lettuce", emoji: "🥬", ph: [5.5, 6.5], ec: [0.8, 1.2], temp: [15, 22], humidity: [50, 70], tips: "Best in shaded net-house during Nigerian dry season. Harvest outer leaves for continuous yield.", harvestDays: 42, yield: "180 g / plant" },
  { slug: "spinach", name: "Spinach", emoji: "🌿", ph: [6.0, 7.0], ec: [1.8, 2.3], temp: [16, 24], humidity: [50, 70], tips: "Sensitive to heat — provide 40% shade cloth in Northern Nigeria.", harvestDays: 40, yield: "150 g / plant" },
  { slug: "tomato", name: "Tomato", emoji: "🍅", ph: [5.8, 6.3], ec: [2.0, 3.5], temp: [20, 27], humidity: [60, 75], tips: "Support with trellis. Pollinate flowers by hand or vibration weekly.", harvestDays: 90, yield: "3.5 kg / plant" },
  { slug: "pepper", name: "Pepper", emoji: "🌶️", ph: [5.5, 6.5], ec: [1.8, 2.8], temp: [22, 28], humidity: [55, 70], tips: "Great fit for Nigerian palate. Strong lighting drives capsaicin.", harvestDays: 80, yield: "1.8 kg / plant" },
  { slug: "cucumber", name: "Cucumber", emoji: "🥒", ph: [5.8, 6.5], ec: [1.8, 2.5], temp: [22, 28], humidity: [70, 80], tips: "High water demand — check reservoir twice daily.", harvestDays: 55, yield: "5 kg / plant" },
  { slug: "strawberry", name: "Strawberry", emoji: "🍓", ph: [5.5, 6.5], ec: [1.4, 1.8], temp: [18, 24], humidity: [65, 75], tips: "Cool nights improve sweetness — best in Jos plateau.", harvestDays: 60, yield: "700 g / plant" },
  { slug: "mint", name: "Mint", emoji: "🌱", ph: [6.0, 7.0], ec: [1.6, 2.0], temp: [18, 26], humidity: [55, 70], tips: "Aggressive grower — isolate rafts.", harvestDays: 45, yield: "220 g / plant" },
  { slug: "basil", name: "Basil", emoji: "🌿", ph: [5.5, 6.5], ec: [1.0, 1.6], temp: [20, 28], humidity: [55, 70], tips: "Pinch flowers to keep leaves tender.", harvestDays: 35, yield: "180 g / plant" },
  { slug: "kale", name: "Kale", emoji: "🥬", ph: [6.0, 7.5], ec: [1.2, 1.8], temp: [15, 24], humidity: [50, 70], tips: "Cold-tolerant. Great winter crop in Plateau State.", harvestDays: 55, yield: "300 g / plant" },
];
