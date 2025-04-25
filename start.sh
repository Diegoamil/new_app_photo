#!/bin/sh

# Definir trap para sinais
trap 'echo "Recebido sinal de encerramento, encerrando graciosamente..."; exit 0' SIGTERM SIGINT

# Iniciar o servidor em segundo plano
node server.js &
SERVER_PID=$!

# Aguardar o processo do servidor
wait $SERVER_PID
