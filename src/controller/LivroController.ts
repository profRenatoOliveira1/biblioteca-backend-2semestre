import { Livro } from "../model/Livro";
import { Request, Response } from "express";
import fs from 'fs';
import path from 'path';

/**
 * Interface LivroDTO
 */
interface LivroDTO {
    titulo: string;
    autor: string;
    editora: string;
    anoPublicacao?: number;
    isbn?: string;
    quantTotal: number;
    quantDisponivel: number;
    valorAquisicao?: number;
    statusLivroEmprestado?: string;
}

class LivroController extends Livro {

    static async todos(req: Request, res: Response) {
        try {
            const listaDeLivros = await Livro.listarLivros();
            return res.status(200).json(listaDeLivros);
        } catch (error) {
            console.error(`Erro ao listar livros: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao recuperar as informações dos livros." });
        }
    }

    static async cadastrar(req: Request, res: Response) {
        try {
            const dadosRecebidos: LivroDTO = req.body;

            const novoLivro = new Livro(
                dadosRecebidos.titulo,
                dadosRecebidos.autor,
                dadosRecebidos.editora,
                (dadosRecebidos.anoPublicacao ?? 0).toString(),
                dadosRecebidos.isbn ?? '',
                dadosRecebidos.quantTotal,
                dadosRecebidos.quantDisponivel,
                dadosRecebidos.valorAquisicao ?? 0,
                dadosRecebidos.statusLivroEmprestado ?? 'Disponível'
            );

            const result = await Livro.cadastrarLivro(novoLivro);

            if (result.queryResult && result.idLivro) {
                novoLivro.setIdLivro(result.idLivro);

                if (req.file) {
                    const nomeImagem = req.file.filename; // já foi salvo pelo multer com nome aleatório
                    await Livro.atualizarImagemCapa(nomeImagem, novoLivro.getIdLivro());
                }

                return res.status(200).json({ mensagem: 'Livro cadastrado com sucesso.' });
            } else {
                return res.status(500).json({ mensagem: 'Não foi possível cadastrar o livro no banco de dados.' });
            }
        } catch (error) {
            console.error(`Erro ao cadastrar o livro: ${error}`);
            return res.status(500).json({ mensagem: 'Erro ao cadastrar o livro.' });
        }
    }

    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            const idLivro = parseInt(req.query.idLivro as string);

            if (isNaN(idLivro)) {
                return res.status(400).json({ mensagem: 'ID do livro inválido.' });
            }

            const result = await Livro.removerLivro(idLivro);

            if (result) {
                return res.status(201).json({ mensagem: 'Livro removido com sucesso.' });
            } else {
                return res.status(404).json({ mensagem: 'Livro não encontrado para exclusão.' });
            }
        } catch (error) {
            console.error("Erro ao remover o livro: ", error);
            return res.status(500).json({ mensagem: 'Erro ao remover o livro.' });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const idLivro = parseInt(req.query.idLivro as string);

            if (isNaN(idLivro)) {
                return res.status(400).json({ mensagem: "ID do livro inválido." });
            }

            const dadosRecebidos: LivroDTO = req.body;

            const livro = new Livro(
                dadosRecebidos.titulo,
                dadosRecebidos.autor,
                dadosRecebidos.editora,
                (dadosRecebidos.anoPublicacao ?? 0).toString(),
                dadosRecebidos.isbn ?? '',
                dadosRecebidos.quantTotal,
                dadosRecebidos.quantDisponivel,
                dadosRecebidos.valorAquisicao ?? 0,
                dadosRecebidos.statusLivroEmprestado ?? 'Disponível'
            );

            livro.setIdLivro(idLivro);

            const sucesso = await Livro.atualizarCadastroLivro(livro);

            if (sucesso) {
                return res.status(200).json({ mensagem: "Cadastro atualizado com sucesso!" });
            } else {
                return res.status(400).json({ mensagem: "Não foi possível atualizar o livro no banco de dados." });
            }
        } catch (error) {
            console.error(`Erro ao atualizar livro: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao atualizar o livro." });
        }
    }
}

export default LivroController;
