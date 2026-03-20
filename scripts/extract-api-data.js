const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Caminhos dos arquivos
const dbPath = path.resolve(__dirname, '../../../data/database.db');
const outputDir = path.join(__dirname, '../public/data');
const ordensOutputDir = path.join(outputDir, 'ordens');

// Garantir que os diretórios existam
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(ordensOutputDir)) fs.mkdirSync(ordensOutputDir, { recursive: true });

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error("Erro ao conectar no banco de dados:", err.message);
    process.exit(1);
  }
});

// Helper para executar consultas SQL
const queryAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const queryGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

async function gerarDadosLocais() {
  console.log("Iniciando extração de dados do SQLite...");

  try {
    // 1. Equipamentos Prioritários
    console.log("-> Extraindo Equipamentos Prioritários...");
    const equipamentosPrioritarios = await queryAll(`
      SELECT * FROM equipamento 
      WHERE peso_prioridade IS NOT NULL 
      ORDER BY peso_prioridade DESC
    `);
    fs.writeFileSync(
      path.join(outputDir, 'equipamentos-prioritarios.json'), 
      JSON.stringify(equipamentosPrioritarios, null, 2)
    );

    // 2. Top 5 Substituição
    console.log("-> Extraindo Top 5 Substituição...");
    const top5 = await queryAll(`
      SELECT 
          id,
          identificador,
          modelo,
          fabricante,
          setor,
          data_aquisicao as dataAquisicao,
          custo_aquisicao as custo,
          status,
          custo_total_externo as totalCustoExterno,
          peso_prioridade as prioridadeScore
      FROM equipamento
      WHERE peso_prioridade IS NOT NULL
      ORDER BY peso_prioridade DESC
      LIMIT 5
    `);
    fs.writeFileSync(
      path.join(outputDir, 'top-5-substituicao.json'), 
      JSON.stringify(top5, null, 2)
    );

    // 3. Estatísticas
    console.log("-> Extraindo Estatísticas...");
    const totalEquipamentos = await queryGet(`SELECT COUNT(*) as total_equipamentos FROM equipamento`);
    const countManutencao = await queryGet(`SELECT COUNT(*) as count FROM equipamento WHERE status = 'Manutenção'`);
    
    fs.writeFileSync(
      path.join(outputDir, 'estatisticas.json'), 
      JSON.stringify({
        total_equipamentos: totalEquipamentos.total_equipamentos,
        quantidade_em_manutencao: countManutencao.count
      }, null, 2)
    );

    // 4. Ordens de Serviço por Equipamento
    console.log("-> Extraindo Ordens de Serviço para cada equipamento...");
    const todosEquipamentos = await queryAll(`SELECT id, identificador FROM equipamento`);
    
    for (const eq of todosEquipamentos) {
      if (!eq.identificador) continue;
      
      const ordens = await queryAll(`
        SELECT * FROM ordemservico 
        WHERE equipamento_id = ?
      `, [eq.id]);

      // Adapt the DB output to fit api.ts exactly:
      // api.ts expects: id: item.ordemServico, equipmentId: item.identificadorEquipamento, ordemServico: item.ordemServico, custo: item.custo, dataInicio: item.dataInicio, dataConclusao: item.dataConclusao
      const ordensFormatadas = ordens.map(o => ({
        id: o.numero_os,
        identificadorEquipamento: eq.identificador,
        ordemServico: o.numero_os,
        custo: o.custo,
        dataInicio: o.data_abertura,
        dataConclusao: o.data_fechamento
      }));

      // Salva apenas se tiver ordens de serviço (para poupar espaço)
      if (ordensFormatadas.length > 0) {
        const filePath = path.join(ordensOutputDir, `${encodeURIComponent(eq.identificador)}.json`);
        fs.writeFileSync(filePath, JSON.stringify(ordensFormatadas, null, 2));
      }
    }

    console.log("✅ Extração concluída com sucesso!");
    
  } catch (err) {
    console.error("Erro durante a exportação:", err);
  } finally {
    db.close();
  }
}

gerarDadosLocais();
