Biblioteca estrutura .json

ROLES: {
  1: user
  2: admin
}

--------------------------------------------------------------------------------------------
 .json Cadastrar Livros
 
  {
    "titulo": "You Don't Know JS: Scope & Closures",
    "autor": "Kyle Simpson",
    "editora": "O'Reilly Media",
    "anoPublicacao": "2014",
    "isbn": "9781449335588",
    "quantTotal": 8,
    "quantDisponivel": 5,
    "valorAquisicao": 90,
    "statusLivroEmprestado": "Disponível"
  }
  {
    "titulo": "JavaScript: The Good Parts",
    "autor": "Douglas Crockford",
    "editora": "O'Reilly Media",
    "anoPublicacao": "2008",
    "isbn": "9780596517748",
    "quantTotal": 6,
    "quantDisponivel": 2,
    "valorAquisicao": 85,
    "statusLivroEmprestado": "Emprestado"
  },
  {
    "titulo": "Design Patterns: Elements of Reusable Object-Oriented Software",
    "autor": "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    "editora": "Addison-Wesley Professional",
    "anoPublicacao": "1994",
    "isbn": "9780201633610",
    "quantTotal": 5,
    "quantDisponivel": 4,
    "valorAquisicao": 150,
    "statusLivroEmprestado": "Disponível"
  }
  {
    "titulo": "The Pragmatic Programmer: Your Journey to Mastery",
    "autor": "Andrew Hunt, David Thomas",
    "editora": "Addison-Wesley Professional",
    "anoPublicacao": "1999",
    "isbn": "9780201616224",
    "quantTotal": 7,
    "quantDisponivel": 3,
    "valorAquisicao": 140,
    "statusLivroEmprestado": "Emprestado"
  }
--------------------------------------------------------------------------------------
.json cadastrar aluno

{
	"nome": "Kelly",
	"sobrenome": "Osborne",
	"dataNascimento": "1974-04-01",
	"endereco": "Rua do rock, 666",
	"email": "morcego@rock.com",
	"celular": "16998959876"	
}
------------------------------------------------------------------------------------
.json cadastrar emprestimo

{  
  "idAluno": 1,
  "idLivro": 1,
  "dataEmprestimo": "2024-09-01",
  "dataDevolucao": "2024-09-15",
  "statusEmprestimo": "Em andamento"
}
