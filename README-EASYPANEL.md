# Guia Detalhado para Deploy no Easypanel

Este guia fornece instruções precisas para configurar sua aplicação no Easypanel, evitando os erros comuns.

## 1. Configuração do Backend (API)

1. **Acesse o Easypanel** e vá para seu projeto
2. **Adicione um novo serviço**:
   - Clique em "Adicionar Serviço" > "Aplicação"
   - **Nome**: `api-webfoto-apptest`
   - **Método de deploy**: GitHub
   - **Repositório**: Selecione seu repositório
   - **Branch**: `main`
   - **Diretório de Contexto**: `backend-deploy` (IMPORTANTE: este é o diretório onde o Dockerfile está localizado)
   - **Arquivo Dockerfile**: `Dockerfile` (IMPORTANTE: este é o nome do arquivo dentro do diretório de contexto)
   - **Porta**: `80`

3. **Variáveis de Ambiente**:
   ```
   NODE_ENV=production
   PORT=80
   ```

4. **Clique em "Criar Serviço"**

## 2. Configuração do Frontend

1. **Adicione outro serviço**:
   - Clique em "Adicionar Serviço" > "Aplicação"
   - **Nome**: `webfoto-apptest`
   - **Método de deploy**: GitHub
   - **Repositório**: Selecione seu repositório
   - **Branch**: `main`
   - **Diretório de Contexto**: `frontend-deploy` (IMPORTANTE: este é o diretório onde o Dockerfile está localizado)
   - **Arquivo Dockerfile**: `Dockerfile` (IMPORTANTE: este é o nome do arquivo dentro do diretório de contexto)
   - **Porta**: `80`

2. **Variáveis de Build**:
   - Clique em "Variáveis de Build" e adicione:
   ```
   REACT_APP_API_URL=https://api-webfoto-apptest.jy7ldl.easypanel.host
   ```
   (Substitua pelo domínio real do seu backend)

3. **Clique em "Criar Serviço"**

## 3. Solução de Problemas Comuns

### Erro no Build do Docker

Se você encontrar um erro como:
```
Command failed with exit code 1: docker buildx build --network host -f /etc/easypanel/projects/webfoto/webfoto-apptest/code/frontend-deploy...
```

**Solução**: Certifique-se de que:
1. O **Diretório de Contexto** está correto (ex: `frontend-deploy`)
2. O **Arquivo Dockerfile** está definido como `Dockerfile` (não como o caminho completo)

### Erro 404 no Frontend

Se o frontend estiver carregando, mas as requisições para a API retornarem 404:

**Solução**: Verifique se:
1. A variável `REACT_APP_API_URL` está correta
2. O backend está funcionando (teste acessando diretamente a URL da API)
3. As rotas da API começam com `/api/` conforme esperado pelo frontend

### Erro SIGTERM no Backend

Se o backend iniciar e depois encerrar com SIGTERM:

**Solução**:
1. Verifique os logs completos para identificar a causa real
2. Considere usar a versão simplificada do backend para testes
3. Verifique se há limitações de recursos (CPU/memória) no Easypanel

## 4. Verificação Final

Após o deploy bem-sucedido:

1. Acesse o frontend através da URL fornecida pelo Easypanel
2. Teste o login/registro e outras funcionalidades
3. Verifique os logs de ambos os serviços para identificar possíveis problemas

Se tudo estiver funcionando corretamente, parabéns! Sua aplicação está agora rodando no Easypanel com frontend e backend separados.
