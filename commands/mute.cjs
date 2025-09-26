const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'mute',
    description: 'Mutar um usuário por um tempo específico',
    
    slashData: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mutar um usuário por um tempo específico')
        .addUserOption(option =>
            option.setName('usuário')
                .setDescription('Usuário a ser mutado')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('tempo')
                .setDescription('Tempo do mute (ex: 1m, 1h, 1d)')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Motivo do mute')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    
    async execute(message, args, client, config, colors, createYakuzaEmbed) {
        if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            const errorEmbed = createYakuzaEmbed(
                '❌ Sem Permissão',
                'Você não tem permissão para mutar membros.',
                colors.error
            );
            return await message.reply({ embeds: [errorEmbed] });
        }

        const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
        if (!user) {
            const errorEmbed = createYakuzaEmbed(
                '❌ Usuário Inválido',
                'Por favor, mencione um usuário válido ou forneça um ID.',
                colors.error
            );
            return await message.reply({ embeds: [errorEmbed] });
        }

        const member = message.guild.members.cache.get(user.id);
        if (!member) {
            const errorEmbed = createYakuzaEmbed(
                '❌ Membro Não Encontrado',
                'Este usuário não está no servidor.',
                colors.error
            );
            return await message.reply({ embeds: [errorEmbed] });
        }

        const timeStr = args[1];
        const reason = args.slice(2).join(' ') || 'Motivo não especificado';

        await muteUser(member, timeStr, reason, message.author, message, null, colors, createYakuzaEmbed);
    },
    
    async executeSlash(interaction, client, config, colors, createYakuzaEmbed) {
        const user = interaction.options.getUser('usuário');
        const timeStr = interaction.options.getString('tempo');
        const reason = interaction.options.getString('motivo') || 'Motivo não especificado';
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            const errorEmbed = createYakuzaEmbed(
                '❌ Membro Não Encontrado',
                'Este usuário não está no servidor.',
                colors.error
            );
            return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        await muteUser(member, timeStr, reason, interaction.user, null, interaction, colors, createYakuzaEmbed);
    }
};

function parseTime(timeStr) {
    const regex = /(\d+)([smhd])/i;
    const match = timeStr.match(regex);
    
    if (!match) return null;
    
    const amount = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    
    let milliseconds = 0;
    
    switch (unit) {
        case 's':
            milliseconds = amount * 1000;
            break;
        case 'm':
            milliseconds = amount * 60 * 1000;
            break;
        case 'h':
            milliseconds = amount * 60 * 60 * 1000;
            break;
        case 'd':
            milliseconds = amount * 24 * 60 * 60 * 1000;
            break;
    }
    
    // Máximo 28 dias (limite do Discord)
    const maxTime = 28 * 24 * 60 * 60 * 1000;
    if (milliseconds > maxTime) return null;
    
    return milliseconds;
}

function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
}

async function muteUser(member, timeStr, reason, executor, message, interaction, colors, createYakuzaEmbed) {
    try {
        const duration = parseTime(timeStr);
        
        if (!duration) {
            const errorEmbed = createYakuzaEmbed(
                '❌ Tempo Inválido',
                'Formato de tempo inválido. Use: 1s, 1m, 1h, 1d (máximo 28 dias)',
                colors.error
            );
            
            if (message) {
                return await message.reply({ embeds: [errorEmbed] });
            } else {
                return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }

        // Verificações de hierarquia
        const executorMember = message ? message.member : interaction.member;
        
        if (member.roles.highest.position >= executorMember.roles.highest.position) {
            const errorEmbed = createYakuzaEmbed(
                '❌ Hierarquia Insuficiente',
                'Você não pode mutar este usuário devido à hierarquia de cargos.',
                colors.error
            );
            
            if (message) {
                return await message.reply({ embeds: [errorEmbed] });
            } else {
                return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
        
        if (!member.moderatable) {
            const errorEmbed = createYakuzaEmbed(
                '❌ Não Moderável',
                'Não posso mutar este usuário. Verifique minhas permissões e a hierarquia.',
                colors.error
            );
            
            if (message) {
                return await message.reply({ embeds: [errorEmbed] });
            } else {
                return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }

        // Tentar enviar DM antes do mute
        try {
            const dmEmbed = createYakuzaEmbed(
                '🔇 Você foi mutado!',
                `**Servidor:** ${member.guild.name}\n**Tempo:** ${formatTime(duration)}\n**Motivo:** ${reason}\n**Moderador:** ${executor.tag}`,
                colors.accent
            );
            await member.user.send({ embeds: [dmEmbed] });
        } catch (error) {
            // Ignorar se não conseguir enviar DM
        }

        // Executar o mute
        await member.timeout(duration, `${reason} - Mutado por: ${executor.tag}`);

        // Embed de confirmação
        const successEmbed = createYakuzaEmbed(
            '🔇 Usuário Mutado',
            `💀 **Usuário:** ${member.user.tag} (${member.user.id})\n⏰ **Tempo:** ${formatTime(duration)}\n🩸 **Motivo:** ${reason}\n⚡ **Moderador:** ${executor.tag}`,
            colors.accent
        );

        if (message) {
            await message.reply({ embeds: [successEmbed] });
        } else {
            await interaction.reply({ embeds: [successEmbed] });
        }

    } catch (error) {
        console.error('Erro ao mutar usuário:', error);
        
        const errorEmbed = createYakuzaEmbed(
            '❌ Erro no Mute',
            'Ocorreu um erro ao tentar mutar o usuário.',
            colors.error
        );
        
        if (message) {
            await message.reply({ embeds: [errorEmbed] });
        } else {
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
}