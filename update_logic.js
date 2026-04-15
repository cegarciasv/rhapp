const fs = require('fs');

const files = [
  { name: '16pf.html', path: '/public/tests/16pf.html' },
  { name: 'cleaver.html', path: '/public/tests/cleaver.html' },
  { name: 'integra.html', path: '/public/tests/integra.html' },
  { name: 'moss.html', path: '/public/tests/moss.html' }
];

for (const file of files) {
  if (fs.existsSync(file.path)) {
    let content = fs.readFileSync(file.path, 'utf8');
    
    // Replace startTest logic
    if (content.includes('function startTest() {')) {
      content = content.replace(/function startTest\(\) \{[\s\S]*?showPage\('page-test'\);\s*\}/, `async function startTest() {
  const name = document.getElementById('c-name').value.trim();
  const pos  = document.getElementById('c-position').value.trim();
  if (!name || !pos) {
    const errEl = document.getElementById('entry-error') || document.getElementById('info-error');
    if (errEl) {
      errEl.style.display = 'block';
      if (errEl.tagName === 'DIV') errEl.textContent = 'Por favor complete los campos obligatorios (*).';
    }
    return;
  }
  
  const age = document.getElementById('c-age') ? document.getElementById('c-age').value : null;
  const edu = document.getElementById('c-edu') ? document.getElementById('c-edu').value : (document.getElementById('c-education') ? document.getElementById('c-education').value : null);

  try {
    const res = await fetch('/api/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, position: pos, age: age ? parseInt(age) : null, education: edu })
    });
    const data = await res.json();
    window.currentCandidateId = data.id;
    
    if (typeof candidateInfo !== 'undefined') {
      candidateInfo = {
        name, position: pos,
        age: age || '—',
        edu: edu || '—',
        date: new Date().toLocaleDateString('es-ES', {year:'numeric',month:'long',day:'numeric'}),
        time: new Date().toLocaleTimeString('es-ES', {hour:'2-digit',minute:'2-digit'})
      };
    }
    
    if (typeof answers !== 'undefined') answers = {};
    if (typeof currentSection !== 'undefined') {
      currentSection = 0;
      renderSection(0);
    }
    
    if (typeof showPage === 'function') {
      showPage('page-test');
    } else if (typeof showView === 'function') {
      if (document.getElementById('test-candidate-name')) {
        document.getElementById('test-candidate-name').textContent = name;
      }
      if (typeof renderTestGroups === 'function') renderTestGroups();
      showView('candidate-test');
    }
  } catch (error) {
    console.error("Error registering candidate:", error);
    alert("Error al registrar candidato. Por favor intente de nuevo.");
  }
}`);
    }
    
    // Replace submitTest logic
    if (content.includes('function submitTest() {')) {
      content = content.replace(/function submitTest\(\) \{[\s\S]*?showPage\('page-thankyou'\);\s*\}/, `async function submitTest() {
  const qs = typeof getQuestionsForSection === 'function' ? getQuestionsForSection(currentSection) : [];
  if (qs.length > 0) {
    const unanswered = qs.filter(q => answers[q.n] === undefined);
    if (unanswered.length > 0) {
      document.getElementById('val-msg').style.display = 'block';
      qs.forEach(q => {
        const card = document.getElementById(\`qcard-\${q.n}\`);
        if(card) card.classList.toggle('unanswered-highlight', answers[q.n] === undefined);
      });
      return;
    }
  }
  
  const scores = typeof computeScores === 'function' ? computeScores() : (typeof scoreTest === 'function' ? scoreTest(testState.answers) : {});
  const ans = typeof answers !== 'undefined' ? answers : (typeof testState !== 'undefined' ? testState.answers : {});
  
  try {
    const res = await fetch('/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidateId: window.currentCandidateId,
        testName: '${file.name.replace('.html', '').toUpperCase()}',
        answers: ans,
        scores: scores
      })
    });
    
    if (res.ok) {
      if (typeof showPage === 'function') showPage('page-thankyou');
      else if (typeof showView === 'function') showView('done');
    } else {
      alert("Error al guardar los resultados.");
    }
  } catch (error) {
    console.error("Error saving results:", error);
    alert("Error al guardar los resultados.");
  }
}`);
    }
    
    fs.writeFileSync(file.path, content);
    console.log('Updated ' + file.name);
  }
}
