# Akira Bot — Documentação Oficial do Projeto

O **Akira Bot** é um Bot para o WhatsApp, desenvolvido em ambiente **Node.js** utilizando a biblioteca de alto desempenho **Baileys**. O projeto foi projetado para otimizar a administração de comunidades, agendamento de compromissos internos, criação de enquetes interativas e consultas a serviços externos de utilidade pública.


## 🛠️ Tecnologias e Requisitos do Sistema

* **Ambiente de Execução:** Node.js (Versão LTS recomendada).
* **Biblioteca Principal:** Baileys (Protocolo de conexão via socket do WhatsApp).
* **Persistência de Dados:** Arquivos estruturados em formato JSON para armazenamento local.
* **Compatibilidade de Sistemas:** Totalmente operacional em ambientes Windows, Linux e emuladores de terminal móvel (Termux).


## 📥 Processo de Instalação e Configuração

Siga as etapas abaixo para preparar o ambiente de execução local:

1. Abra o terminal de comando do seu sistema (ou PowerShell no VS Code) e navegue até o diretório raiz do projeto:
   ```bash
   cd "C:\Users\konoz\Documents\Akira bot"
   ```

   Execute o gerenciador de pacotes para realizar o download e a instalação de todas as dependências declaradas no arquivo package.json:
   ```bash
   npm install
   ```

  ## Inicialização e Autenticação Inicial
1. Para iniciar o ciclo de vida do bot, execute o script de inicialização do projeto:

```bash
npm start
```


2. O sistema iniciará a leitura do módulo de autenticação e projetará um QR Code diretamente no terminal de comandos.

3. No seu dispositivo móvel, abra o aplicativo WhatsApp, acesse a seção Aparelhos Conectados > Conectar um Aparelho e efetue a leitura do QR Code exibido.

4. Após a validação mútua, a sessão será armazenada de forma segura no diretório local configurado.


## Catálogo Completo de Comandos Suportados
Abaixo encontra-se a listagem técnica de todos os comandos integrados e seus respectivos parâmetros operacionais:

## Módulo de Navegação e Utilidades Gerais
**Comando: /menu ou /ajuda**

Descrição: Renderiza a interface visual estilizada com o índice de todos os recursos disponíveis no bot.

**Comando: /cep [Número do CEP]**

Descrição: Realiza uma requisição à API externa ViaCEP para obter o endereço completo (Rua, Bairro, Cidade, Estado, Região e DDD) a partir de um CEP de 8 dígitos informado pelo usuário.

## Módulo de Organização, Agendamento e Eventos
Comando: /evento [DD/MM] [HH:MM] [Descrição do Evento]

Descrição: Registra um novo evento corporativo ou social com data e hora específicas na memória persistente do sistema.

**Comando: /lista**

Descrição: Recupera e exibe de forma cronológica todos os eventos agendados ativos para o grupo correspondente.

**Comando: /cancelar [ID do Evento]**

Descrição: Remove em definitivo o registro de um evento com base no identificador (ID) único gerado previamente na listagem.

**Comando: /lembrete [DD/MM] [HH:MM] [Mensagem]**

Descrição: Configura um gatilho de notificação temporizada que enviará um aviso em tempo real ao atingir o horário selecionado.

## Módulo de Interação e Administração de Grupos
**Comando: /call [Mensagem]**

Descrição: Dispara um alerta global notificando e mencionando individualmente todos os participantes do chat atual em conjunto com o nome de quem executou a chamada.

**Comando: /enquete [Pergunta] | [Opção 1] | [Opção 2] ...**

Descrição: Cria uma votação interativa nativa do WhatsApp segmentando os argumentos informados através do caractere separador |.

**Comando: /infogrupo**

Descrição: Extrai e compila metadados detalhados do chat (Nome, Identificador ID, Data de criação, Fundador, Total de administradores e Link oficial de convite direto).


# Tutoriais de Execução (Passo a Passo)

## Execução no Windows (Utilizando o PowerShell)
Se você estiver desenvolvendo diretamente pelo computador utilizando o VS Code ou o terminal nativo:

Instalar o ambiente: Certifique-se de ter o [Node.js](https://nodejs.org/). instalado em sua máquina.

Abrir o Terminal: Abra o PowerShell e navegue até a pasta exata do projeto:

```bash
cd "C:\Users\konoz\Documents\Akira bot"
```

Instalar Dependências: Instale os pacotes necessários configurados no package.json:

```bash
npm install
```

Iniciar o Bot: Execute o comando de inicialização padrão:

```bash
npm start
```

Autenticação: Escaneie o QR Code que será gerado diretamente na tela do seu terminal utilizando a função "Aparelhos Conectados" do WhatsApp no celular.



# Execução no Celular (Utilizando o Termux)
Para rodar o bot diretamente em um dispositivo Android de forma independente, sem precisar manter o computador ligado:

Atualizar o sistema do [Termux](https://termux.dev/en/): Garanta que os repositórios locais estejam atualizados executando:

```bash
pkg update && pkg upgrade -y
```

nstalar dependências do sistema: O Termux precisa do Node.js e do Git (caso vá clonar de um repositório) instalados:

```bash
pkg install nodejs git -y
```

Liberar acesso ao armazenamento (Opcional): Se os arquivos do bot já estiverem na memória interna do seu aparelho, dê permissão ao Termux:

```bash
termux-setup-storage
```

Navegar até a pasta do Bot: Vá até o diretório onde os arquivos do seu robô estão salvos. Exemplo se estiver na memória interna:

```bash
cd /sdcard/Akira-bot
```

Instalar os módulos: Execute a instalação do ecossistema do Node:

```bash
npm install
```

Iniciar a aplicação: Ligue o bot no ambiente mobile:

```bash
npm start
```

## Execução em Servidores Linux (Ubuntu / Debian / VPS)
Caso decida hospedar o bot em uma VPS (Virtual Private Server) para mantê-lo online 24 horas por dia:

Atualizar os pacotes do servidor:

```bash
sudo apt update && sudo apt upgrade -y
```
Instalar o Node.js: Instale o ambiente do Node através do gerenciador oficial (recomenda-se a versão LTS):

```bash
sudo apt install nodejs npm -y
```
Entrar no diretório da aplicação:

```bash
cd /home/projetos/Akira-bot
```
Instalar dependências:

```bash
npm install
```
Execução em Segundo Plano (Recomendado): Em servidores Linux, para evitar que o bot desligue quando você fechar o terminal, utilize o gerenciador de processos pm2:

Instalar o PM2 globalmente:

```bash
sudo npm install pm2 -g
```
Iniciar o bot com o PM2:

```bash
pm2 start index.js --name "akira-bot"
```
Para monitorar o bot ou ver o QR code na VPS:

```bash
pm2 logs akira-bot
```

## Diretrizes Operacionais e Observações Técnicas
**Persistência Segura de Dados: Todos os agendamentos feitos através dos comandos de organização são salvos de forma local e automática em arquivos estruturados em JSON, prevenindo a perda de dados caso o sistema seja reiniciado.**

**Recuperação de Conexão Automatizada: O bot implementa um sistema de monitoramento de socket capaz de interceptar desconexões padrão e restaurar o estado online sem a necessidade de intervenção humana (exceto nos casos em que ocorra o erro técnico de sessão expirada 401).**

**Privilégios Administrativos: Para o correto funcionamento de recursos avançados (como a leitura do link de convite em /infogrupo), o perfil associado ao bot deve obrigatoriamente possuir o status de Administrador dentro do respectivo grupo do WhatsApp.**
