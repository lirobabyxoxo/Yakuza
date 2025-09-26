const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'kill',
    aliases: ['matar'],
    description: 'Matar alguém (roleplay)',
    
    slashData: new SlashCommandBuilder()
        .setName('kill')
        .setDescription('Matar alguém (roleplay)')
        .addUserOption(option =>
            option.setName('usuário')
                .setDescription('Usuário para matar')
                .setRequired(true)
        ),
    
    async execute(message, args, client, config, colors, createYakuzaEmbed) {
        const target = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
        
        if (!target) {
            const errorEmbed = createYakuzaEmbed(
                '❌ Usuário Inválido',
                'Por favor, mencione um usuário para matar.',
                colors.error
            );
            return await message.reply({ embeds: [errorEmbed] });
        }
        
        await performRoleplay('kill', message.author, target, message, null, config, colors, createYakuzaEmbed);
    },
    
    async executeSlash(interaction, client, config, colors, createYakuzaEmbed) {
        const target = interaction.options.getUser('usuário');
        await performRoleplay('kill', interaction.user, target, null, interaction, config, colors, createYakuzaEmbed);
    }
};

async function performRoleplay(action, author, target, message, interaction, config, colors, createYakuzaEmbed) {
    try {
        // Verificar se está tentando fazer ação em si mesmo
        if (author.id === target.id) {
            const selfEmbed = createYakuzaEmbed(
                '❌ Suicídio Não Permitido',
                'Você não pode se matar! O Yakuza não permite isso! 💀',
                colors.error
            );
            
            if (message) {
                return await message.reply({ embeds: [selfEmbed] });
            } else {
                return await interaction.reply({ embeds: [selfEmbed], ephemeral: true });
            }
        }
        
        // Buscar GIF de anime
        const gifUrl = await getAnimeGif(action, config.tenorApiKey);
        
        // Mensagens para cada ação
        const messages = {
            kill: [
                `💀 **${author.username}** eliminou **${target.username}** com estilo Yakuza! 🔥`,
                `💀 **${target.username}** foi enviado para o além por **${author.username}**! 🩸`,
                `💀 **${author.username}** executou **${target.username}** friamente! ⚡`,
                `💀 RIP **${target.username}** - vítima de **${author.username}**! 🔥`
            ]
        };
        
        const randomMessage = messages[action][Math.floor(Math.random() * messages[action].length)];
        
        const roleplayEmbed = createYakuzaEmbed(
            '💀 Execução Demoníaca',
            randomMessage,
            colors.error
        );
        
        if (gifUrl) {
            roleplayEmbed.setImage(gifUrl);
        }
        
        roleplayEmbed.addFields({
            name: '⚠️ Aviso',
            value: 'Este é apenas um roleplay! Nenhum usuário foi ferido na gravação desta mensagem.',
            inline: false
        });
        
        if (message) {
            await message.reply({ embeds: [roleplayEmbed] });
        } else {
            await interaction.reply({ embeds: [roleplayEmbed] });
        }
        
    } catch (error) {
        console.error('Erro no comando de roleplay:', error);
        
        const errorEmbed = createYakuzaEmbed(
            '❌ Erro',
            'Ocorreu um erro ao executar esta ação.',
            colors.error
        );
        
        if (message) {
            await message.reply({ embeds: [errorEmbed] });
        } else {
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
}

async function getAnimeGif(action, apiKey) {
    try {
        if (!apiKey) return null;
        
        const searchTerms = {
            kill: 'anime fight attack dark',
        };
        
        const response = await axios.get(`https://tenor.googleapis.com/v2/search`, {
            params: {
                q: searchTerms[action] || action,
                key: apiKey,
                client_key: 'yakuza_discord_bot',
                limit: 20,
                media_filter: 'gif',
                contentfilter: 'medium'
            },
            timeout: 5000
        });
        
        if (response.data && response.data.results && response.data.results.length > 0) {
            const randomGif = response.data.results[Math.floor(Math.random() * response.data.results.length)];
            return randomGif.media_formats.gif.url;
        }
        
        return null;
    } catch (error) {
        console.error('Erro ao buscar GIF:', error);
        return null;
    }
}