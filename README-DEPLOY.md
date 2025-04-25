# Guia de Deploy no Easypanel

Este guia explica como fazer o deploy da aplicação no Easypanel, separando o frontend e o backend para uma melhor manutenção e estabilidade.

## Estrutura de Deploy Recomendada

Para resolver os problemas de erro 404 e os problemas com o SIGTERM, a melhor abordagem é separar o frontend e o backend em dois serviços distintos no Easypanel.

### 1. Deploy do Backend

1. No Easypanel, crie um novo serviço para o backend:
   - Nome: `api-webfoto-apptest`
   - Imagem: Use a opção "Build from source" e selecione o repositório GitHub
   - Diretório do Dockerfile: `backend-deploy`
   - Porta: 80

2. Configure as variáveis de ambiente necessárias:
   - `NODE_ENV=production`
   - `PORT=80`
   - `DB_HOST=` (endereço do seu banco PostgreSQL)
   - `DB_USER=` (usuário do PostgreSQL)
   - `DB_PASS=` (senha do PostgreSQL)
   - `DB_NAME=` (nome do banco de dados)
   - `JWT_SECRET=` (sua chave secreta para JWT)

3. Se necessário, configure um volume para persistência de dados.

### 2. Deploy do Frontend

1. No Easypanel, crie um novo serviço para o frontend:
   - Nome: `webfoto-apptest`
   - Imagem: Use a opção "Build from source" e selecione o repositório GitHub
   - Diretório do Dockerfile: `frontend-deploy`
   - Porta: 80

2. Configure as variáveis de ambiente:
   - `REACT_APP_API_URL=https://api-webfoto-apptest.jy7ldl.easypanel.host`
   
   Substitua o domínio pelo domínio real do seu backend no Easypanel.

## Vantagens desta Abordagem

1. **Separação de Responsabilidades**: Frontend e backend são tratados como serviços independentes.
2. **Facilidade de Manutenção**: Você pode atualizar um sem afetar o outro.
3. **Melhor Escalabilidade**: Cada serviço pode ser escalado independentemente.
4. **Resolução de Problemas**: Evita problemas de integração que ocorrem ao tentar servir o frontend a partir do backend.
5. **Melhor Gerenciamento de Recursos**: O Nginx é otimizado para servir conteúdo estático, enquanto o Node.js pode focar nas operações de API.

## Verificação de Funcionamento

Após o deploy, verifique:

1. Se o frontend está acessível através do domínio principal.
2. Se o backend está acessível através do subdomínio `api-`.
3. Se as requisições do frontend para o backend estão funcionando corretamente.

## Solução de Problemas

- Se encontrar erros 404, verifique se a configuração do Nginx está correta no frontend.
- Se o backend não estiver respondendo, verifique os logs do serviço no Easypanel.
- Certifique-se de que a URL da API no frontend está apontando para o domínio correto do backend.
