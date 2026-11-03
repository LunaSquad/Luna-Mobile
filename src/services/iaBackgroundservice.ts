import API_BASE_URL from "./ip";

export async function preAdaptarTudoEmSegundoPlano(userId: string) {
  try {
    const respAluno = await fetch(`${API_BASE_URL}/students/aluno/${userId}`);
    const dataAluno = await respAluno.json();

    if (!dataAluno.ok || !dataAluno.aluno) return;

    const turmaId =
      dataAluno.aluno.turmaId ||
      dataAluno.aluno.turmaID ||
      dataAluno.aluno.codTurma ||
      dataAluno.aluno.idTurma;

    let hiperfoco = "";
    if (typeof dataAluno.aluno.hiperfoco === "string") {
      hiperfoco = dataAluno.aluno.hiperfoco;
    } else if (dataAluno.aluno.hiperfoco?.nome) {
      hiperfoco = dataAluno.aluno.hiperfoco.nome;
    } else if (dataAluno.aluno.hyperfoco?.nome) {
      hiperfoco = dataAluno.aluno.hyperfoco.nome;
    }

    if (!turmaId || !hiperfoco) {
      return;
    }

    fetch(`${API_BASE_URL}/ai/gerar-assets-visuais`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alunoId: userId, hiperfoco }),
    }).catch(() => { });

    const respMaterias = await fetch(`${API_BASE_URL}/subjects/materias`);
    const dataMaterias = await respMaterias.json();
    const listaMaterias = Array.isArray(dataMaterias)
      ? dataMaterias
      : dataMaterias.materias || [];

    for (const materia of listaMaterias) {
      const materiaId = materia._id || materia.id;
      if (!materiaId) continue;

      const respPlanos = await fetch(
        `${API_BASE_URL}/lesson-plans/turma/${turmaId}/materia/${materiaId}?userId=${userId}`
      );
      const dataPlanos = await respPlanos.json();

      if (dataPlanos.planos && dataPlanos.planos.length > 0) {
        dataPlanos.planos.forEach((plano: any) => {
          if (!plano.urlPlanoDeAula) return;

          fetch(`${API_BASE_URL}/ai/adaptar-plano`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              planoId: plano._id || plano.id || plano.idPlano,
              turmaId: String(turmaId),
              materiaId: String(materiaId),
              hiperfoco,
              urlPlanoDeAula: plano.urlPlanoDeAula,
              alunoId: userId,
            }),
          }).catch(() => { });
        });
      }
    }
  } catch (error) { }
}