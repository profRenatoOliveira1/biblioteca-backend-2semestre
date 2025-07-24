import express from "express";
import { SERVER_ROUTES } from "./appConfig";
import AlunoController from "./controller/AlunoController";
import LivroController from "./controller/LivroController";
import EmprestimoController from "./controller/EmprestimoController";
import UsuarioController from "./controller/UsuarioController";
import { upload, uploadCapa } from "./middleware/multerConfig";
import { Auth } from "./middleware/Auth";

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ mensagem: `Aplicação online.`, timestamp: `${new Date().toLocaleString('pt-br')}`})
});

router.post('/login', Auth.validacaoUsuario);

// CRUD Aluno
router.get(SERVER_ROUTES.LISTAR_ALUNOS, Auth.verifyToken, AlunoController.todos);
router.post(SERVER_ROUTES.NOVO_ALUNO, Auth.verifyToken, AlunoController.cadastrar);
router.put(SERVER_ROUTES.REMOVER_ALUNO, Auth.verifyToken, AlunoController.remover);
router.put(SERVER_ROUTES.ATUALIZAR_ALUNO, Auth.verifyToken, AlunoController.atualizar);

//CRUD Livro
router.get(SERVER_ROUTES.LISTAR_LIVROS, Auth.verifyToken, LivroController.todos);
router.post(SERVER_ROUTES.NOVO_LIVRO, Auth.verifyToken, uploadCapa.single('imagemCapa'), LivroController.cadastrar);
router.put(SERVER_ROUTES.REMOVER_LIVRO, Auth.verifyToken, LivroController.remover);
router.put(SERVER_ROUTES.ATUALIZAR_LIVRO, Auth.verifyToken, LivroController.atualizar);

//CRUD Emprestimo
router.get(SERVER_ROUTES.LISTAR_EMPRESTIMOS, Auth.verifyToken, EmprestimoController.todos);
router.post(SERVER_ROUTES.NOVO_EMPRESTIMO, Auth.verifyToken, EmprestimoController.cadastrar);
router.put(SERVER_ROUTES.ATUALIZAR_EMPRESTIMO, Auth.verifyToken, EmprestimoController.atualizar);
router.put(SERVER_ROUTES.REMOVER_EMPRESTIMO, Auth.verifyToken, EmprestimoController.remover);

// Cadastro de Usuário com Upload de Imagem de Perfil
router.post(SERVER_ROUTES.NOVO_USUARIO, Auth.verifyToken, upload.single('imagemPerfil'), UsuarioController.cadastrar);

export { router }