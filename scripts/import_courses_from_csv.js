const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { parse } = require('csv-parse');

const prisma = new PrismaClient();
const csvPath = path.join(__dirname, '../processed_courses.csv');

async function main() {
  const file = fs.readFileSync(csvPath, 'utf8');
  const records = await new Promise((resolve, reject) => {
    parse(file, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      trim: true,
    }, (err, output) => {
      if (err) reject(err);
      else resolve(output);
    });
  });

  for (const rec of records) {
    try {
      await prisma.course.create({
        data: {
          course_id: rec.course_id || null,
          title: rec.title || null,
          platform: rec.platform || null,
          provider: rec.provider || null,
          description: rec.description || null,
          skills: rec.skills || null,
          level: rec.level || null,
          duration: rec.duration || null,
          rating: rec.rating && !isNaN(parseFloat(rec.rating)) ? parseFloat(rec.rating) : null,
          price: rec.price || null,
          language: rec.language || null,
          format: rec.format || null,
          start_date: rec.start_date ? new Date(rec.start_date) : null,
          url: rec.url || null,
          certificate_type: rec.certificate_type || null,
          extra: rec.extra || null,
        },
      });
    } catch (e) {
      console.error('Erreur insertion ligne:', rec, e.message);
    }
  }
  await prisma.$disconnect();
  console.log('Import terminé.');
}

main(); 