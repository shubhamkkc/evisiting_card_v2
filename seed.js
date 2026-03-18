const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const business = await prisma.business.upsert({
    where: { slug: 'kanhaiya-lal-and-sons' },
    update: {},
    create: {
      slug: 'kanhaiya-lal-and-sons',
      businessName: 'Kanhaiya Lal & Sons',
      ownerName: 'Mr. Kanhaiya Lal',
      designation: 'Founder & CEO',
      phone: '+919876543210',
      whatsapp: '919876543210',
      email: 'contact@kanhaiyalalandsons.com',
      website: 'www.kanhaiyalalandsons.com',
      address: 'Shop No. 5, Main Market, Delhi, India',
      category: 'Retail, Clothing',
      about: 'Kanhaiya Lal & Sons has been a trusted name in high-quality traditional clothing and modern apparel since 1990. We pride ourselves on offering the finest fabrics and a wide array of curated collections that bring a blend of cultural heritage and contemporary style.',
      theme: 'theme3',
      themeColor: '#4f46e5',
      socialLinks: JSON.stringify({
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        twitter: 'https://twitter.com'
      }),
      services: JSON.stringify([
        {
          title: 'Ethnic Wear',
          description: 'Premium collection of traditional Indian wear for all festive occasions.',
        },
        {
          title: 'Modern Apparel',
          description: 'Stylish and comfortable everyday clothing for men and women.',
        }
      ]),
      isActive: true,
    },
  })
  console.log('Seeded Business:', business)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
