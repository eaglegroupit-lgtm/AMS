import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Amutha Surabi Database...');

  // 1. Create Default Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@amuthasurabi.com' },
    update: {},
    create: {
      name: 'Admin Manager',
      email: 'admin@amuthasurabi.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user created:', admin.email);

  // 2. Create Restaurant Settings
  const settings = await prisma.restaurantSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'Amutha Surabi Restaurant',
      nameTa: 'அமுதா சுரபி உணவகம்',
      address: '123 Temple Ring Road, Madurai, Tamil Nadu 625001',
      addressTa: '123 கோவில் ரிங் ரோடு, மதுரை, தமிழ்நாடு 625001',
      phone: '+91 98765 43210',
      whatsapp: '+91 98765 43210',
      email: 'info@amuthasurabi.com',
      openingHours: 'Mon - Sun: 7:00 AM - 11:00 PM',
      openingHoursTa: 'திங்கள் - ஞாயிறு: காலை 7:00 - இரவு 11:00',
      gstNumber: '33AAAAA0000A1Z5',
      logoUrl: '/logo.png',
      socialLinks: JSON.stringify({
        facebook: 'https://facebook.com/amuthasurabi',
        instagram: 'https://instagram.com/amuthasurabi',
        twitter: 'https://twitter.com/amuthasurabi',
      }),
    },
  });
  console.log('Settings created');

  // 3. Create Categories
  const categoriesData = [
    { name: 'Breakfast', nameTa: 'காலை உணவு', slug: 'breakfast', sortOrder: 1 },
    { name: 'Lunch', nameTa: 'மதிய உணவு', slug: 'lunch', sortOrder: 2 },
    { name: 'Dinner', nameTa: 'இரவு உணவு', slug: 'dinner', sortOrder: 3 },
    { name: 'Snacks', nameTa: 'சிற்றுண்டி', slug: 'snacks', sortOrder: 4 },
    { name: 'Juices', nameTa: 'பழச்சாறுகள்', slug: 'juices', sortOrder: 5 },
    { name: 'Tea', nameTa: 'தேநீர்', slug: 'tea', sortOrder: 6 },
    { name: 'Coffee', nameTa: 'காபி', slug: 'coffee', sortOrder: 7 },
    { name: 'Desserts', nameTa: 'இனிப்புகள்', slug: 'desserts', sortOrder: 8 },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, nameTa: cat.nameTa, sortOrder: cat.sortOrder },
      create: cat,
    });
    categoryMap[cat.slug] = createdCat.id;
  }
  console.log('Categories created');

  // 4. Create South Indian Dishes
  const foodsData = [
    // Breakfast
    {
      name: 'Special Ghee Roast Dosa',
      nameTa: 'ஸ்பெஷல் நெய் ரோஸ்ட் தோசை',
      description: 'Crispy golden crepe smeared with aromatic pure desi ghee, served with 3 types of chutney & sambar.',
      descriptionTa: 'மணமணக்கும் சுத்தமான நெய்யில் சுடப்பட்ட மெல்லிய தோசை, சாம்பார் மற்றும் 3 வகை சட்னியுடன்.',
      price: 110,
      discount: 0,
      gst: 5,
      isVeg: true,
      spicyLevel: 1,
      prepTimeMinutes: 10,
      isFeatured: true,
      isTodaySpecial: true,
      isAvailable: true,
      categoryId: categoryMap['breakfast'],
      imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Malli Poo Idli (3 Pcs)',
      nameTa: 'மல்லிப்பூ இட்லி (3 எண்ணம்)',
      description: 'Ultra soft steamed rice cakes cooked to perfection, paired with coconut chutney and hot drumstick sambar.',
      descriptionTa: 'பஞ்சி போன்ற மென்மையான இட்லி, தேங்காய் சட்னி மற்றும் காரசாரமான முருங்கைக்காய் சாம்பாருடன்.',
      price: 60,
      discount: 0,
      gst: 5,
      isVeg: true,
      spicyLevel: 1,
      prepTimeMinutes: 8,
      isFeatured: true,
      isTodaySpecial: false,
      isAvailable: true,
      categoryId: categoryMap['breakfast'],
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Crispy Medu Vada (2 Pcs)',
      nameTa: 'மெது வடை (2 எண்ணம்)',
      description: 'Traditional deep-fried lentil donuts flavored with crushed pepper, ginger, and curry leaves.',
      descriptionTa: 'மிளகு, இஞ்சி, கறிவேப்பிலை மணத்துடன் மொறுமொறுப்பான சுவையான உளுந்து வடை.',
      price: 50,
      discount: 0,
      gst: 5,
      isVeg: true,
      spicyLevel: 2,
      prepTimeMinutes: 5,
      isFeatured: false,
      isTodaySpecial: false,
      isAvailable: true,
      categoryId: categoryMap['breakfast'],
      imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Rava Onion Masala Dosa',
      nameTa: 'ரவா வெங்காய மசாலா தோசை',
      description: 'Thin crispy semolina crepe loaded with finely chopped onions, green chilies, and potato masala filling.',
      descriptionTa: 'வெங்காயம் மற்றும் உருளைக்கிழங்கு மசாலா நிரப்பப்பட்ட மொறுமொறுப்பான ரவா தோசை.',
      price: 130,
      discount: 10,
      gst: 5,
      isVeg: true,
      spicyLevel: 2,
      prepTimeMinutes: 12,
      isFeatured: true,
      isTodaySpecial: false,
      isAvailable: true,
      categoryId: categoryMap['breakfast'],
      imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Ven Pongal with Ghee & Cashews',
      nameTa: 'நெய் முந்திரி வெண் பொங்கல்',
      description: 'Traditional creamy rice and moong dal mash tempered with pepper, cumin, ginger, and ghee-roasted cashews.',
      descriptionTa: 'சீரகம், மிளகு, நெய் மற்றும் முந்திரி தாளித்த பாரம்பரிய வெண் பொங்கல்.',
      price: 85,
      discount: 0,
      gst: 5,
      isVeg: true,
      spicyLevel: 1,
      prepTimeMinutes: 10,
      isFeatured: false,
      isTodaySpecial: true,
      isAvailable: true,
      categoryId: categoryMap['breakfast'],
      imageUrl: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&auto=format&fit=crop&q=80',
    },

    // Lunch
    {
      name: 'Grand South Indian Meals Thali',
      nameTa: 'கிராண்ட் தென்னிந்திய சாப்பாடு',
      description: 'Authentic banana leaf feast: Ponni rice, Sambar, Rasam, Kara Kuzhambu, Poriyal, Kootu, Appalam, Curd, & Payasam.',
      descriptionTa: 'பொன்னி அரிசி சாதம், சாம்பார், ரசம், காரக்குழம்பு, பொரியல், கூட்டு, அப்பளம், தயிர் மற்றும் பாயாசம் அடங்கிய முழு விருந்து.',
      price: 180,
      discount: 0,
      gst: 5,
      isVeg: true,
      spicyLevel: 2,
      prepTimeMinutes: 10,
      isFeatured: true,
      isTodaySpecial: true,
      isAvailable: true,
      categoryId: categoryMap['lunch'],
      imageUrl: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Chettinad Chicken Biryani',
      nameTa: 'செட்டிநாடு சிக்கன் பிரியாணி',
      description: 'Aromatic Seeraga Samba rice cooked with tender chicken and authentic Karaikudi freshly ground spices.',
      descriptionTa: 'சீரக சம்பா அரிசியில் காரைக்குடி நறுமண மசாலாக்களுடன் சமைக்கப்பட்ட காரசாரமான பிரியாணி.',
      price: 240,
      discount: 0,
      gst: 5,
      isVeg: false,
      spicyLevel: 4,
      prepTimeMinutes: 15,
      isFeatured: true,
      isTodaySpecial: true,
      isAvailable: true,
      categoryId: categoryMap['lunch'],
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Mutton Chukka Meals',
      nameTa: 'மட்டன் சுக்கா மதிய உணவு',
      description: 'Fiery dry-roasted spicy mutton chunks served alongside rice, mutton gravy, rasam, and buttermilk.',
      descriptionTa: 'மிளகு மற்றும் மசாலா வறுவலில் வெந்த மட்டன் சுக்கா மற்றும் சுடசுட சாதம், மட்டன் குழம்பு.',
      price: 320,
      discount: 0,
      gst: 5,
      isVeg: false,
      spicyLevel: 4,
      prepTimeMinutes: 20,
      isFeatured: true,
      isTodaySpecial: false,
      isAvailable: true,
      categoryId: categoryMap['lunch'],
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
    },

    // Dinner
    {
      name: 'Madurai Bun Parotta (2 Pcs)',
      nameTa: 'மதுரை பன் பரோட்டா (2 எண்ணம்)',
      description: 'Famous layered fluffy bun parottas served with rich spicy salna gravy.',
      descriptionTa: 'மதுரையின் புகழ்பெற்ற மிருதுவான பன் பரோட்டா மற்றும் சுவையான சால்னா குழம்பு.',
      price: 90,
      discount: 0,
      gst: 5,
      isVeg: true,
      spicyLevel: 3,
      prepTimeMinutes: 12,
      isFeatured: true,
      isTodaySpecial: false,
      isAvailable: true,
      categoryId: categoryMap['dinner'],
      imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Chicken Kothu Parotta',
      nameTa: 'சிக்கன் கொத்து பரோட்டா',
      description: 'Shredded parotta scrambled on a hot iron griddle with cooked chicken, eggs, onions, and curry sauce.',
      descriptionTa: 'கல் பரோட்டாவில் சிக்கன், முட்டை மற்றும் மசாலா கலந்து தயார் செய்யப்பட்ட மொறுமொறு கொத்து பரோட்டா.',
      price: 190,
      discount: 0,
      gst: 5,
      isVeg: false,
      spicyLevel: 3,
      prepTimeMinutes: 15,
      isFeatured: true,
      isTodaySpecial: true,
      isAvailable: true,
      categoryId: categoryMap['dinner'],
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    },

    // Coffee & Tea
    {
      name: ' Kumbakonam Degree Coffee',
      nameTa: 'கும்பகோணம் டிகிரி காபி',
      description: 'Authentic chicory-infused South Indian filter coffee frothed in traditional brass davarah-tumbler.',
      descriptionTa: 'பித்தளை டவரா டம்ளரில் நுரை ததும்ப வழங்கும் அசலான கும்பகோணம் டிகிரி பில்டர் காபி.',
      price: 35,
      discount: 0,
      gst: 5,
      isVeg: true,
      spicyLevel: 1,
      prepTimeMinutes: 5,
      isFeatured: true,
      isTodaySpecial: false,
      isAvailable: true,
      categoryId: categoryMap['coffee'],
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Masala Ginger Tea',
      nameTa: 'மசாலா இஞ்சி டீ',
      description: 'Strong tea brewed with fresh ginger, cardamom, and aromatic spices.',
      descriptionTa: 'புதிய இஞ்சி மற்றும் ஏலக்காய் மணத்துடன் சுடச்சுட மசாலா தேநீர்.',
      price: 25,
      discount: 0,
      gst: 5,
      isVeg: true,
      spicyLevel: 1,
      prepTimeMinutes: 5,
      isFeatured: false,
      isTodaySpecial: false,
      isAvailable: true,
      categoryId: categoryMap['tea'],
      imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
    },

    // Desserts & Juices
    {
      name: 'Madurai Famous Jigarthanda',
      nameTa: 'மதுரை ஜிகர்தண்டா',
      description: 'Refreshing summer dessert drink made with almond gum (badam pisin), nannari syrup, milk, and basundi ice cream.',
      descriptionTa: 'பாதாம் பிசின், நன்னாரி சர்பத், கெட்டிப் பால் மற்றும் பாசுந்தி ஐஸ்கிரீம் சேர்ந்த புகழ்பெற்ற ஜிகர்தண்டா.',
      price: 95,
      discount: 0,
      gst: 5,
      isVeg: true,
      spicyLevel: 1,
      prepTimeMinutes: 5,
      isFeatured: true,
      isTodaySpecial: true,
      isAvailable: true,
      categoryId: categoryMap['desserts'],
      imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Fresh Nannari Sarbath',
      nameTa: 'நன்னாரி சர்பத்',
      description: 'Chilled herbal cooling drink flavoured with natural sarsaparilla root extract and fresh lemon juice.',
      descriptionTa: 'இயற்கையான நன்னாரி வேர் மற்றும் எலுமிச்சை சாறு சேர்த்த உடலுக்கு குளிர்ச்சி தரும் சர்பத்.',
      price: 45,
      discount: 0,
      gst: 5,
      isVeg: true,
      spicyLevel: 1,
      prepTimeMinutes: 3,
      isFeatured: false,
      isTodaySpecial: false,
      isAvailable: true,
      categoryId: categoryMap['juices'],
      imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&auto=format&fit=crop&q=80',
    },
  ];

  for (const item of foodsData) {
    const { imageUrl, ...foodFields } = item;
    const existing = await prisma.food.findFirst({
      where: { name: foodFields.name },
    });

    if (!existing) {
      const food = await prisma.food.create({
        data: {
          ...foodFields,
          images: {
            create: [
              {
                url: imageUrl,
                isPrimary: true,
              },
            ],
          },
        },
      });
      console.log('Created food item:', food.name);
    }
  }

  // 5. Create Banners
  const banners = [
    {
      title: 'Authentic South Indian Flavors',
      titleTa: 'அசலான தென்னிந்திய சுவை மற்றும் பாரம்பரியம்',
      subtitle: 'Experience the rich heritage of Chettinad and Madurai cuisine cooked with fresh spices and pure ghee.',
      subtitleTa: 'சுத்தமான நெய் மற்றும் நறுமண மசாலாக்களுடன் சமைக்கப்பட்ட பாரம்பரிய உணவு வகைகளை சுவையுங்கள்.',
      imageUrl: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=1600&auto=format&fit=crop&q=80',
      type: 'SLIDER' as const,
      autoSlide: true,
    },
    {
      title: 'Sunday Chettinad Special Feast',
      titleTa: 'ஞாயிறு செட்டிநாடு சிறப்பு சாப்பாடு',
      subtitle: 'Unlimited banana leaf thali with free Jigarthanda on every mega order!',
      subtitleTa: 'வாழை இலை சாப்பாடு மற்றும் மெகா ஆர்டருக்கு இலவச ஜிகர்தண்டா!',
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1600&auto=format&fit=crop&q=80',
      type: 'OFFER' as const,
      autoSlide: true,
    },
  ];

  for (const b of banners) {
    const existingBanner = await prisma.banner.findFirst({ where: { title: b.title } });
    if (!existingBanner) {
      await prisma.banner.create({ data: b });
    }
  }
  console.log('Banners created');

  // 6. Create Reviews
  const reviews = [
    {
      name: 'Sundar Raman',
      rating: 5,
      comment: 'Best Ghee Roast Dosa and Kumbakonam Filter Coffee in town! Tastes just like home.',
      isApproved: true,
    },
    {
      name: 'Kavitha Murugan',
      rating: 5,
      comment: 'The Chettinad Biryani and Madurai Jigarthanda were top notch. Outstanding ambiance and polite staff!',
      isApproved: true,
    },
    {
      name: 'Anand Kumar',
      rating: 5,
      comment: 'Super soft Malli Poo Idly and hot Sambar. Highly recommended for authentic South Indian breakfast.',
      isApproved: true,
    },
  ];

  for (const r of reviews) {
    const existingR = await prisma.review.findFirst({ where: { name: r.name } });
    if (!existingR) {
      await prisma.review.create({ data: r });
    }
  }
  console.log('Reviews created');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
