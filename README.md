# 🔥 Yakuza Discord Bot 💀

Bot Discord híbrido com tema dark/demoníaco desenvolvido em JavaScript puro usando discord.js. O bot oferece comandos tanto por prefixo (.) quanto por slash (/) com embeds pretos e detalhes em vermelho neon.

## 📋 Características

- **🎨 Design Demoníaco**: Embeds pretos com detalhes em vermelho neon
- **⚡ Comandos Híbridos**: Suporte a comandos com prefixo (.) e slash (/)
- **🌐 Idioma**: Respostas em português, comandos em inglês
- **📦 Deploy Ready**: Configuração pronta para DISCLOUD
- **🔧 Sistema Modular**: Comandos organizados em arquivos separados

## 🚀 Comandos Disponíveis

### 👑 Administrativos
- `.ban` ou `/ban` - Banir usuário do servidor
- `.kick` ou `/kick` - Expulsar usuário do servidor  
- `.mute` ou `/mute` - Mutar usuário (timeout)
- `.unmute` ou `/unmute` - Desmutar usuário
- `.unban` ou `/unban` - Desbanir usuário
- `.clear` ou `/clear` - Limpar mensagens do chat

### 🎭 Roleplay
- `.kiss` ou `/kiss` - Beijar alguém
- `.hug` ou `/hug` - Abraçar alguém
- `.kill` ou `/kill` - Matar alguém (roleplay)
- `.pat` ou `/pat` - Afagar alguém
- `.slap` ou `/slap` - Dar um tapa em alguém

### 🔧 Utilidades
- `.help` ou `/help` - Ajuda (enviada em DM)
- `.ping` ou `/ping` - Latência do bot
- `.avatar` ou `/avatar` - Avatar de usuário
- `.userinfo` ou `/userinfo` - Informações detalhadas do usuário

### ☁️ DISCLOUD (Apenas Owner)
- `.discloud status` ou `/discloud status` - Status do bot na DISCLOUD
- `.discloud logs` ou `/discloud logs` - Logs do bot
- `.discloud restart` ou `/discloud restart` - Reiniciar bot

## ⚙️ Configuração

### 1. Pré-requisitos
- Node.js 16.11.0 ou superior
- Uma aplicação Discord criada no [Discord Developer Portal](https://discord.com/developers/applications)
- Conta na [DISCLOUD](https://discloud.app) (opcional)

### 2. Variáveis de Ambiente
Configure as seguintes variáveis de ambiente:

```env
DISCORD_TOKEN=seu_token_do_discord
CLIENT_ID=id_da_aplicacao_discord
BOT_OWNER_ID=seu_id_do_discord
TENOR_API_KEY=chave_api_tenor (opcional)
DISCLOUD_API_KEY=chave_api_discloud (opcional)
```

### 3. Obter Tokens

#### Discord Token:
1. Acesse o [Discord Developer Portal](https://discord.com/developers/applications)
2. Crie uma nova aplicação ou selecione uma existente
3. Vá em "Bot" → "Token" → "Copy"

#### Client ID:
1. No Discord Developer Portal, vá em "General Information"
2. Copie o "Application ID"

#### Seu Discord ID:
1. Ative o "Modo Desenvolvedor" no Discord (Configurações → Avançado)
2. Clique com botão direito no seu nome e "Copiar ID"

#### Tenor API Key (Opcional):
1. Registre-se em: https://tenor.com/developer/keyregistration
2. Crie uma nova aplicação e copie a API Key

#### DISCLOUD API Key (Opcional):
1. Faça login na [DISCLOUD](https://discloud.app)
2. Vá em "Perfil" → "API" → "Gerar Token"

### 4. Instalação
```bash
# Clone o repositório
git clone <seu-repositorio>
cd yakuza-discord-bot

# Instale as dependências
npm install

# Inicie o bot
npm start
```

## 🔗 Convite do Bot

Para adicionar o bot ao seu servidor, use este link (substitua CLIENT_ID pelo ID da sua aplicação):

```
https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

### Permissões Necessárias:
- 📝 Ler e enviar mensagens
- 🔗 Usar comandos de barra
- 👑 Gerenciar mensagens, membros e cargos (para comandos admin)
- 🖼️ Anexar arquivos e usar emojis externos

## ☁️ Deploy na DISCLOUD

### 1. Configuração
O arquivo `discloud.config` já está configurado. Atualize apenas:
```
ID=SEU_BOT_ID_AQUI
```

### 2. Upload
1. Compacte todos os arquivos (exceto node_modules)
2. Faça upload no painel da DISCLOUD
3. O bot iniciará automaticamente

### 3. Gerenciamento
Use os comandos `.discloud` para monitorar o bot:
- Status, logs e restart remotos
- Apenas o owner pode usar estes comandos

## 📁 Estrutura do Projeto

```
yakuza-discord-bot/
├── index.cjs                 # Arquivo principal do bot
├── commands/                 # Diretório dos comandos
│   ├── help.cjs             # Comando de ajuda
│   ├── ban.cjs              # Comando de ban
│   ├── kick.cjs             # Comando de kick
│   ├── mute.cjs             # Comando de mute
│   ├── unmute.cjs           # Comando de unmute
│   ├── unban.cjs            # Comando de unban
│   ├── clear.cjs            # Comando de clear
│   ├── kiss.cjs             # Comando de roleplay
│   ├── hug.cjs              # Comando de roleplay
│   ├── kill.cjs             # Comando de roleplay
│   ├── pat.cjs              # Comando de roleplay
│   ├── slap.cjs             # Comando de roleplay
│   ├── ping.cjs             # Comando de ping
│   ├── avatar.cjs           # Comando de avatar
│   ├── userinfo.cjs         # Comando de informações
│   └── discloud.cjs         # Comandos DISCLOUD
├── discloud.config          # Configuração DISCLOUD
├── package.json             # Dependências do projeto
└── README.md               # Este arquivo
```

## 🎨 Personalização

### Cores do Tema
```javascript
const colors = {
    primary: 0x000000,    // Preto
    accent: 0xFF0033,     // Vermelho neon
    success: 0x00FF00,    // Verde (sucesso)
    error: 0xFF0000       // Vermelho (erro)
};
```

### Footer Padrão
Todos os embeds incluem o footer: **"Yakuza — by liro"**

## 🔧 Desenvolvimento

### Adicionar Novos Comandos
1. Crie um arquivo `.cjs` na pasta `commands/`
2. Use o template:

```javascript
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'nome',
    aliases: ['alias1', 'alias2'],
    description: 'Descrição do comando',
    
    slashData: new SlashCommandBuilder()
        .setName('nome')
        .setDescription('Descrição do comando'),
    
    async execute(message, args, client, config, colors, createYakuzaEmbed) {
        // Lógica do comando com prefixo
    },
    
    async executeSlash(interaction, client, config, colors, createYakuzaEmbed) {
        // Lógica do comando slash
    }
};
```

### Debugging
- Logs detalhados no console
- Tratamento de erros em todos os comandos
- Interações de botão implementadas

## 🐛 Problemas Comuns

### Bot não conecta
- ✅ Verifique se o TOKEN está correto
- ✅ Confirme as intenções (intents) necessárias
- ✅ Certifique-se que o bot tem permissões

### Comandos não funcionam
- ✅ Verifique se os comandos foram registrados
- ✅ Confirme as permissões do bot no servidor
- ✅ Veja os logs de erro no console

### GIFs não aparecem
- ✅ Configure a TENOR_API_KEY
- ✅ Verifique sua cota da API Tenor

## 📞 Suporte

Para reportar bugs ou solicitar recursos:
1. Verifique os logs de erro
2. Teste em ambiente de desenvolvimento
3. Documente o problema com detalhes

## 📜 Licença

Este projeto é licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

---

** Desenvolvido no ódio por lirobabyxoxo**

*"A família Yakuza protege o que é importante."*


####### OBS: Talvez o comando do Disclouds pode dar erro, é só atualizar a **API key** e ta tudo certo ;)

