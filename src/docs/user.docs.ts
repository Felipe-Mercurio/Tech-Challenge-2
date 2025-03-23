export const userDocs = {
    "/users": {
      post: {
        summary: "Criar um novo usuário",
        tags: ["Usuários"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["nome", "email", "senha", "tipo"],
                properties: {
                  nome: { type: "string", example: "João da Silva" },
                  email: { type: "string", example: "joao@email.com" },
                  senha: { type: "string", example: "123456" },
                  tipo: { type: "string", enum: ["Administrador", "Professor", "Aluno"], example: "Professor" }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Usuário criado com sucesso" },
          500: { description: "Erro ao criar usuário" }
        }
      },
      get: {
        summary: "Listar todos os usuários",
        tags: ["Usuários"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Lista de usuários retornada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      _id: { type: "string", example: "660f0bc8fc13ae3a57000001" },
                      nome: { type: "string", example: "João da Silva" },
                      email: { type: "string", example: "joao@email.com" },
                      tipo: { type: "string", enum: ["Administrador", "Professor", "Aluno"], example: "Professor" }
                    }
                  }
                }
              }
            }
          },
          401: { description: "Usuário não autenticado" },
          500: { description: "Erro ao listar usuários" }
        }
      }
    },
  
    "/users/{id}": {
      get: {
        summary: "Buscar usuário por ID",
        tags: ["Usuários"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", example: "660f0bc8fc13ae3a57000001" }
          }
        ],
        responses: {
          200: { description: "Usuário encontrado com sucesso" },
          401: { description: "Usuário não autenticado" },
          404: { description: "Usuário não encontrado" },
          500: { description: "Erro ao buscar usuário" }
        }
      },
      put: {
        summary: "Atualizar usuário",
        tags: ["Usuários"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", example: "660f0bc8fc13ae3a57000001" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nome: { type: "string", example: "João da Silva" },
                  email: { type: "string", example: "joao@email.com" },
                  tipo: { type: "string", enum: ["Administrador", "Professor", "Aluno"], example: "Professor" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Usuário atualizado com sucesso" },
          403: { description: "Apenas administradores podem editar usuários" },
          404: { description: "Usuário não encontrado" },
          500: { description: "Erro ao atualizar usuário" }
        }
      },
      delete: {
        summary: "Deletar usuário",
        tags: ["Usuários"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", example: "660f0bc8fc13ae3a57000001" }
          }
        ],
        responses: {
          200: { description: "Usuário deletado com sucesso" },
          403: { description: "Apenas administradores podem excluir usuários" },
          404: { description: "Usuário não encontrado" },
          500: { description: "Erro ao deletar usuário" }
        }
      }
    },
  
    "/users/login": {
      post: {
        summary: "Autenticar usuário",
        tags: ["Usuários"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "senha"],
                properties: {
                  email: { type: "string", example: "joao@email.com" },
                  senha: { type: "string", example: "123456" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Autenticação bem-sucedida",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" },
                    usuario: {
                      type: "object",
                      properties: {
                        _id: { type: "string", example: "660f0bc8fc13ae3a57000001" },
                        nome: { type: "string", example: "João da Silva" },
                        email: { type: "string", example: "joao@email.com" },
                        tipo: { type: "string", enum: ["Administrador", "Professor", "Aluno"], example: "Professor" }
                      }
                    }
                  }
                }
              }
            }
          },
          401: { description: "Credenciais inválidas" },
          500: { description: "Erro ao autenticar usuário" }
        }
      }
    }
  };
  