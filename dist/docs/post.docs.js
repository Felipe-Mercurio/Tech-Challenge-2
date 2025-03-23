"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postDocs = void 0;
exports.postDocs = {
    "/posts": {
        post: {
            summary: "Criar uma nova postagem",
            tags: ["Postagens"],
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["titulo", "conteudo", "materia"],
                            properties: {
                                titulo: { type: "string", example: "Título da Postagem" },
                                conteudo: { type: "string", example: "Conteúdo da postagem" },
                                materia: { type: "string", example: "Matéria relacionada" }
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: "Postagem criada com sucesso" },
                401: { description: "Usuário não autenticado" },
                500: { description: "Erro ao criar postagem" }
            }
        },
        get: {
            summary: "Listar todas as postagens",
            tags: ["Postagens"],
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: "Lista de postagens retornada com sucesso",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        _id: { type: "string", example: "660f0bc8fc13ae3a57000001" },
                                        titulo: { type: "string", example: "Título da Postagem" },
                                        conteudo: { type: "string", example: "Conteúdo da postagem" },
                                        autor: {
                                            type: "object",
                                            properties: {
                                                nome: { type: "string", example: "João da Silva" },
                                                email: { type: "string", example: "joao@email.com" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                401: { description: "Usuário não autenticado" },
                500: { description: "Erro ao listar postagens" }
            }
        }
    },
    "/posts/{id}": {
        get: {
            summary: "Buscar postagem por ID",
            tags: ["Postagens"],
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
                200: { description: "Postagem encontrada com sucesso" },
                401: { description: "Usuário não autenticado" },
                404: { description: "Postagem não encontrada" },
                500: { description: "Erro ao buscar postagem" }
            }
        },
        put: {
            summary: "Atualizar postagem",
            tags: ["Postagens"],
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
                                titulo: { type: "string", example: "Título atualizado" },
                                conteudo: { type: "string", example: "Conteúdo atualizado" },
                                materia: { type: "string", example: "Matéria atualizada" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "Postagem atualizada com sucesso" },
                403: { description: "Apenas professores podem editar postagens" },
                404: { description: "Postagem não encontrada" },
                500: { description: "Erro ao atualizar postagem" }
            }
        },
        delete: {
            summary: "Deletar postagem",
            tags: ["Postagens"],
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
                200: { description: "Postagem deletada com sucesso" },
                403: { description: "Apenas professores podem excluir postagens" },
                404: { description: "Postagem não encontrada" },
                500: { description: "Erro ao deletar postagem" }
            }
        }
    }
};
