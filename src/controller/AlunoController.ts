import { Aluno } from "../model/Aluno";
import { Request, Response } from "express";

/**
 * Interface AlunoDTO
 * Define os atributos que devem ser recebidos do cliente nas requisições
 */
interface AlunoDTO {
    nome: string;
    sobrenome: string;
    dataNascimento?: Date;
    endereco?: string;
    email: string;
    celular: string;
}

/**
 * Controlador para operações relacionadas aos alunos.
 */
class AlunoController extends Aluno {

    /**
     * Lista todos os alunos.
     * @param req Objeto de requisição HTTP.
     * @param res Objeto de resposta HTTP.
     * @returns Lista de alunos em formato JSON.
     */
    static async todos(req: Request, res: Response) {
        try {
            const listaDeAlunos = await Aluno.listarAlunos(); // recupera lista de alunos
            res.status(200).json(listaDeAlunos); // retorna JSON com a lista de alunos
        } catch (error) {
            console.log(`Erro ao acessar método herdado: ${error}`);    // Exibe erros da consulta no console
            res.status(500).json("Erro ao recuperar as informações do aluno.");  // Retorna mensagem de erro com status code 400
        }
    }

    /**
      * Cadastra um novo aluno.
      * @param req Objeto de requisição HTTP com os dados do aluno.
      * @param res Objeto de resposta HTTP.
      * @returns Mensagem de sucesso ou erro em formato JSON.
      */
    static async cadastrar(req: Request, res: Response) {
        try {
            // Desestruturando objeto recebido pelo front-end
            const dadosRecebidos: AlunoDTO = req.body;

            // Instanciando objeto Aluno
            const novoAluno = new Aluno(
                dadosRecebidos.nome,
                dadosRecebidos.sobrenome,
                dadosRecebidos.dataNascimento ?? new Date("1900-01-01"),
                dadosRecebidos.endereco ?? '',
                dadosRecebidos.email ?? '',
                dadosRecebidos.celular
            );

            // Chama o método para persistir o aluno no banco de dados
            const result = await Aluno.cadastrarAluno(novoAluno);

            // Verifica se a query foi executada com sucesso
            if (result) {
                return res.status(201).json({ mensagem: `Aluno cadastrado com sucesso.` });
            } else {
                return res.status(500).json({ mensagem: 'Não foi possível cadastrar o aluno no banco de dados.' });
            }
        } catch (error) {
            console.log(`Erro ao cadastrar o aluno: ${error}`);
            return res.status(500).json({ mensagem: 'Erro ao cadastrar o aluno.' });
        }
    }

    /**
     * Remove um aluno.
     * @param req Objeto de requisição HTTP com o ID do aluno a ser removido.
     * @param res Objeto de resposta HTTP.
     * @returns Mensagem de sucesso ou erro em formato JSON.
     */
    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            // const idAluno = parseInt(req.query.idAluno as string);

            // if (await Aluno.removerAluno(idAluno)) {
            //     return res.status(200).json({ mensagem: 'Aluno removido com sucesso.' });
            // } else {
            //     return res.status(500).json({ mensagem: 'Erro ao remover aluno.' });
            // }
            const idAluno = parseInt(req.query.idAluno as string);

            if (isNaN(idAluno)) {
                return res.status(400).json({ mensagem: 'ID do aluno inválido.' });
            }

            const result = await Aluno.removerAluno(idAluno);

            console.log(result);

            if (result) {
                return res.status(201).json({ mensagem: 'Aluno removido com sucesso.' });
            } else {
                return res.status(404).json({ mensagem: 'Aluno não encontrado para exclusão.' });
            }
        } catch (error) {
            console.log(`Erro ao remover aluno: ${error}`)
            return res.status(500).json({ mensagem: 'Erro ao remover aluno.' });
        }
    }

    /**
     * Método para atualizar o cadastro de um aluno.
     * 
     * @param req Objeto de requisição do Express, contendo os dados atualizados do aluno
     * @param res Objeto de resposta do Express
     * @returns Retorna uma resposta HTTP indicando sucesso ou falha na atualização
     */
    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            // Desestruturando objeto recebido pelo front-end
            const dadosRecebidos: AlunoDTO = req.body;

            // Instanciando objeto Aluno
            const aluno = new Aluno(
                dadosRecebidos.nome,
                dadosRecebidos.sobrenome,
                dadosRecebidos.dataNascimento ?? new Date("1900-01-01"),
                dadosRecebidos.endereco ?? '',
                dadosRecebidos.email ?? '',
                dadosRecebidos.celular
            );

            // Define o ID do aluno, que deve ser passado na query string
            aluno.setIdAluno(parseInt(req.query.idAluno as string));

            // Chama o método para atualizar o cadastro do aluno no banco de dados
            if (await Aluno.atualizarAluno(aluno)) {
                return res.status(200).json({ mensagem: "Cadastro atualizado com sucesso." });
            } else {
                return res.status(500).json({ mensagem: 'Não foi possível atualizar o aluno no banco de dados.' });
            }
        } catch (error) {
            // Caso ocorra algum erro, este é registrado nos logs do servidor
            console.error(`Erro ao atualizar aluno: ${error}`);
            // Retorna uma resposta com uma mensagem de erro
            return res.status(500).json({ mensagem: "Erro ao atualizar aluno." });
        }
    }
}

export default AlunoController;
