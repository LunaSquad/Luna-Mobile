import API_BASE_URL from "./ip";

export async function preAdaptarTudoEmSegundoPlano(userId: string) {
  try {
    console.log("🤫 [Background] Iniciando pré-adaptação silenciosa para o aluno:", userId);

    // 1. Puxa os dados do aluno para descobrir a turma e o hiperfoco
    const respAluno = await fetch(`${API_BASE_URL}/students/aluno/${userId}`);
    const dataAluno = await respAluno.json();
    
    if (!dataAluno.ok || !dataAluno.aluno) return;

    const turmaId = dataAluno.aluno.turmaId;
    let hiperfoco = "";
    if (typeof dataAluno.aluno.hiperfoco === "string") {
      hiperfoco = dataAluno.aluno.hiperfoco;
    } else if (dataAluno.aluno.hiperfoco?.nome) {
      hiperfoco = dataAluno.aluno.hiperfoco.nome;
    }

    if (!turmaId || !hiperfoco) {
      console.log("🤫 [Background] Aluno sem hiperfoco ou turma. Abortando.");
      return;
    }


    // ... código que busca o hiperfoco do aluno ...

    if (!turmaId || !hiperfoco) {
      console.log("🤫 [Background] Aluno sem hiperfoco ou turma. Abortando.");
      return;
    }

    // 👇 ADICIONE ISTO AQUI: Dispara a geração de imagens no backend
    fetch(`${API_BASE_URL}/ai/gerar-assets-visuais`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alunoId: userId, hiperfoco: hiperfoco })
    })
    .then(res => res.json())
    .then(data => console.log("🤫 [Background] Assets visuais verificados/gerados!"))
    .catch(err => console.log("🤫 [Background] Erro nos assets:", err));

    // ... continua o código de varrer as matérias ...

    // 2. Puxa a lista de matérias cadastradas
    const respMaterias = await fetch(`${API_BASE_URL}/subjects/materias`);
    const dataMaterias = await respMaterias.json();
    
    // Ajuste aqui dependendo de como sua API de matérias retorna (se é array direto ou dataMaterias.materias)
    const listaMaterias = Array.isArray(dataMaterias) ? dataMaterias : dataMaterias.materias || [];

    // 3. Varre as matérias buscando os planos
    for (const materia of listaMaterias) {
      const materiaId = materia._id || materia.id;
      if (!materiaId) continue;

      const respPlanos = await fetch(`${API_BASE_URL}/lesson-plans/turma/${turmaId}/materia/${materiaId}`);
      const dataPlanos = await respPlanos.json();

      if (dataPlanos.planos && dataPlanos.planos.length > 0) {
        
        // 4. Dispara a IA para cada plano encontrado (SEM usar 'await' para não travar o loop)
        dataPlanos.planos.forEach((plano: any) => {
          if (!plano.urlPlanoDeAula) return; // Só adapta se tiver o PDF

          fetch(`${API_BASE_URL}/ai/adaptar-plano`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              planoId: plano._id || plano.id,
              turmaId,
              materiaId,
              hiperfoco,
              urlPlanoDeAula: plano.urlPlanoDeAula,
              alunoId: userId
            })
          })
          .then(res => res.json())
          .then(data => {
            if (data.origem === "ia") {
              console.log(`✅ [Background] Atividade ${plano.titulo} adaptada e salva no banco!`);
            }
          })
          .catch(err => console.log("🤫 [Background] Erro na requisição de IA:", err));
        });

      }
    }
    
    console.log("🤫 [Background] Todas as requisições foram despachadas para o servidor da IA!");

  } catch (error) {
    console.log("🤫 [Background] Erro fatal na pré-adaptação:", error);
  }
}