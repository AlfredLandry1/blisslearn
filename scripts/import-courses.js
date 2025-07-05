const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const prisma = new PrismaClient();

// Configuration
const BATCH_SIZE = 100; // Taille de lot réduite pour éviter les timeouts
const CSV_FILE_PATH = path.join(__dirname, '..', 'processed_courses.csv');

// Mapping des colonnes CSV vers les champs de la base de données
const CSV_TO_DB_MAPPING = {
  course_id: 'course_id',
  title: 'title',
  link: 'url',
  platform: 'platform',
  institution: 'provider',
  instructor: 'extra',
  description: 'description',
  skills: 'skills',
  category: 'extra',
  level_normalized: 'level',
  duration_hours: 'duration',
  price_numeric: 'price',
  rating_numeric: 'rating',
  reviews_count_numeric: 'extra',
  enrolled_students: 'extra',
  course_type: 'certificate_type',
  mode: 'format',
  availability: 'extra',
  source_file: 'extra'
};

// Fonction pour nettoyer et valider les données
function cleanData(rawData) {
  const cleaned = {};
  const extraData = {};
  
  for (const [csvField, dbField] of Object.entries(CSV_TO_DB_MAPPING)) {
    let value = rawData[csvField];
    
    // Nettoyage des valeurs
    if (value !== undefined && value !== null && value !== '') {
      value = value.toString().trim();
      
      // Conversion des valeurs numériques
      if (csvField === 'rating_numeric') {
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 5) {
          value = numValue;
        } else {
          value = null;
        }
      } else if (csvField === 'price_numeric') {
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue >= 0) {
          value = numValue.toString();
        } else {
          value = '0'; // Gratuit si pas de prix
        }
      }
      
      // Conversion de la durée
      if (csvField === 'duration_hours') {
        const hours = parseFloat(value);
        if (!isNaN(hours) && hours > 0) {
          value = `${hours}h`;
        } else {
          value = null;
        }
      }
      
      // Gestion des champs extra (JSON)
      if (dbField === 'extra') {
        extraData[csvField] = value;
        continue;
      }
      
      // Limitation de la taille des champs texte
      if (typeof value === 'string') {
        if (dbField === 'title' && value.length > 191) {
          value = value.substring(0, 188) + '...';
        } else if (dbField === 'platform' && value.length > 191) {
          value = value.substring(0, 191);
        } else if (dbField === 'provider' && value.length > 191) {
          value = value.substring(0, 191);
        }
      }
      
      cleaned[dbField] = value;
    } else {
      cleaned[dbField] = null;
    }
  }
  
  // Conversion du champ extra en JSON
  if (Object.keys(extraData).length > 0) {
    cleaned.extra = JSON.stringify(extraData);
  } else {
    cleaned.extra = null;
  }
  
  return cleaned;
}

// Fonction pour vérifier si un cours existe déjà
async function courseExists(courseId) {
  try {
    const existingCourse = await prisma.course.findFirst({
      where: { course_id: courseId },
      select: { id: true }
    });
    return !!existingCourse;
  } catch (error) {
    console.error('Erreur lors de la vérification du cours:', error.message);
    return false;
  }
}

// Fonction pour insérer un lot de données avec gestion d'erreurs
async function insertBatch(batch) {
  let successCount = 0;
  let errorCount = 0;
  let duplicateCount = 0;
  
  for (const item of batch) {
    try {
      // Vérifier si le cours existe déjà
      if (item.course_id && await courseExists(item.course_id)) {
        duplicateCount++;
        continue;
      }
      
      // Insérer le cours
      await prisma.course.create({
        data: item,
      });
      successCount++;
    } catch (error) {
      errorCount++;
      console.error(`❌ Erreur pour l'item ${item.course_id || 'sans ID'}:`, error.message);
    }
  }
  
  return { successCount, errorCount, duplicateCount };
}

// Fonction principale d'import - Version synchrone corrigée
async function importCourses() {
  console.log('🚀 Début de l\'import des cours...');
  console.log(`📁 Fichier CSV: ${CSV_FILE_PATH}`);
  
  const startTime = Date.now();
  let totalProcessed = 0;
  let totalInserted = 0;
  let totalErrors = 0;
  let totalDuplicates = 0;
  let batch = [];
  
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(CSV_FILE_PATH)
      .pipe(csv())
      .on('data', (row) => {
        try {
          totalProcessed++;
          
          // Nettoyer et valider les données
          const cleanedData = cleanData(row);
          
          // Ajouter les timestamps
          cleanedData.createdAt = new Date();
          cleanedData.updatedAt = new Date();
          
          batch.push(cleanedData);
          
          // Traiter le lot quand il atteint la taille définie
          if (batch.length >= BATCH_SIZE) {
            // Traiter le lot de manière synchrone
            insertBatch(batch).then(({ successCount, errorCount, duplicateCount }) => {
              totalInserted += successCount;
              totalErrors += errorCount;
              totalDuplicates += duplicateCount;
              
              console.log(`✅ Lot traité: ${batch.length} enregistrements, ${successCount} insérés, ${errorCount} erreurs, ${duplicateCount} doublons (Total: ${totalInserted})`);
            }).catch(error => {
              console.error('❌ Erreur lors du traitement du lot:', error.message);
              totalErrors += batch.length;
            });
            
            batch = []; // Vider le lot
          }
          
          // Afficher le progrès tous les 1000 enregistrements
          if (totalProcessed % 1000 === 0) {
            console.log(`📊 Progression: ${totalProcessed} enregistrements traités...`);
          }
          
        } catch (error) {
          console.error(`❌ Erreur lors du traitement de l'enregistrement ${totalProcessed}:`, error.message);
          totalErrors++;
        }
      })
      .on('end', async () => {
        try {
          // Traiter le dernier lot s'il reste des données
          if (batch.length > 0) {
            const { successCount, errorCount, duplicateCount } = await insertBatch(batch);
            totalInserted += successCount;
            totalErrors += errorCount;
            totalDuplicates += duplicateCount;
            console.log(`✅ Dernier lot traité: ${batch.length} enregistrements, ${successCount} insérés, ${errorCount} erreurs, ${duplicateCount} doublons`);
          }
          
          const endTime = Date.now();
          const duration = (endTime - startTime) / 1000;
          
          console.log('\n🎉 Import terminé!');
          console.log(`📊 Statistiques:`);
          console.log(`   - Enregistrements traités: ${totalProcessed}`);
          console.log(`   - Enregistrements insérés: ${totalInserted}`);
          console.log(`   - Doublons ignorés: ${totalDuplicates}`);
          console.log(`   - Erreurs: ${totalErrors}`);
          console.log(`   - Durée: ${duration.toFixed(2)} secondes`);
          console.log(`   - Débit: ${(totalProcessed / duration).toFixed(2)} enregistrements/seconde`);
          
          resolve({
            totalProcessed,
            totalInserted,
            totalDuplicates,
            totalErrors,
            duration
          });
          
        } catch (error) {
          console.error('❌ Erreur lors du traitement du dernier lot:', error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('❌ Erreur lors de la lecture du fichier CSV:', error);
        reject(error);
      });
  });
}

// Fonction pour vérifier la base de données
async function checkDatabase() {
  try {
    const totalCourses = await prisma.course.count();
    console.log(`📊 Nombre total de cours en base: ${totalCourses}`);
    
    // Afficher quelques exemples
    const sampleCourses = await prisma.course.findMany({
      take: 5,
      select: {
        id: true,
        title: true,
        platform: true,
        provider: true,
        rating: true,
        price: true,
        level: true
      },
      orderBy: {
        id: 'desc'
      }
    });
    
    console.log('\n📋 Exemples de cours importés:');
    sampleCourses.forEach((course, index) => {
      console.log(`   ${index + 1}. ${course.title || 'Sans titre'} (${course.platform || 'N/A'}) - Rating: ${course.rating || 'N/A'}, Prix: ${course.price || 'Gratuit'}, Niveau: ${course.level || 'N/A'}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification de la base de données:', error);
  }
}

// Fonction pour nettoyer la base de données (optionnel)
async function clearCourses() {
  try {
    console.log('🧹 Nettoyage de la table des cours...');
    const deletedCount = await prisma.course.deleteMany({});
    console.log(`✅ ${deletedCount.count} cours supprimés`);
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}

// Fonction principale
async function main() {
  try {
    console.log('🔍 Vérification de la connexion à la base de données...');
    await prisma.$connect();
    console.log('✅ Connexion à la base de données établie');
    
    // Vérifier l'état initial
    console.log('\n📊 État initial de la base de données:');
    await checkDatabase();
    
    // Demander confirmation pour le nettoyage (optionnel)
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise((resolve) => {
      rl.question('\n❓ Voulez-vous nettoyer la table des cours avant l\'import ? (y/N): ', resolve);
    });
    rl.close();
    
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      await clearCourses();
    }
    
    // Importer les cours
    console.log('\n🚀 Début de l\'import...');
    const result = await importCourses();
    
    // Vérifier l'état final
    console.log('\n📊 État final de la base de données:');
    await checkDatabase();
    
    console.log('\n✅ Script terminé avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  main();
}

module.exports = {
  importCourses,
  checkDatabase,
  cleanData,
  clearCourses
}; 