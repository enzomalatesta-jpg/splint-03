import express from "express";

const app = express();

const PORT = 3000;

const mensagens = [
  { id: 1, usuario: "Ana", texto: "Bom dia!" },
  { id: 2, usuario: "Pedro", texto: "Olá, turma!" },
  { id: 3, usuario: "Maria", texto: "Nosso servidor está funcionando!" },
];

function listarMensagens() { return mensagens; }

function buscarMensagem(id) { return mensagens.find(m => m.id === id); }

function consultar(simularErro = false) { return new Promise((resolve, reject) => { setTimeout(() => { if (simularErro) return reject(new Error("Falha simulada"));
resolve(mensagens); }, 1000); }); }


app.get("/", (req, res) => res.send("Servidor rodando! 🚀"));
app.get("/status", (req, res) => res.json({ status: "online", sprint: 3 }));
app.get("/sobre", (req, res) => res.send("Mensageiro Local com Node.js, Express e ES Modules."));


app.get("/mensagens", (req, res) => res.json(listarMensagens()));

app.get("/mensagens/:id", (req, res) => {
  const mensagem = mensagens.find(m => m.id === Number(req.params.id));
  if (!mensagem) return res.status(404).json({ erro: "Não encontrada" });
  res.json(mensagem);
});

app.get("/mensagens-then", (req, res) => { consultar().then(lista => res.json(lista)).catch(() => res.status(500).json({ erro: "Falha na consulta" })); });

app.get("/mensagens-async", async (req, res) => { try { res.json(await consultar()); } catch (erro) { console.error("erro simulado", erro.mensagem); res.status(500).json({ erro: "Falha na consulta" }); } });

app.get("/mensagens-erro", async (req, res) => { try { res.json(await consultar(true)); } catch (erro) { console.error("erro simulado", erro.mensagem); res.status(500).json({ erro: "Falha simulada" }); } });

app.listen(PORT, "0.0.0.0", () => { console.log(`Servidor em http://localhost:${PORT}`); });