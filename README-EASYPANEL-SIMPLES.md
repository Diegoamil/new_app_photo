# Guia Simplificado para Deploy no Easypanel

Este guia oferece uma solução mais simples para o deploy no Easypanel, evitando os problemas com diretórios e Dockerfiles.

## Solução Simplificada

Devido aos problemas persistentes com o Easypanel tentando usar o diretório como arquivo Dockerfile, criamos uma abordagem mais direta:

1. **Arquivos na raiz do projeto**:
   - `Dockerfile.frontend` - Dockerfile para o frontend
   - `Dockerfile.backend` - Dockerfile para o backend
   - `server.simple.js` - Servidor Express simplificado para testes

## 1. Deploy do Backend

1. **No Easypanel**:
   - Adicione um novo serviço > Aplicação
   - **Nome**: `api-webfoto-apptest`
   - **Método de deploy**: GitHub
   - **Repositório**: Seu repositório
   - **Branch**: `main`
   - **Diretório de Contexto**: `.` (raiz do projeto)
   - **Arquivo Dockerfile**: `Dockerfile.backend`
   - **Porta**: `80`

2. **Variáveis de Ambiente**:
   ```
   NODE_ENV=production
   PORT=80
   ```

3. **Clique em "Criar Serviço"**

## 2. Deploy do Frontend

1. **No Easypanel**:
   - Adicione um novo serviço > Aplicação
   - **Nome**: `webfoto-apptest`
   - **Método de deploy**: GitHub
   - **Repositório**: Seu repositório
   - **Branch**: `main`
   - **Diretório de Contexto**: `.` (raiz do projeto)
   - **Arquivo Dockerfile**: `Dockerfile.frontend`
   - **Porta**: `80`

2. **Variáveis de Build**:
   ```
   REACT_APP_API_URL=https://api-webfoto-apptest.jy7ldl.easypanel.host
   ```
   (Substitua pelo domínio real do seu backend)

3. **Clique em "Criar Serviço"**

## 3. Verificação

1. **Teste o backend**:
   - Acesse `https://api-webfoto-apptest.jy7ldl.easypanel.host/api/health`
   - Você deve ver uma resposta JSON com status "UP"

2. **Teste o frontend**:
   - Acesse `https://webfoto-apptest.jy7ldl.easypanel.host`
   - Verifique se a aplicação carrega corretamente

## 4. Próximos Passos

Se esta abordagem simplificada funcionar:

1. Gradualmente adicione mais funcionalidades ao backend
2. Atualize o frontend para usar todas as funcionalidades da API
3. Configure o banco de dados PostgreSQL conforme necessário

## Solução de Problemas

Se ainda encontrar problemas:

1. Verifique os logs do serviço no Easypanel
2. Tente uma abordagem ainda mais simples (apenas frontend estático)
3. Considere outras plataformas como Render, Railway ou Fly.io
