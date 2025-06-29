async function testAPI() {
  const baseUrl = 'http://localhost:3000/api/courses';
  
  const testCases = [
    {
      name: 'Test basique',
      params: '?page=1&limit=5'
    },
    {
      name: 'Test avec plateforme FutureLearn',
      params: '?page=1&limit=5&platform=FutureLearn'
    },
    {
      name: 'Test avec niveau intermédiaire',
      params: '?page=1&limit=5&level=intermediate'
    },
    {
      name: 'Test avec filtres multiples (plateforme + niveau)',
      params: '?page=1&limit=5&platform=FutureLearn&level=intermediate'
    },
    {
      name: 'Test avec recherche simple',
      params: '?page=1&limit=5&search=test'
    },
    {
      name: 'Test avec recherche javascript',
      params: '?page=1&limit=5&search=javascript'
    },
    {
      name: 'Test avec tri',
      params: '?page=1&limit=5&sortBy=rating_numeric&sortOrder=desc'
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n🧪 ${testCase.name}`);
    console.log(`URL: ${baseUrl}${testCase.params}`);
    
    try {
      const response = await fetch(`${baseUrl}${testCase.params}`);
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ Succès: ${data.courses.length} cours trouvés`);
        console.log(`📊 Total: ${data.pagination.totalItems} cours`);
        if (data.courses.length > 0) {
          console.log(`📝 Premier cours: ${data.courses[0].title}`);
        }
      } else {
        console.log(`❌ Erreur ${response.status}:`, data.error);
      }
    } catch (error) {
      console.log(`❌ Erreur réseau:`, error);
    }
  }
}

// Exécuter les tests
testAPI(); 