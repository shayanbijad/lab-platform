import "dotenv/config";
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // LAB TESTS
  await prisma.labTest.createMany({
    data: [
      { name: 'CBC', code: 'CBC', price: 25, category: 'Hematology' },
      { name: 'Blood Glucose', code: 'GLU', price: 15, category: 'Biochemistry' },
    ],
    skipDuplicates: true,
  })

  // DOCTORS
  await prisma.doctor.createMany({
  data: [
    {
      name: "دکتر علی رضایی",
      Categories: "متخصص قلب",
      Experience: 12,
      Address: "تهران",
      image: "/images/doctors/01.jpg"
    },
    {
      name: "دکتر مریم صادقی",
      Categories: "متخصص مغز و اعصاب",
      Experience: 9,
      Address: "شیراز",
      image: "/images/doctors/02.jpg"
    },
    {
      name: "دکتر حمیدرضا مرادی",
      Categories: "متخصص ارتوپدی",
      Experience: 15,
      Address: "اصفهان",
      image: "/images/doctors/03.jpg"
    },
    {
      name: "دکتر سارا احمدی",
      Categories: "فوق تخصص گوارش",
      Experience: 7,
      Address: "تبریز",
      image: "/images/doctors/04.jpg"
    },
    {
      name: "دکتر محمد خسروی",
      Categories: "متخصص اطفال",
      Experience: 11,
      Address: "کرج",
      image: "/images/doctors/05.jpg"
    },
    {
      name: "دکتر نرگس شریعتی",
      Categories: "متخصص زنان و زایمان",
      Experience: 10,
      Address: "مشهد",
      image: "/images/doctors/06.jpg"
    },
    {
      name: "دکتر وحید عزیزی",
      Categories: "فوق تخصص روماتولوژی",
      Experience: 13,
      Address: "تهران",
      image: "/images/doctors/07.jpg"
    }
  ],
  skipDuplicates: true
});

  console.log('✅ Seeding complete.')
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })