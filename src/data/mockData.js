export const mockUser = {
  id: "user-1",
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  phone: "+1 (555) 123-4567",
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  settings: {
    notifications: {
      email: true,
      inApp: true,
      whatsapp: false
    },
    darkMode: false
  }
}

export const mockMovingProject = {
  id: "project-1",
  name: "Downtown Apartment to Suburban House",
  moveDate: "2024-04-15",
  status: "planning",
  progress: 42,
  fromAddress: "123 Main St, Apt 4B, New York, NY 10001",
  toAddress: "456 Oak Avenue, Westfield, NJ 07090",
  apartmentType: "house",
  ownershipType: "owner",
  hasChildren: true,
  hasPets: false,
  budget: 5000,
  rooms: ["living_room", "kitchen", "bedroom_1", "bedroom_2", "bathroom"],
  collaborators: [
    { id: "collab-1", name: "Mike Johnson", email: "mike@email.com", role: "partner", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
    { id: "collab-2", name: "Emma Wilson", email: "emma@email.com", role: "helper", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" }
  ]
}

export const mockTimelineEvents = [
  { 
    id: "t1", 
    title: "Book moving company", 
    description: "Research and book a reliable moving company",
    daysFromMove: -56, 
    completed: true, 
    category: "logistics",
    priority: "high",
    estimatedTime: "2-3 hours"
  },
  { 
    id: "t2", 
    title: "Start decluttering", 
    description: "Go through belongings and decide what to keep, donate, or sell",
    daysFromMove: -49, 
    completed: true, 
    category: "preparation",
    priority: "medium",
    estimatedTime: "1 week"
  },
  { 
    id: "t3", 
    title: "Order packing supplies", 
    description: "Buy boxes, tape, bubble wrap, and labels",
    daysFromMove: -42, 
    completed: false, 
    category: "supplies",
    priority: "high",
    estimatedTime: "1 hour"
  },
  { 
    id: "t4", 
    title: "Notify utility companies", 
    description: "Schedule disconnection at old address and connection at new address",
    daysFromMove: -35, 
    completed: false, 
    category: "utilities",
    priority: "high",
    estimatedTime: "2 hours"
  },
  { 
    id: "t5", 
    title: "Change address with bank", 
    description: "Update address with banks, credit cards, and financial institutions",
    daysFromMove: -28, 
    completed: false, 
    category: "address_change",
    priority: "high",
    estimatedTime: "1 hour"
  },
  { 
    id: "t6", 
    title: "Schedule cable/internet setup", 
    description: "Arrange for internet and cable installation at new home",
    daysFromMove: -21, 
    completed: false, 
    category: "utilities",
    priority: "medium",
    estimatedTime: "30 minutes"
  },
  { 
    id: "t7", 
    title: "Pack non-essentials", 
    description: "Start packing items you won't need in the next 2 weeks",
    daysFromMove: -14, 
    completed: false, 
    category: "packing",
    priority: "medium",
    estimatedTime: "3-4 days"
  },
  { 
    id: "t8", 
    title: "Confirm moving day details", 
    description: "Call moving company to confirm time and details",
    daysFromMove: -7, 
    completed: false, 
    category: "logistics",
    priority: "high",
    estimatedTime: "15 minutes"
  },
  { 
    id: "t9", 
    title: "Pack essentials box", 
    description: "Pack a box with items you'll need immediately at new home",
    daysFromMove: -1, 
    completed: false, 
    category: "packing",
    priority: "high",
    estimatedTime: "1 hour"
  },
  { 
    id: "t10", 
    title: "Moving Day!", 
    description: "The big day has arrived - supervise the move and check inventory",
    daysFromMove: 0, 
    completed: false, 
    category: "moving_day",
    priority: "high",
    estimatedTime: "Full day"
  }
]

export const mockRooms = [
  { 
    id: "room-1", 
    name: "Living Room", 
    type: "living_room",
    items: ["Sofa", "Coffee Table", "TV Stand", "Bookshelf", "Side Tables", "Lamps"],
    boxes: 5,
    heavyItems: 2,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    packed: false
  },
  { 
    id: "room-2", 
    name: "Kitchen", 
    type: "kitchen",
    items: ["Refrigerator", "Microwave", "Dishes", "Cookware", "Small Appliances"],
    boxes: 8,
    heavyItems: 1,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    packed: false
  },
  { 
    id: "room-3", 
    name: "Master Bedroom", 
    type: "bedroom",
    items: ["King Bed", "Dresser", "Nightstands", "Clothes", "Decorations"],
    boxes: 6,
    heavyItems: 3,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    packed: false
  },
  { 
    id: "room-4", 
    name: "Home Office", 
    type: "office",
    items: ["Desk", "Office Chair", "Computer", "Books", "Filing Cabinet"],
    boxes: 4,
    heavyItems: 2,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    packed: false
  }
]

export const mockServices = [
  {
    id: "service-1",
    title: "Full Service Moving",
    description: "Complete white-glove moving service with professional packers",
    price: 2500,
    originalPrice: 3200,
    duration: "1-2 days",
    rating: 4.9,
    reviews: 234,
    features: [
      "Professional packing & unpacking",
      "All supplies included",
      "Loading & unloading",
      "Transportation & insurance",
      "Furniture assembly"
    ],
    popular: true,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
  },
  {
    id: "service-2",
    title: "Labor Only",
    description: "Professional movers for loading and unloading only",
    price: 800,
    originalPrice: 1000,
    duration: "4-6 hours",
    rating: 4.7,
    reviews: 156,
    features: [
      "Professional movers",
      "Loading & unloading",
      "Basic tools included",
      "Hourly rate",
      "Same-day availability"
    ],
    popular: false,
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop"
  },
  {
    id: "service-3",
    title: "Packing Service",
    description: "Expert packing of all household items with premium materials",
    price: 600,
    originalPrice: 750,
    duration: "1 day",
    rating: 4.8,
    reviews: 189,
    features: [
      "Professional packers",
      "Premium packing supplies",
      "Fragile item protection",
      "Detailed inventory list",
      "Custom crating available"
    ],
    popular: false,
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop"
  }
]

export const mockMovingTips = {
  room: [
    { 
      icon: "🛋️",
      title: "Living Room", 
      tip: "Wrap electronics in bubble wrap and keep original boxes when possible. Take photos of cable connections before disconnecting.",
      difficulty: "Easy"
    },
    { 
      icon: "🍳",
      title: "Kitchen", 
      tip: "Pack dishes vertically like records to prevent breaking. Use towels and linens as padding to save space.",
      difficulty: "Medium"
    },
    { 
      icon: "🛏️",
      title: "Bedroom", 
      tip: "Use vacuum bags for clothing to save 75% space. Keep one outfit accessible for moving day.",
      difficulty: "Easy"
    }
  ],
  item: [
    { 
      icon: "📦",
      title: "Fragile Items", 
      tip: "Use plenty of padding and mark boxes clearly as 'FRAGILE' on all sides. Pack heavier items on bottom.",
      difficulty: "Medium"
    },
    { 
      icon: "⚖️",
      title: "Heavy Items", 
      tip: "Use smaller boxes for heavy items to make them easier to carry. Limit weight to 50lbs per box.",
      difficulty: "Hard"
    },
    { 
      icon: "💎",
      title: "Valuables", 
      tip: "Keep important documents and valuables with you during the move. Consider a safety deposit box.",
      difficulty: "Easy"
    }
  ],
  personal: [
    { 
      icon: "📋",
      title: "Important Documents", 
      tip: "Keep birth certificates, passports, and insurance papers in a waterproof folder that travels with you.",
      difficulty: "Easy"
    },
    { 
      icon: "💊",
      title: "Medications", 
      tip: "Pack a separate bag with all necessary medications and keep it temperature controlled.",
      difficulty: "Easy"
    },
    { 
      icon: "🚨",
      title: "Emergency Kit", 
      tip: "Prepare a first-aid kit and emergency supplies for moving day including snacks and water.",
      difficulty: "Easy"
    }
  ]
}

export const addressSuggestions = [
  "123 Main Street, New York, NY 10001",
  "456 Oak Avenue, Los Angeles, CA 90210", 
  "789 Pine Road, Chicago, IL 60601",
  "321 Elm Drive, Houston, TX 77001",
  "654 Maple Lane, Phoenix, AZ 85001",
  "987 Cedar Court, Philadelphia, PA 19101",
  "147 Birch Boulevard, San Antonio, TX 78201",
  "258 Willow Way, San Diego, CA 92101"
]

export const weeklyChecklists = [
  {
    week: 8,
    title: "8 Weeks Before",
    subtitle: "Research & Planning",
    progress: 100,
    tasks: [
      { id: "w8-1", title: "Research moving companies", completed: true, priority: "high" },
      { id: "w8-2", title: "Get moving quotes", completed: true, priority: "high" },
      { id: "w8-3", title: "Create moving budget", completed: true, priority: "medium" },
      { id: "w8-4", title: "Start decluttering", completed: true, priority: "medium" }
    ]
  },
  {
    week: 7,
    title: "7 Weeks Before", 
    subtitle: "Book Services",
    progress: 75,
    tasks: [
      { id: "w7-1", title: "Book moving company", completed: true, priority: "high" },
      { id: "w7-2", title: "Order packing supplies", completed: true, priority: "high" },
      { id: "w7-3", title: "Notify landlord/real estate agent", completed: true, priority: "medium" },
      { id: "w7-4", title: "Research new neighborhood", completed: false, priority: "low" }
    ]
  },
  {
    week: 6,
    title: "6 Weeks Before",
    subtitle: "Preparation Phase",
    progress: 50,
    tasks: [
      { id: "w6-1", title: "Start using up frozen/perishable food", completed: true, priority: "medium" },
      { id: "w6-2", title: "Begin packing non-essentials", completed: true, priority: "medium" },
      { id: "w6-3", title: "Arrange time off work for moving day", completed: false, priority: "high" },
      { id: "w6-4", title: "Research schools in new area", completed: false, priority: "medium" }
    ]
  },
  {
    week: 5,
    title: "5 Weeks Before",
    subtitle: "Address Changes",
    progress: 25,
    tasks: [
      { id: "w5-1", title: "Submit change of address forms", completed: false, priority: "high" },
      { id: "w5-2", title: "Notify utility companies", completed: true, priority: "high" },
      { id: "w5-3", title: "Update address with bank and credit cards", completed: false, priority: "high" },
      { id: "w5-4", title: "Transfer prescriptions to new pharmacy", completed: false, priority: "medium" }
    ]
  }
]