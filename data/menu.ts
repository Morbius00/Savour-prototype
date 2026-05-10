export interface MenuItem {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  priceRange?: string;
  isVeg: boolean;
  spiceLevel?: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  description?: string;
}

export const RESTAURANT = {
  name: "Chowman",
  tagline: "Think Chinese... Think Chowman",
  website: "www.chowman.net",
  social: "@chowman_kolkata",
};

export const menuItems: MenuItem[] = [
  // SOUPS - VEG
  { id: "s1", name: "Sweet Corn Soup (Veg)", category: "Soup", price: 155, isVeg: true, spiceLevel: 1, tags: ["mild", "sweet", "comfort", "light"] },
  { id: "s2", name: "Clear Soup (Veg)", category: "Soup", price: 135, isVeg: true, spiceLevel: 1, tags: ["light", "healthy", "mild", "diet"] },
  { id: "s3", name: "Noodle Soup (Veg)", category: "Soup", price: 145, isVeg: true, spiceLevel: 2, tags: ["hearty", "filling", "comfort"] },
  { id: "s4", name: "Hot & Sour Soup (Veg)", category: "Soup", price: 150, isVeg: true, spiceLevel: 3, tags: ["spicy", "tangy", "bold"] },
  { id: "s5", name: "Manchow Soup (Veg)", category: "Soup", price: 150, isVeg: true, spiceLevel: 3, tags: ["crispy", "spicy", "popular"] },
  { id: "s6", name: "Lemon Coriander Thick Soup (Veg)", category: "Soup", price: 155, isVeg: true, spiceLevel: 2, tags: ["tangy", "fresh", "healthy"] },
  { id: "s7", name: "Thai Soup", category: "Soup", price: 205, isVeg: true, spiceLevel: 3, tags: ["thai", "exotic", "spicy"] },

  // SOUPS - NON VEG
  { id: "s8", name: "Sweet Corn Soup (Chicken)", category: "Soup", price: 175, isVeg: false, spiceLevel: 1, tags: ["mild", "sweet", "comfort", "chicken"] },
  { id: "s9", name: "Hot & Sour Soup (Chicken)", category: "Soup", price: 165, isVeg: false, spiceLevel: 3, tags: ["spicy", "tangy", "chicken"] },
  { id: "s10", name: "Manchow Soup (Chicken)", category: "Soup", price: 165, isVeg: false, spiceLevel: 3, tags: ["crispy", "spicy", "popular", "chicken"] },
  { id: "s11", name: "Tom Yum Soup (Chicken)", category: "Soup", price: 210, isVeg: false, spiceLevel: 4, tags: ["thai", "spicy", "lemongrass", "chicken"] },
  { id: "s12", name: "Tom Yum Soup (Prawn)", category: "Soup", price: 225, isVeg: false, spiceLevel: 4, tags: ["thai", "spicy", "lemongrass", "prawn", "seafood"] },
  { id: "s13", name: "Sea Food Soup", category: "Soup", price: 230, isVeg: false, spiceLevel: 2, tags: ["seafood", "premium", "rich"] },
  { id: "s14", name: "Chowman's Favourite Soup", category: "Soup", price: 230, isVeg: false, spiceLevel: 2, tags: ["special", "must-try", "signature"] },
  { id: "s15", name: "Wonton Soup (Chicken)", category: "Soup", price: 180, isVeg: false, spiceLevel: 1, tags: ["comfort", "mild", "chicken", "dumpling"] },
  { id: "s16", name: "Tom Kha Soup (Chicken)", category: "Soup", price: 210, isVeg: false, spiceLevel: 3, tags: ["thai", "coconut", "chicken"] },
  { id: "s17", name: "Shanshai Crab Meat Soup", category: "Soup", price: 220, isVeg: false, spiceLevel: 1, tags: ["crab", "premium", "seafood", "delicate"] },

  // STARTERS - VEG
  { id: "st1", name: "Crispy Noodle Salad", category: "Starter", price: 175, isVeg: true, spiceLevel: 2, tags: ["crispy", "light", "salad", "crunchy"] },
  { id: "st2", name: "Chilli Paneer", category: "Starter", price: 220, isVeg: true, spiceLevel: 3, tags: ["spicy", "popular", "paneer", "indian-chinese"] },
  { id: "st3", name: "Paneer Pepper Salt", category: "Starter", price: 220, isVeg: true, spiceLevel: 3, tags: ["pepper", "paneer", "dry"] },
  { id: "st4", name: "Mushroom Pepper Salt", category: "Starter", price: 225, isVeg: true, spiceLevel: 3, tags: ["mushroom", "pepper", "dry"] },
  { id: "st5", name: "Crispy Tofu in Hong Kong Style", category: "Starter", price: 220, isVeg: true, spiceLevel: 2, tags: ["tofu", "hong kong", "crispy", "healthy"] },
  { id: "st6", name: "Crispy Baby Corn With Honey", category: "Starter", price: 210, isVeg: true, spiceLevel: 1, tags: ["sweet", "honey", "crispy", "mild"] },
  { id: "st7", name: "Crispy Chilli Baby Corn", category: "Starter", price: 200, isVeg: true, spiceLevel: 3, tags: ["spicy", "crispy", "baby corn"] },
  { id: "st8", name: "Veg Wonton (Steamed or Fried)", category: "Starter", price: 180, isVeg: true, spiceLevel: 1, tags: ["dumpling", "steamed", "fried", "mild"] },
  { id: "st9", name: "Veg Momos (6 pcs)", category: "Starter", price: 140, isVeg: true, spiceLevel: 2, tags: ["momos", "dumpling", "budget", "steamed"] },
  { id: "st10", name: "Crispy Chilli Mushroom", category: "Starter", price: 225, isVeg: true, spiceLevel: 3, tags: ["mushroom", "spicy", "crispy"] },
  { id: "st11", name: "Cheese & Spinach Roll", category: "Starter", price: 250, isVeg: true, spiceLevel: 1, tags: ["cheese", "spinach", "indulgent", "mild"] },
  { id: "st12", name: "Kung Pao Veg", category: "Starter", price: 245, isVeg: true, spiceLevel: 4, tags: ["kung pao", "spicy", "nuts"] },

  // STARTERS - NON VEG
  { id: "st13", name: "Wonton Steamed (Chicken)", category: "Starter", price: 205, isVeg: false, spiceLevel: 1, tags: ["chicken", "dumpling", "mild", "steamed"] },
  { id: "st14", name: "Chicken Spring Roll", category: "Starter", price: 200, isVeg: false, spiceLevel: 2, tags: ["chicken", "crispy", "popular"] },
  { id: "st15", name: "Konjee Crispy Lamb", category: "Starter", price: 310, isVeg: false, spiceLevel: 3, tags: ["lamb", "crispy", "premium"] },
  { id: "st16", name: "Golden Fried Prawn", category: "Starter", price: 360, isVeg: false, spiceLevel: 1, tags: ["prawn", "crispy", "golden", "premium"] },
  { id: "st17", name: "Prawn Pepper Salt", category: "Starter", price: 370, isVeg: false, spiceLevel: 3, tags: ["prawn", "pepper", "premium"] },
  { id: "st18", name: "Fish Pepper Salt (Basa)", category: "Starter", price: 295, isVeg: false, spiceLevel: 3, tags: ["fish", "pepper", "basa"] },
  { id: "st19", name: "Sliced Chicken in Schezwan Style", category: "Starter", price: 245, isVeg: false, spiceLevel: 4, tags: ["chicken", "schezwan", "spicy"] },
  { id: "st20", name: "Chilli Shrimps", category: "Starter", price: 285, isVeg: false, spiceLevel: 4, tags: ["shrimp", "spicy", "seafood"] },
  { id: "st21", name: "Roasted Chilli Pork", category: "Starter", price: 280, isVeg: false, spiceLevel: 3, tags: ["pork", "roasted", "spicy"] },
  { id: "st22", name: "Momo - 6 pieces (Chicken)", category: "Starter", price: 180, isVeg: false, spiceLevel: 2, tags: ["momos", "chicken", "dumpling", "budget"] },
  { id: "st23", name: "Fried Chicken Wings", category: "Starter", price: 240, isVeg: false, spiceLevel: 2, tags: ["chicken", "wings", "popular", "crispy"] },
  { id: "st24", name: "Chicken Lollipop", category: "Starter", price: 240, isVeg: false, spiceLevel: 3, tags: ["chicken", "lollipop", "popular", "spicy"] },
  { id: "st25", name: "Drums Of Heaven", category: "Starter", price: 250, isVeg: false, spiceLevel: 3, tags: ["chicken", "drums", "crispy", "popular"] },
  { id: "st26", name: "Prawn Ka Seong", category: "Starter", price: 380, isVeg: false, spiceLevel: 3, tags: ["prawn", "premium", "seafood"] },
  { id: "st27", name: "Konjee Crispy Chicken", category: "Starter", price: 250, isVeg: false, spiceLevel: 3, tags: ["chicken", "crispy", "popular"] },
  { id: "st28", name: "Pepper Garlic Chicken", category: "Starter", price: 250, isVeg: false, spiceLevel: 3, tags: ["chicken", "garlic", "pepper"] },
  { id: "st29", name: "Barbeque Chicken", category: "Starter", price: 260, isVeg: false, spiceLevel: 2, tags: ["chicken", "bbq", "smoky"] },
  { id: "st30", name: "Chicken Satay With Peanut Sauce", category: "Starter", price: 300, isVeg: false, spiceLevel: 2, tags: ["thai", "satay", "peanut", "chicken"] },
  { id: "st31", name: "Honey Glazed Spare Ribs", category: "Starter", price: 340, isVeg: false, spiceLevel: 2, tags: ["pork", "honey", "sweet", "ribs", "indulgent"] },

  // VEGETABLES (MAINS)
  { id: "v1", name: "Chilli Garlic Baby Corn & Button Mushroom", category: "Vegetables", price: 230, isVeg: true, spiceLevel: 3, tags: ["spicy", "garlic", "mushroom"] },
  { id: "v2", name: "Schezwan Mixed Vegetable", category: "Vegetables", price: 225, isVeg: true, spiceLevel: 4, tags: ["schezwan", "spicy", "bold"] },
  { id: "v3", name: "Chilli Tofu", category: "Vegetables", price: 235, isVeg: true, spiceLevel: 3, tags: ["tofu", "spicy", "healthy"] },
  { id: "v4", name: "Tofu In Black Bean Sauce", category: "Vegetables", price: 235, isVeg: true, spiceLevel: 2, tags: ["tofu", "black bean", "healthy", "savory"] },
  { id: "v5", name: "Mixed Vegetables in White Sauce", category: "Vegetables", price: 210, isVeg: true, spiceLevel: 1, tags: ["mild", "creamy", "healthy", "comfort"] },
  { id: "v6", name: "Chilli Potato", category: "Vegetables", price: 195, isVeg: true, spiceLevel: 3, tags: ["potato", "spicy", "crispy", "popular"] },
  { id: "v7", name: "Sweet & Sour Vegetables", category: "Vegetables", price: 210, isVeg: true, spiceLevel: 1, tags: ["sweet", "tangy", "mild"] },
  { id: "v8", name: "Hunan Paneer", category: "Vegetables", price: 230, isVeg: true, spiceLevel: 4, tags: ["paneer", "spicy", "hunan"] },
  { id: "v9", name: "Garlic Paneer", category: "Vegetables", price: 230, isVeg: true, spiceLevel: 2, tags: ["paneer", "garlic", "aromatic"] },
  { id: "v10", name: "Exotic Vegetables in Chilli Basil Sauce", category: "Vegetables", price: 210, isVeg: true, spiceLevel: 3, tags: ["basil", "spicy", "exotic"] },
  { id: "v11", name: "Devil's Choice Vegetables", category: "Vegetables", price: 230, isVeg: true, spiceLevel: 5, tags: ["very spicy", "bold", "devil", "hot"] },
  { id: "v12", name: "Broccoli, Baby Corn, Mushroom in Chilli Corn Sauce", category: "Vegetables", price: 250, isVeg: true, spiceLevel: 3, tags: ["broccoli", "healthy", "premium"] },
  { id: "v13", name: "Mixed Vegetables in Kung Pao Style", category: "Vegetables", price: 230, isVeg: true, spiceLevel: 4, tags: ["kung pao", "spicy", "nuts"] },

  // CHICKEN (MAINS)
  { id: "c1", name: "Chicken in Hot Garlic Sauce", category: "Chicken", price: 260, isVeg: false, spiceLevel: 3, tags: ["chicken", "garlic", "spicy"] },
  { id: "c2", name: "Chilli Chicken (Dry/Gravy)", category: "Chicken", price: 260, isVeg: false, spiceLevel: 3, tags: ["chicken", "chilli", "popular", "indian-chinese"] },
  { id: "c3", name: "Manchurian Chicken", category: "Chicken", price: 260, isVeg: false, spiceLevel: 3, tags: ["chicken", "manchurian", "popular", "gravy"] },
  { id: "c4", name: "Garlic Chicken", category: "Chicken", price: 260, isVeg: false, spiceLevel: 2, tags: ["chicken", "garlic", "aromatic"] },
  { id: "c5", name: "Ginger Chicken", category: "Chicken", price: 260, isVeg: false, spiceLevel: 2, tags: ["chicken", "ginger", "aromatic"] },
  { id: "c6", name: "Teriyaki Chicken", category: "Chicken", price: 270, isVeg: false, spiceLevel: 1, tags: ["chicken", "teriyaki", "sweet", "japanese-inspired"] },
  { id: "c7", name: "Oyster Chicken With Vegetables", category: "Chicken", price: 280, isVeg: false, spiceLevel: 2, tags: ["chicken", "oyster sauce", "vegetables"] },
  { id: "c8", name: "Hunan Chicken", category: "Chicken", price: 270, isVeg: false, spiceLevel: 4, tags: ["chicken", "hunan", "very spicy"] },
  { id: "c9", name: "Schezwan Chicken", category: "Chicken", price: 270, isVeg: false, spiceLevel: 4, tags: ["chicken", "schezwan", "spicy", "bold"] },
  { id: "c10", name: "Chicken With Cashewnut And Dry Chilli", category: "Chicken", price: 265, isVeg: false, spiceLevel: 3, tags: ["chicken", "cashew", "nuts", "dry chilli"] },
  { id: "c11", name: "Kung Pao Chicken (Dry/Gravy)", category: "Chicken", price: 290, isVeg: false, spiceLevel: 4, tags: ["chicken", "kung pao", "nuts", "spicy"] },
  { id: "c12", name: "Sweet And Sour Chicken", category: "Chicken", price: 275, isVeg: false, spiceLevel: 1, tags: ["chicken", "sweet", "tangy", "popular"] },
  { id: "c13", name: "Honey Chicken", category: "Chicken", price: 270, isVeg: false, spiceLevel: 1, tags: ["chicken", "honey", "sweet", "mild"] },
  { id: "c14", name: "Lemon Chicken", category: "Chicken", price: 260, isVeg: false, spiceLevel: 1, tags: ["chicken", "lemon", "light", "tangy"] },
  { id: "c15", name: "CHOWMAN's Special Chicken", category: "Chicken", price: 290, isVeg: false, spiceLevel: 3, tags: ["chicken", "signature", "special", "must-try"] },
  { id: "c16", name: "Devil's Chicken", category: "Chicken", price: 270, isVeg: false, spiceLevel: 5, tags: ["chicken", "very spicy", "hot", "devil"] },
  { id: "c17", name: "Spicy Orange Chicken", category: "Chicken", price: 280, isVeg: false, spiceLevel: 3, tags: ["chicken", "orange", "citrus", "tangy", "spicy"] },
  { id: "c18", name: "Hot Pot Hunan Chicken with Shitake Mushroom", category: "Chicken", price: 290, isVeg: false, spiceLevel: 4, tags: ["chicken", "mushroom", "hunan", "spicy", "pot"] },
  { id: "c19", name: "Sweet & Spicy Pineapple Chicken", category: "Chicken", price: 280, isVeg: false, spiceLevel: 3, tags: ["chicken", "pineapple", "sweet", "spicy"] },
  { id: "c20", name: "General Tao's Chicken", category: "Chicken", price: 280, isVeg: false, spiceLevel: 3, tags: ["chicken", "general tao", "classic", "popular"] },

  // PRAWNS (MAINS)
  { id: "p1", name: "Schezwan Prawn", category: "Prawns", price: 375, isVeg: false, spiceLevel: 4, tags: ["prawn", "schezwan", "spicy", "seafood"] },
  { id: "p2", name: "Chilli Prawn (Dry/Gravy)", category: "Prawns", price: 375, isVeg: false, spiceLevel: 3, tags: ["prawn", "chilli", "seafood"] },
  { id: "p3", name: "Garlic Prawn", category: "Prawns", price: 375, isVeg: false, spiceLevel: 2, tags: ["prawn", "garlic", "seafood"] },
  { id: "p4", name: "Manchurian Prawn", category: "Prawns", price: 375, isVeg: false, spiceLevel: 3, tags: ["prawn", "manchurian", "seafood"] },
  { id: "p5", name: "Chilli Honey Prawn", category: "Prawns", price: 385, isVeg: false, spiceLevel: 3, tags: ["prawn", "honey", "sweet-spicy", "seafood"] },
  { id: "p6", name: "Sweet And Sour Prawn", category: "Prawns", price: 385, isVeg: false, spiceLevel: 1, tags: ["prawn", "sweet", "tangy", "seafood"] },
  { id: "p7", name: "Kung Pao Prawn (Dry/Gravy)", category: "Prawns", price: 395, isVeg: false, spiceLevel: 4, tags: ["prawn", "kung pao", "nuts", "spicy", "seafood"] },
  { id: "p8", name: "Jumbo Prawn (Pepper Garlic)", category: "Prawns", price: 695, isVeg: false, spiceLevel: 3, tags: ["jumbo prawn", "premium", "seafood", "special occasion"] },
  { id: "p9", name: "Devil's Prawn", category: "Prawns", price: 395, isVeg: false, spiceLevel: 5, tags: ["prawn", "very spicy", "devil", "hot", "seafood"] },
  { id: "p10", name: "Butter Garlic Prawn", category: "Prawns", price: 395, isVeg: false, spiceLevel: 1, tags: ["prawn", "butter", "garlic", "rich", "mild", "seafood"] },

  // FISH (MAINS)
  { id: "f1", name: "Chilli Fish - Basa (Dry/Gravy)", category: "Fish", price: 295, isVeg: false, spiceLevel: 3, tags: ["fish", "chilli", "basa"] },
  { id: "f2", name: "Fish in Black Bean Sauce (Basa)", category: "Fish", price: 300, isVeg: false, spiceLevel: 2, tags: ["fish", "black bean", "basa", "savory"] },
  { id: "f3", name: "Hunan Fish (Basa)", category: "Fish", price: 300, isVeg: false, spiceLevel: 4, tags: ["fish", "hunan", "spicy", "basa"] },
  { id: "f4", name: "Lemon Fish (Basa)", category: "Fish", price: 295, isVeg: false, spiceLevel: 1, tags: ["fish", "lemon", "light", "tangy", "basa"] },
  { id: "f5", name: "Schezwan Fish (Basa)", category: "Fish", price: 300, isVeg: false, spiceLevel: 4, tags: ["fish", "schezwan", "spicy", "basa"] },
  { id: "f6", name: "Garlic Fish (Basa)", category: "Fish", price: 295, isVeg: false, spiceLevel: 2, tags: ["fish", "garlic", "basa"] },
  { id: "f7", name: "Sweet And Sour Fish (Basa)", category: "Fish", price: 300, isVeg: false, spiceLevel: 1, tags: ["fish", "sweet", "tangy", "basa"] },
  { id: "f8", name: "Fish in Sweet Chilli Sauce (Basa)", category: "Fish", price: 320, isVeg: false, spiceLevel: 3, tags: ["fish", "sweet chilli", "basa"] },
  { id: "f9", name: "Chilli Wine Fish (Basa)", category: "Fish", price: 310, isVeg: false, spiceLevel: 3, tags: ["fish", "wine", "basa", "premium"] },
  { id: "f10", name: "Fish in Chilli Mustard Sauce (Basa)", category: "Fish", price: 320, isVeg: false, spiceLevel: 3, tags: ["fish", "mustard", "bengali-inspired", "basa"] },

  // PORK (MAINS)
  { id: "pk1", name: "Chilli Pork", category: "Pork", price: 285, isVeg: false, spiceLevel: 3, tags: ["pork", "chilli", "spicy"] },
  { id: "pk2", name: "Roasted Pork in Schezwan Sauce", category: "Pork", price: 295, isVeg: false, spiceLevel: 4, tags: ["pork", "roasted", "schezwan", "spicy"] },
  { id: "pk3", name: "Honey Chilli Pork", category: "Pork", price: 300, isVeg: false, spiceLevel: 3, tags: ["pork", "honey", "sweet-spicy"] },
  { id: "pk4", name: "Sweet And Sour Pork", category: "Pork", price: 290, isVeg: false, spiceLevel: 1, tags: ["pork", "sweet", "tangy"] },
  { id: "pk5", name: "Roasted Pork Belly In Ginger Wine", category: "Pork", price: 320, isVeg: false, spiceLevel: 2, tags: ["pork belly", "wine", "premium", "ginger"] },
  { id: "pk6", name: "Sliced Pork With Cashewnut, Bell Pepper & Spicy Chilli", category: "Pork", price: 320, isVeg: false, spiceLevel: 4, tags: ["pork", "cashew", "spicy", "premium"] },

  // LAMB (MAINS)
  { id: "l1", name: "Lamb In Oyster Sauce", category: "Lamb", price: 340, isVeg: false, spiceLevel: 2, tags: ["lamb", "oyster sauce", "premium"] },
  { id: "l2", name: "Hot Garlic Lamb", category: "Lamb", price: 330, isVeg: false, spiceLevel: 4, tags: ["lamb", "garlic", "spicy"] },
  { id: "l3", name: "Devil's Lamb", category: "Lamb", price: 330, isVeg: false, spiceLevel: 5, tags: ["lamb", "very spicy", "devil", "hot"] },
  { id: "l4", name: "Sliced Lamb In Honey & Black Pepper", category: "Lamb", price: 350, isVeg: false, spiceLevel: 2, tags: ["lamb", "honey", "black pepper", "sweet-savory"] },
  { id: "l5", name: "Five Spice Lamb", category: "Lamb", price: 330, isVeg: false, spiceLevel: 3, tags: ["lamb", "five spice", "aromatic", "classic"] },

  // SEA FOOD
  { id: "sf1", name: "Chilli Crab", category: "Sea Food", price: 330, isVeg: false, spiceLevel: 3, tags: ["crab", "chilli", "seafood", "premium"] },
  { id: "sf2", name: "Crab Meat In Black Bean Sauce", category: "Sea Food", price: 410, isVeg: false, spiceLevel: 2, tags: ["crab", "black bean", "seafood", "premium"] },
  { id: "sf3", name: "Wok Fried Squid In Chilli Black Bean Sauce", category: "Sea Food", price: 380, isVeg: false, spiceLevel: 3, tags: ["squid", "black bean", "seafood"] },
  { id: "sf4", name: "Chilli Plum Squid", category: "Sea Food", price: 390, isVeg: false, spiceLevel: 3, tags: ["squid", "plum", "sweet-spicy", "seafood"] },
  { id: "sf5", name: "Lobster in Sauce of Your Choice", category: "Sea Food", price: 1280, isVeg: false, spiceLevel: 3, tags: ["lobster", "premium", "luxury", "special occasion", "seafood"] },

  // RICE
  { id: "r1", name: "CHOWMAN's Special Rice", category: "Rice", price: 255, isVeg: false, spiceLevel: 2, tags: ["rice", "signature", "special", "must-try"] },
  { id: "r2", name: "Mixed Fried Rice", category: "Rice", price: 250, isVeg: false, spiceLevel: 2, tags: ["rice", "mixed", "non-veg"] },
  { id: "r3", name: "Fried Rice (Chicken)", category: "Rice", price: 180, isVeg: false, spiceLevel: 2, tags: ["rice", "chicken", "classic"] },
  { id: "r4", name: "Steamed Rice", category: "Rice", price: 120, isVeg: true, spiceLevel: 1, tags: ["rice", "plain", "light", "diet"] },
  { id: "r5", name: "Schezwan Fried Rice (Veg)", category: "Rice", price: 165, isVeg: true, spiceLevel: 4, tags: ["rice", "schezwan", "spicy", "veg"] },
  { id: "r6", name: "Schezwan Fried Rice (Chicken)", category: "Rice", price: 185, isVeg: false, spiceLevel: 4, tags: ["rice", "schezwan", "spicy", "chicken"] },
  { id: "r7", name: "Chilli Garlic Rice (Veg)", category: "Rice", price: 165, isVeg: true, spiceLevel: 3, tags: ["rice", "garlic", "spicy", "veg"] },
  { id: "r8", name: "Shanghai Fried Rice (Veg)", category: "Rice", price: 175, isVeg: true, spiceLevel: 2, tags: ["rice", "shanghai", "veg"] },
  { id: "r9", name: "Sea Food Fried Rice", category: "Rice", price: 250, isVeg: false, spiceLevel: 2, tags: ["rice", "seafood", "premium"] },
  { id: "r10", name: "Crab Meat Rice", category: "Rice", price: 250, isVeg: false, spiceLevel: 1, tags: ["rice", "crab", "premium", "seafood"] },
  { id: "r11", name: "Roasted Lamb Rice", category: "Rice", price: 210, isVeg: false, spiceLevel: 2, tags: ["rice", "lamb", "roasted"] },
  { id: "r12", name: "Egg White Fried Rice", category: "Rice", price: 185, isVeg: false, spiceLevel: 1, tags: ["rice", "egg", "light", "healthy"] },

  // NOODLES
  { id: "n1", name: "Wok Tossed Hakka Noodles (Veg)", category: "Noodles", price: 160, isVeg: true, spiceLevel: 2, tags: ["noodles", "hakka", "classic", "veg"] },
  { id: "n2", name: "Wok Tossed Hakka Noodles (Chicken)", category: "Noodles", price: 175, isVeg: false, spiceLevel: 2, tags: ["noodles", "hakka", "classic", "chicken"] },
  { id: "n3", name: "Chilli Garlic Noodles (Veg)", category: "Noodles", price: 165, isVeg: true, spiceLevel: 3, tags: ["noodles", "garlic", "spicy", "veg"] },
  { id: "n4", name: "Schezwan Hakka Noodles (Veg)", category: "Noodles", price: 165, isVeg: true, spiceLevel: 4, tags: ["noodles", "schezwan", "spicy", "veg"] },
  { id: "n5", name: "Singapore Noodles (Veg)", category: "Noodles", price: 165, isVeg: true, spiceLevel: 3, tags: ["noodles", "singapore", "spicy", "veg"] },
  { id: "n6", name: "CHOWMAN's Special Noodles", category: "Noodles", price: 240, isVeg: false, spiceLevel: 3, tags: ["noodles", "signature", "special", "must-try"] },
  { id: "n7", name: "Cantonese Noodles (Veg)", category: "Noodles", price: 170, isVeg: true, spiceLevel: 2, tags: ["noodles", "cantonese", "gravy", "veg"] },
  { id: "n8", name: "Stir Fried Sea Food Noodles", category: "Noodles", price: 240, isVeg: false, spiceLevel: 2, tags: ["noodles", "seafood", "premium"] },
  { id: "n9", name: "Braised Noodles With Bell Pepper, Black Mushroom & Spring Onion", category: "Noodles", price: 270, isVeg: true, spiceLevel: 2, tags: ["noodles", "braised", "mushroom", "veg", "premium"] },
  { id: "n10", name: "Stir Fried Cheesy Noodles With Exotic Veg", category: "Noodles", price: 270, isVeg: true, spiceLevel: 2, tags: ["noodles", "cheese", "indulgent", "veg"] },

  // MEIFOON (Rice Noodles)
  { id: "mf1", name: "Meifoon (Veg)", category: "Meifoon", price: 190, isVeg: true, spiceLevel: 2, tags: ["rice noodles", "meifoon", "light", "veg"] },
  { id: "mf2", name: "Singapore Style Meifoon (Veg)", category: "Meifoon", price: 195, isVeg: true, spiceLevel: 3, tags: ["rice noodles", "singapore", "spicy", "veg"] },
  { id: "mf3", name: "Schezwan Style Meifoon (Chicken)", category: "Meifoon", price: 215, isVeg: false, spiceLevel: 4, tags: ["rice noodles", "schezwan", "spicy", "chicken"] },
  { id: "mf4", name: "Sea Food Meifoon", category: "Meifoon", price: 270, isVeg: false, spiceLevel: 2, tags: ["rice noodles", "seafood", "premium"] },

  // THAI
  { id: "th1", name: "Minced Chicken Hot Basil", category: "Thai", price: 300, isVeg: false, spiceLevel: 4, tags: ["thai", "basil", "chicken", "spicy", "authentic"] },
  { id: "th2", name: "Red Curry (Chicken)", category: "Thai", price: 290, isVeg: false, spiceLevel: 4, tags: ["thai", "curry", "chicken", "spicy", "coconut"] },
  { id: "th3", name: "Green Curry (Chicken)", category: "Thai", price: 290, isVeg: false, spiceLevel: 4, tags: ["thai", "curry", "chicken", "spicy", "coconut"] },
  { id: "th4", name: "Phad Thai - Rice Noodles (Veg)", category: "Thai", price: 195, isVeg: true, spiceLevel: 2, tags: ["thai", "pad thai", "noodles", "veg", "classic"] },
  { id: "th5", name: "Phad Thai - Rice Noodles (Prawn)", category: "Thai", price: 230, isVeg: false, spiceLevel: 2, tags: ["thai", "pad thai", "prawn", "seafood", "classic"] },
  { id: "th6", name: "Massaman Curry with Potato (Chicken)", category: "Thai", price: 290, isVeg: false, spiceLevel: 3, tags: ["thai", "curry", "chicken", "mild", "potato"] },
  { id: "th7", name: "Red Curry (Veg)", category: "Thai", price: 260, isVeg: true, spiceLevel: 4, tags: ["thai", "curry", "veg", "spicy", "coconut"] },
  { id: "th8", name: "Green Curry (Veg)", category: "Thai", price: 260, isVeg: true, spiceLevel: 4, tags: ["thai", "curry", "veg", "spicy", "coconut"] },
  { id: "th9", name: "Khao Phat - Thai Style Rice (Chicken)", category: "Thai", price: 205, isVeg: false, spiceLevel: 2, tags: ["thai", "rice", "chicken", "authentic"] },

  // CHOP SUEY
  { id: "cs1", name: "Veg American Chopsuey", category: "Chop Suey", price: 210, isVeg: true, spiceLevel: 2, tags: ["chopsuey", "crispy noodles", "sweet-tangy", "veg"] },
  { id: "cs2", name: "Non Veg American Chopsuey", category: "Chop Suey", price: 230, isVeg: false, spiceLevel: 2, tags: ["chopsuey", "crispy noodles", "sweet-tangy", "non-veg"] },
  { id: "cs3", name: "Sea Food Chopsuey (Chinese)", category: "Chop Suey", price: 270, isVeg: false, spiceLevel: 2, tags: ["chopsuey", "seafood", "premium"] },

  // DESSERTS
  { id: "d1", name: "Lychee Toffee with Ice-Cream", category: "Dessert", price: 200, isVeg: true, spiceLevel: 1, tags: ["dessert", "lychee", "sweet", "ice cream", "indulgent"] },
  { id: "d2", name: "Toffee Walnut with Ice-Cream", category: "Dessert", price: 200, isVeg: true, spiceLevel: 1, tags: ["dessert", "walnut", "sweet", "ice cream", "indulgent"] },
  { id: "d3", name: "Date Pancake", category: "Dessert", price: 185, isVeg: true, spiceLevel: 1, tags: ["dessert", "pancake", "date", "sweet"] },
  { id: "d4", name: "Brownie with Hot Chocolate Sauce", category: "Dessert", price: 215, isVeg: true, spiceLevel: 1, tags: ["dessert", "brownie", "chocolate", "indulgent", "warm"] },
  { id: "d5", name: "Nutty Crunch", category: "Dessert", price: 225, isVeg: true, spiceLevel: 1, tags: ["dessert", "nuts", "crunchy", "sweet", "indulgent"] },

  // BEVERAGES
  { id: "bv1", name: "Packaged Drinking Water", category: "Beverages", price: 50, isVeg: true, spiceLevel: 1, tags: ["water", "beverage"] },
  { id: "bv2", name: "Aerated Water (Cola/Lemon/Orange)", category: "Beverages", price: 70, isVeg: true, spiceLevel: 1, tags: ["soft drink", "cola", "beverage"] },
  { id: "bv3", name: "Fresh Lime Soda", category: "Beverages", price: 90, isVeg: true, spiceLevel: 1, tags: ["lime soda", "fresh", "refreshing", "beverage"] },
  { id: "bv4", name: "Juice (Mango/Pineapple/Orange)", category: "Beverages", price: 95, isVeg: true, spiceLevel: 1, tags: ["juice", "fresh", "refreshing", "beverage"] },
  { id: "bv5", name: "Cola Float", category: "Beverages", price: 130, isVeg: true, spiceLevel: 1, tags: ["float", "ice cream", "indulgent", "beverage"] },
];

// ─── Per-category nutrition estimates (per serving) ───────────────────────
export const CATEGORY_NUTRITION: Record<string, { calories: number; fatG: number }> = {
  Soup:        { calories: 120, fatG: 4  },
  Starter:     { calories: 275, fatG: 14 },
  Vegetables:  { calories: 185, fatG: 8  },
  Chicken:     { calories: 320, fatG: 15 },
  Prawns:      { calories: 270, fatG: 9  },
  Fish:        { calories: 245, fatG: 10 },
  Pork:        { calories: 380, fatG: 22 },
  Lamb:        { calories: 360, fatG: 20 },
  "Sea Food":  { calories: 290, fatG: 12 },
  Rice:        { calories: 300, fatG: 7  },
  Noodles:     { calories: 320, fatG: 10 },
  Meifoon:     { calories: 280, fatG: 8  },
  Thai:        { calories: 340, fatG: 15 },
  "Chop Suey": { calories: 420, fatG: 18 },
  Dessert:     { calories: 380, fatG: 18 },
  Beverages:   { calories: 80,  fatG: 0  },
};

// ─── Food category images (Unsplash) ────────────────────────────────────────
// Multiple images per category — dish ID hash selects one for visual variety
export const CATEGORY_IMAGES: Record<string, string[]> = {
  Soup: [
    "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1533622597524-a1215e26c0a2?w=400&h=300&fit=crop&q=80",
  ],
  Starter: [
    "https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop&q=80",
  ],
  Vegetables: [
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&q=80",
  ],
  Chicken: [
    "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop&q=80",
  ],
  Prawns: [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&q=80",
  ],
  Fish: [
    "https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1615361200141-f45040f367be?w=400&h=300&fit=crop&q=80",
  ],
  Pork: [
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1607116667981-ff648b3eca84?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop&q=80",
  ],
  Lamb: [
    "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop&q=80",
  ],
  "Sea Food": [
    "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop&q=80",
  ],
  Rice: [
    "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1626804475297-41608ea07aef?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&h=300&fit=crop&q=80",
  ],
  Noodles: [
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1617196034094-43aeca5b1f69?w=400&h=300&fit=crop&q=80",
  ],
  Meifoon: [
    "https://images.unsplash.com/photo-1617196034094-43aeca5b1f69?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=300&fit=crop&q=80",
  ],
  Thai: [
    "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop&q=80",
  ],
  "Chop Suey": [
    "https://images.unsplash.com/photo-1525755662778-989d0fc81291?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&h=300&fit=crop&q=80",
  ],
  Dessert: [
    "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop&q=80",
  ],
  Beverages: [
    "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=300&fit=crop&q=80",
  ],
};

// ─── Key ingredients per menu item ──────────────────────────────────────────
export const INGREDIENTS_MAP: Record<string, string[]> = {
  // Soups
  s1:  ["Sweet corn", "Vegetable broth", "Cornstarch", "Spring onions", "White pepper"],
  s2:  ["Clear vegetable broth", "Ginger", "Garlic", "Spring onions", "Seasonal vegetables"],
  s4:  ["Vegetable broth", "Vinegar", "Green chillies", "Tofu", "Mushrooms", "Soy sauce", "Cornstarch"],
  s5:  ["Vegetable broth", "Crispy fried noodles", "Green chillies", "Mushrooms", "Soy sauce"],
  s8:  ["Chicken", "Sweet corn", "Broth", "Egg white", "Cornstarch", "Spring onions"],
  s9:  ["Chicken", "Broth", "Vinegar", "Green chillies", "Mushrooms", "Soy sauce", "Cornstarch"],
  s11: ["Chicken", "Lemongrass", "Galangal", "Kaffir lime leaves", "Fish sauce", "Mushrooms", "Thai chillies"],
  s12: ["Prawns", "Lemongrass", "Galangal", "Kaffir lime leaves", "Fish sauce", "Chillies", "Coconut milk"],
  // Starters
  st2:  ["Paneer", "Bell peppers", "Onions", "Green chillies", "Soy sauce", "Tomato sauce", "Ginger-garlic paste"],
  st9:  ["Mixed vegetables", "Cabbage", "Carrots", "Dough wrappers", "Ginger", "Garlic", "Green chillies"],
  st13: ["Chicken mince", "Wonton wrappers", "Ginger", "Garlic", "Spring onions", "Soy sauce"],
  st14: ["Chicken strips", "Spring roll pastry", "Cabbage", "Carrots", "Noodles", "Soy sauce"],
  st19: ["Sliced chicken breast", "Schezwan sauce", "Bell peppers", "Spring onions", "Garlic", "Chilli oil", "Soy sauce"],
  st22: ["Chicken mince", "Momo dough", "Ginger", "Garlic", "Spring onions", "Green chillies"],
  st23: ["Chicken wings", "Seasoned flour batter", "Soy sauce", "Garlic", "Ginger", "Chilli flakes"],
  st24: ["Chicken drumettes", "Spiced batter", "Schezwan sauce", "Garlic", "Ginger", "Spring onions"],
  st25: ["Chicken drumettes", "Schezwan sauce", "Crispy batter", "Chilli flakes", "Spring onions", "Garlic"],
  st27: ["Chicken", "Crispy seasoned batter", "Black pepper", "Salt", "Garlic", "Green chillies", "Spring onions"],
  st28: ["Chicken", "Crushed black pepper", "Garlic", "Butter", "Spring onions", "Soy sauce"],
  st31: ["Pork spare ribs", "Honey glaze", "Soy sauce", "Ginger", "Garlic", "Five spice powder"],
  // Vegetables
  v2:  ["Mixed vegetables", "Schezwan paste", "Bell peppers", "Spring onions", "Chilli oil", "Garlic", "Ginger"],
  v8:  ["Paneer", "Hunan chilli sauce", "Red chillies", "Bell peppers", "Garlic", "Ginger", "Spring onions"],
  v9:  ["Paneer", "Garlic", "Spring onions", "Light soy sauce", "White pepper", "Sesame oil"],
  v11: ["Mixed vegetables", "Devil's hot sauce", "Bird's eye chillies", "Garlic", "Spring onions"],
  // Chicken mains
  c1:  ["Chicken", "Hot garlic sauce", "Garlic cloves", "Chillies", "Spring onions", "Soy sauce"],
  c2:  ["Chicken", "Bell peppers", "Onions", "Green chillies", "Soy sauce", "Ginger-garlic", "Spring onions"],
  c3:  ["Chicken", "Manchurian sauce", "Garlic", "Ginger", "Spring onions", "Soy sauce", "Tomato sauce"],
  c9:  ["Chicken", "Schezwan sauce", "Bell peppers", "Chilli oil", "Garlic", "Spring onions", "Sichuan pepper"],
  c11: ["Chicken", "Kung Pao sauce", "Roasted peanuts", "Dried red chillies", "Sichuan peppercorn", "Spring onions"],
  c15: ["Chicken", "Chowman's secret sauce blend", "Mixed vegetables", "Spring onions", "Special spices"],
  c16: ["Chicken", "Devil's fiery sauce", "Ghost chillies", "Habanero", "Garlic", "Spring onions"],
  c18: ["Chicken", "Hunan sauce", "Shiitake mushrooms", "Bell peppers", "Garlic", "Ginger", "Spring onions"],
  c20: ["Chicken", "General Tao sauce", "Dried chillies", "Ginger", "Garlic", "Sesame seeds", "Spring onions"],
  // Prawns
  p1:  ["Prawns", "Schezwan sauce", "Bell peppers", "Chilli oil", "Garlic", "Spring onions"],
  p2:  ["Prawns", "Green chillies", "Bell peppers", "Soy sauce", "Ginger-garlic paste", "Spring onions"],
  p7:  ["Prawns", "Kung Pao sauce", "Roasted peanuts", "Dried chillies", "Sichuan peppercorn"],
  p10: ["Prawns", "Butter", "Garlic", "Spring onions", "White wine", "Parsley"],
  // Rice
  r3:  ["Long grain rice", "Chicken", "Egg", "Spring onions", "Soy sauce", "Garlic", "Ginger"],
  r4:  ["Long grain Basmati rice", "Water", "Salt"],
  r5:  ["Basmati rice", "Schezwan sauce", "Mixed vegetables", "Chilli flakes", "Spring onions"],
  r6:  ["Basmati rice", "Chicken", "Schezwan sauce", "Spring onions", "Egg", "Chilli flakes"],
  // Noodles
  n1:  ["Hakka noodles", "Mixed vegetables", "Soy sauce", "Spring onions", "Garlic", "Ginger", "Sesame oil"],
  n2:  ["Hakka noodles", "Chicken", "Mixed vegetables", "Soy sauce", "Spring onions", "Garlic"],
  n3:  ["Hakka noodles", "Garlic", "Red chillies", "Spring onions", "Dark soy sauce", "Chilli oil"],
  n4:  ["Hakka noodles", "Schezwan sauce", "Mixed vegetables", "Spring onions", "Chilli flakes", "Garlic"],
  // Thai
  th1: ["Minced chicken", "Thai basil", "Garlic", "Bird's eye chillies", "Fish sauce", "Oyster sauce"],
  th2: ["Chicken", "Red curry paste", "Coconut milk", "Thai basil", "Kaffir lime leaves", "Fish sauce", "Galangal"],
  th3: ["Chicken", "Green curry paste", "Coconut milk", "Thai basil", "Kaffir lime leaves", "Fish sauce"],
  th4: ["Rice noodles", "Eggs", "Bean sprouts", "Roasted peanuts", "Tamarind paste", "Spring onions", "Lime"],
  th6: ["Chicken", "Massaman curry paste", "Potato", "Coconut milk", "Peanuts", "Cardamom", "Cinnamon"],
  // Desserts
  d1:  ["Lychee", "Toffee sauce", "Vanilla ice cream", "Caramel glaze"],
  d4:  ["Dark chocolate brownie", "Hot chocolate fudge sauce", "Vanilla ice cream"],
  d5:  ["Mixed nuts", "Caramel coating", "Sesame", "Honey"],
};

export function searchMenuItems(query: string): MenuItem[] {
  const q = query.toLowerCase();
  return menuItems.filter(item =>
    item.name.toLowerCase().includes(q) ||
    item.category.toLowerCase().includes(q) ||
    item.tags.some(tag => tag.includes(q))
  );
}

export function getMenuByCategory(): Record<string, MenuItem[]> {
  return menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);
}
