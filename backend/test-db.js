require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')

const connectionString = process.env.DATABASE_URL

const adapter = new PrismaPg({ connectionString })

const prisma = new PrismaClient({ adapter })

async function main() {
  const doctors = await prisma.doctor.findMany()

  console.log("count:", doctors.length)
  console.log(doctors)
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
