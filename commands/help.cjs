const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['ajuda', 'comandos'],
    description: 'Mostra todos os comandos disponíveis',
    
    slashData: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Mostra todos os comandos disponíveis'),
    
    async execute(message, args, client, config, colors, createYakuzaEmbed) {
        await sendHelpMessage(message.author, message, null, config, colors, createYakuzaEmbed);
    },
    
    async executeSlash(interaction, client, config, colors, createYakuzaEmbed) {
        await sendHelpMessage(interaction.user, null, interaction, config, colors, createYakuzaEmbed);
    }
};

async function sendHelpMessage(user, message, interaction, config, colors, createYakuzaEmbed) {
    const helpEmbed = createYakuzaEmbed(
        '<:seta2:1421174896960213174> **precisando de ajuda?**',
        'saca só os comandos que eu tenho:',
        colors.accent
    );
    
    // Comandos de Administração
    helpEmbed.addFields({
        name: '> **admin**',
        value: '```\n' +
            `${config.prefix}ban [@usuário] [motivo] - Banir usuário\n` +
            `${config.prefix}kick [@usuário] [motivo] - Expulsar usuário\n` +
            `${config.prefix}mute [@usuário] [tempo] [motivo] - Mutar usuário (1s a 28d)\n` +
            `${config.prefix}unmute [@usuário] - Desmutar usuário\n` +
            `${config.prefix}unban [ID] - Desbanir usuário\n` +
            `${config.prefix}clear [número] - Limpar mensagens (1-100)\n` +
            '```',
        inline: false
    });
    
    // Comandos de Roleplay
    helpEmbed.addFields({
        name: '> roleplay',
        value: '```\n' +
            `${config.prefix}kiss [@usuário] - Beijar alguém\n` +
            `${config.prefix}hug [@usuário] - Abraçar alguém\n` +
            `${config.prefix}kill [@usuário] - Matar alguém\n` +
            `${config.prefix}pat [@usuário] - Afagar alguém\n` +
            `${config.prefix}slap [@usuário] - Dar um tapa\n` +
            '```',
        inline: false
    });
    
    // Comandos Utilitários
    helpEmbed.addFields({
        name: '> utilitários',
        value: '```\n' +
            `${config.prefix}avatar [@usuário] - Mostrar avatar\n` +
            `${config.prefix}userinfo [@usuário] - Informações do usuário\n` +
            `${config.prefix}ping - Ping do bot\n` +
            `${config.prefix}help - Esta mensagem\n` +
            '```',
        inline: false
    });
    
    helpEmbed.addFields({
        name: '> tu sabia?',
        value: `**todos os comandos funcionam com prefixo (\`${config.prefix}\`) ou slash commands (/)\n🔥 Exemplo: \`${config.prefix}\`help ou /help**`,
        inline: false
    });
    
    try {
        // Enviar no DM do usuário
        await user.send({ embeds: [helpEmbed] });
        
        // Resposta confirmando o envio
        const confirmEmbed = createYakuzaEmbed(
            '<:seta2:1421174896960213174> te explico tudo certinho',
            'olha pv :smirk:',
            colors.success
        );
        
        if (message) {
            await message.reply({ embeds: [confirmEmbed] });
        } else if (interaction) {
            await interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
        }
        
    } catch (error) {
        // Se não conseguir enviar DM
        const errorEmbed = createYakuzaEmbed(
            '❌ Erro',
            'Abre o pv ae pORRA, não consegui te mandar a mensagem.',
            colors.error
        );
        
        if (message) {
            await message.reply({ embeds: [errorEmbed] });
        } else if (interaction) {
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
}