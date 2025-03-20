// iconMappings.js
export const iconMappings = {
    // Store Categories
    categories: {
      Restaurant: "silverware-fork-knife",
      Groceries: "cart-outline",
      Pharmacy: "pill",
      Market: "storefront-outline",
      Mall: "shopping-outline",
      "Fast Food": "hamburger",
      // Add more categories as they come
      Default: "store", // Fallback for unrecognized categories
    },
  
    // Product Subcategories
    subcategories: {
      soups: "pot-steam",
      sides: "silverware-fork-knife",
      drinks: "glass-mug",
      base_options: "pizza", // For pizza crusts
      toppings: "food-variant", // For pizza toppings
      medications: "pill",
      supplements: "pill",
      snacks: "food-croissant",
      extras: "cookie",
      protein: "food-steak",
      // Add more subcategories as they appear in data
      Default: "package-variant", // Fallback for unrecognized subcategories
    },
  };
  
  // Function to get icon by category or subcategory
  export const getIcon = (type, key) => {
    const mapping = iconMappings[type];
    return mapping[key] || mapping.Default;
  };