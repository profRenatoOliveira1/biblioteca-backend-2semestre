import { Emprestimo } from "../model/Emprestimo";
import { Request, Response } from "express";

/**
 * Interface EmprestimoDTO
 * Define os atributos que devem ser recebidos do cliente nas requisições
 */
interface EmprestimoDTO {
    idAluno: number;
    idLivro: number;
    dataEmprestimo: string;
    dataDevolucao: string;
    statusEmprestimo: string;
}

class EmprestimoController extends Emprestimo {
    /**
     * Método para listar todos os empréstimos.
     * Retorna um array de empréstimos com informações dos alunos e dos livros.
     */
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            // Chama o método listarEmprestimos do service
            const listaDeEmprestimos = await Emprestimo.listarEmprestimos();

            // Verifica se houve retorno de dados
            if (!listaDeEmprestimos || listaDeEmprestimos.length === 0) {
                return res.status(404).json({ mensagem: 'Nenhum empréstimo encontrado.' });
            }

            // Retorna a lista de empréstimos com status 200 (OK)
            return res.status(200).json(listaDeEmprestimos);
        } catch (error) {
            // Em caso de erro, retorna o erro com status 500 (erro do servidor)
            console.error('Erro ao listar empréstimos:', error);
            return res.status(500).json({ mensagem: 'Erro ao listar os empréstimos.' });
        }
    }

    /**
     * Cadastra um novo empréstimo.
     * Recebe os dados do empréstimo a partir da requisição e passa para o serviço.
     */
    static async cadastrar(req: Request, res: Response): Promise<Response> {
        try {
            const dadosRecebidos: EmprestimoDTO = req.body;

            // Verifica se todos os campos obrigatórios foram fornecidos
            if (!dadosRecebidos.idAluno || !dadosRecebidos.idLivro || !dadosRecebidos.dataEmprestimo || !dadosRecebidos.dataDevolucao || !dadosRecebidos.statusEmprestimo) {
                return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
            }

            // Chama o serviço para cadastrar o empréstimo
            const novoIdEmprestimo = await Emprestimo.cadastrarEmprestimo(
                dadosRecebidos.idAluno, dadosRecebidos.idLivro, new Date(dadosRecebidos.dataEmprestimo), new Date(dadosRecebidos.dataDevolucao), dadosRecebidos.statusEmprestimo
            );

            // Retorna a resposta de sucesso com o ID do novo empréstimo
            return res.status(201).json({ mensagem: 'Empréstimo cadastrado com sucesso.', idEmprestimo: novoIdEmprestimo });

        } catch (error) {
            console.error('Erro ao cadastrar empréstimo:', error);
            return res.status(500).json({ mensagem: 'Erro ao cadastrar o empréstimo.' });
        }
    }

    /**
     * Atualiza um empréstimo existente.
     * Recebe os dados do empréstimo a partir da requisição e passa para o serviço.
     */
    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const dadosRecebidos: EmprestimoDTO = req.body;
            const idEmprestimo = parseInt(req.query.idEmprestimo as string);

            // Verifica se todos os campos obrigatórios foram fornecidos
            if (!idEmprestimo || !dadosRecebidos.idAluno || !dadosRecebidos.idLivro || !dadosRecebidos.dataEmprestimo || !dadosRecebidos.dataDevolucao || !dadosRecebidos.statusEmprestimo) {
                return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
            }

            // Chama o MODEL para atualizar o empréstimo/ Number(idEmprestimo) converte o idEmprestimo de string para number
            const emprestimoAtualizado = await Emprestimo.atualizarEmprestimo(
                idEmprestimo, dadosRecebidos.idAluno, dadosRecebidos.idLivro, new Date(dadosRecebidos.dataEmprestimo), new Date(dadosRecebidos.dataDevolucao), dadosRecebidos.statusEmprestimo
            );

            // Retorna a resposta de sucesso com o ID do empréstimo atualizado
            return res.status(200).json({ mensagem: 'Empréstimo atualizado com sucesso.', idEmprestimo: emprestimoAtualizado });

        } catch (error) {
            console.error('Erro ao atualizar empréstimo:', error);
            return res.status(500).json({ mensagem: 'Erro ao atualizar o empréstimo.' });
        }
    }

    /**
     * Método para remover um empréstimo do banco de dados
     * 
     * @param req Objeto de requisição HTTP com o ID do aluno a ser removido.
     * @param res Objeto de resposta HTTP.
     * @returns Mensagem de sucesso ou erro em formato JSON.
     */
    static async remover(req: Request, res: Response): Promise<Response> {
        // tenta executar a remoção do registro
        try {
            // id do empréstimo vindo do cliente
            const idEmprestimo = parseInt(req.query.idEmprestimo as string);
            // executa o método de remoção e armazena o resultado (booleano)
            const resultado = await Emprestimo.removerEmprestimo(idEmprestimo);

            // se o resultdo for true
            if (resultado) {
                // retorna mensagem e sucesso com status 200
                return res.status(200).json({ mensagem: 'Empréstimo removido com sucesso!' });
            } else {
                // retorna mensagem de erro com status 
                return res.status(500).json({ mensagem: 'Erro ao remover empréstimo!' });
            }

            // captura qualquer erro que possa acontecer
        } catch (error) {
            // exibe detalhes do erro no console
            console.log(`Erro ao remover o Empréstimo ${error}`);
            // retorna uma mensagem de erro com status 500
            return res.status(500).json({ mensagem: "Erro ao remover empréstimo." });
        }
    }
}

export default EmprestimoController;