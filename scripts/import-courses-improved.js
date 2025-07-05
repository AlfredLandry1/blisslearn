const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const prisma = new PrismaClient();

// Configuration
const BATCH_SIZE = 100; // Taille de lot réduite pour éviter les timeouts
const CSV_FILE_PATH = path.join(__dirname, '..', 'processed_courses.csv');

// Taux de conversion EUR vers FCFA
const EUR_TO_FCFA = 655.957;

// Nouveau mapping direct des champs CSV vers le modèle Prisma
const CSV_TO_DB_MAPPING = {
  course_id: 'course_id',
  title: 'title',
  link: 'link',
  platform: 'platform',
  institution: 'institution',
  instructor: 'instructor',
  description: 'description',
  skills: 'skills',
  category: 'category',
  level_normalized: 'level_normalized',
  duration_hours: 'duration_hours',
  price_numeric: 'price_numeric',
  rating_numeric: 'rating_numeric',
  reviews_count_numeric: 'reviews_count_numeric',
  enrolled_students: 'enrolled_students',
  course_type: 'course_type',
  mode: 'mode',
  availability: 'availability',
  source_file: 'source_file',
};

/**
 * Convertit une durée au format "xh" en minutes
 * @param {string} durationStr - Durée au format "xh" (ex: "2.5h", "3h")
 * @returns {string|null} - Durée en minutes ou null si invalide
 */
function parseDurationToMinutes(durationStr) {
  if (!durationStr) return null;
  
  // Extraire le nombre d'heures du format "xh"
  const hoursMatch = durationStr.toString().match(/^(\d+(?:\.\d+)?)h?$/i);
  if (hoursMatch) {
    const hours = parseFloat(hoursMatch[1]);
    if (!isNaN(hours) && hours > 0) {
      // Convertir en minutes
      const minutes = Math.round(hours * 60);
      return minutes.toString();
    }
  }
  return null;
}

/**
 * Convertit un prix en EUR vers FCFA
 * @param {string|number} priceEur - Prix en EUR
 * @returns {string} - Prix en FCFA
 */
function convertPriceToFCFA(priceEur) {
  if (!priceEur || priceEur === '0' || priceEur === 0) {
    return '0'; // Gratuit
  }
  
  const numValue = parseFloat(priceEur);
  if (!isNaN(numValue) && numValue >= 0) {
    // Convertir en FCFA
    const priceInFCFA = Math.round(numValue * EUR_TO_FCFA);
    return priceInFCFA.toString();
  }
  
  return '0'; // Gratuit si prix invalide
}

/**
 * Parse et valide un rating
 * @param {string|number} rating - Rating à valider
 * @returns {number|null} - Rating validé ou null
 */
function parseRating(rating) {
  if (!rating) return null;
  
  const numValue = parseFloat(rating);
  if (!isNaN(numValue) && numValue >= 0 && numValue <= 5) {
    return numValue;
  }
  return null;
}

/**
 * Limite la taille d'une chaîne de caractères
 * @param {string} str - Chaîne à limiter
 * @param {number} maxLength - Longueur maximale
 * @param {boolean} addEllipsis - Ajouter "..." si tronqué
 * @returns {string} - Chaîne limitée
 */
function limitStringLength(str, maxLength, addEllipsis = false) {
  if (!str || typeof str !== 'string') return str;
  
  if (str.length <= maxLength) return str;
  
  if (addEllipsis) {
    return str.substring(0, maxLength - 3) + '...';
  }
  
  return str.substring(0, maxLength);
}

// Conversion des types pour chaque champ
function cleanData(rawData) {
  const cleaned = {};
  for (const [csvField, dbField] of Object.entries(CSV_TO_DB_MAPPING)) {
    let value = rawData[csvField];
    if (value !== undefined && value !== null && value !== '') {
      value = value.toString().trim();
      switch (dbField) {
        case 'duration_hours':
          value = parseFloat(value);
          value = isNaN(value) ? null : value;
          break;
        case 'price_numeric':
          value = parseFloat(value);
          value = isNaN(value) ? null : value;
          break;
        case 'rating_numeric':
          value = parseFloat(value);
          value = isNaN(value) ? null : value;
          break;
        case 'reviews_count_numeric':
          value = parseInt(value);
          value = isNaN(value) ? null : value;
          break;
        default:
          // Limiter la taille de certains champs texte
          if (typeof value === 'string') {
            if (dbField === 'title') value = limitStringLength(value, 191, true);
            if (dbField === 'platform' || dbField === 'institution') value = limitStringLength(value, 191);
          }
          break;
      }
      cleaned[dbField] = value;
    } else {
      cleaned[dbField] = null;
    }
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
  console.log(`💱 Taux de conversion EUR → FCFA: ${EUR_TO_FCFA}`);
  
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
    const sampleCourses = await prisma.course.findMany({
      take: 5,
      select: {
        id: true,
        title: true,
        platform: true,
        institution: true,
        instructor: true,
        rating_numeric: true,
        price_numeric: true,
        level_normalized: true,
        duration_hours: true,
        enrolled_students: true,
        course_type: true,
        mode: true,
        availability: true,
        source_file: true,
      },
      orderBy: { id: 'desc' }
    });
    console.log('\n📋 Exemples de cours importés:');
    sampleCourses.forEach((course, index) => {
      console.log(`   ${index + 1}. ${course.title || 'Sans titre'} (${course.platform || 'N/A'})`);
      console.log(`      - Institution: ${course.institution || 'N/A'}, Instructeur: ${course.instructor || 'N/A'}`);
      console.log(`      - Rating: ${course.rating_numeric || 'N/A'}, Prix: ${course.price_numeric || 'Gratuit'}`);
      console.log(`      - Niveau: ${course.level_normalized || 'N/A'}, Durée: ${course.duration_hours || 'N/A'} h`);
      console.log(`      - Étudiants: ${course.enrolled_students || 'N/A'}, Type: ${course.course_type || 'N/A'}`);
      console.log(`      - Mode: ${course.mode || 'N/A'}, Dispo: ${course.availability || 'N/A'}, Source: ${course.source_file || 'N/A'}`);
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
  clearCourses,
  parseDurationToMinutes,
  convertPriceToFCFA,
  parseRating
}; 