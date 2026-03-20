const menu = [
  // ── Burgers ────────────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, pickles & our secret sauce',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
    category: 'Burgers',
    featured: true,
    badge: 'Best Seller',
  },
  {
    id: 2,
    name: 'Double Smash Burger',
    description: 'Two smashed patties, melted American cheese, caramelised onions & mustard',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&q=80',
    category: 'Burgers',
    featured: false,
    badge: null,
  },
  {
    id: 3,
    name: 'BBQ Bacon Burger',
    description: 'Smoky BBQ sauce, crispy bacon, aged cheddar & pickled jalapeños',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&q=80',
    category: 'Burgers',
    featured: false,
    badge: 'Spicy',
  },

  // ── Pizza ──────────────────────────────────────────────────────────────────
  {
    id: 4,
    name: 'Margherita Pizza',
    description: 'San Marzano tomato, fresh buffalo mozzarella, torn basil & extra virgin olive oil',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80',
    category: 'Pizza',
    featured: true,
    badge: 'Chef\'s Pick',
  },
  {
    id: 5,
    name: 'Pepperoni Pizza',
    description: 'Loaded double pepperoni, stretchy mozzarella & rich tomato sauce on a crispy crust',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80',
    category: 'Pizza',
    featured: false,
    badge: 'Popular',
  },

  // ── Sides & Drinks ─────────────────────────────────────────────────────────
  {
    id: 6,
    name: 'Crispy Fries',
    description: 'Golden shoestring fries seasoned with sea salt, rosemary & garlic',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80',
    category: 'Sides & Drinks',
    featured: false,
    badge: null,
  },
  {
    id: 7,
    name: 'Onion Rings',
    description: 'Beer-battered thick-cut onion rings, served with smoky chipotle dip',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&q=80',
    category: 'Sides & Drinks',
    featured: false,
    badge: null,
  },
  {
    id: 8,
    name: 'Chocolate Shake',
    description: 'Thick Belgian chocolate milkshake topped with whipped cream & chocolate drizzle',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1572490122747-3e9e3a5f7c14?w=600&q=80',
    category: 'Sides & Drinks',
    featured: false,
    badge: 'Fan Fave',
  },
];

module.exports = menu;
