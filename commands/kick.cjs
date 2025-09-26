const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Expulsar um usuário do servidor',
    
    slashData: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Expulsar um usuário do servidor')
        .addUserOption(option =>
            option.setName('usuário')
                .setDescription('Usuário a ser expulso')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Motivo da expulsão')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    
    async execute(message, args, client, config, colors, createYakuzaEmbed) {
        if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            const errorEmbed = createYakuzaEmbed(
                '❌ Sem Permissão',
                'Você não tem permissão para expulsar membros.',
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

        const reason = args.slice(1).join(' ') || 'Motivo não especificado';
        await kickUser(member, reason, message.author, message, null, colors, createYakuzaEmbed);
    },
    
    async executeSlash(interaction, client, config, colors, createYakuzaEmbed) {
        const user = interaction.options.getUser('usuário');
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

        await kickUser(member, reason, interaction.user, null, interaction, colors, createYakuzaEmbed);
    }
};

async function kickUser(member, reason, executor, message, interaction, colors, createYakuzaEmbed) {
    try {
        // Verificações de hierarquia
        const executorMember = message ? message.member : interaction.member;
        
        if (member.roles.highest.position >= executorMember.roles.highest.position) {
            const errorEmbed = createYakuzaEmbed(
                '❌ Hierarquia Insuficiente',
                'Você não pode expulsar este usuário devido à hierarquia de cargos.',
                colors.error
            );
            
            if (message) {
                return await message.reply({ embeds: [errorEmbed] });
            } else {
                return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
        
        if (!member.kickable) {
            const errorEmbed = createYakuzaEmbed(
                '❌ Não Expulsável',
                'Não posso expulsar este usuário. Verifique minhas permissões e a hierarquia.',
                colors.error
            );
            
            if (message) {
                return await message.reply({ embeds: [errorEmbed] });
            } else {
                return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }

        // Tentar enviar DM antes do kick
        try {
            const dmEmbed = createYakuzaEmbed(
                '👢 Você foi expulso!',
                `**Servidor:** ${member.guild.name}\n**Motivo:** ${reason}\n**Moderador:** ${executor.tag}`,
                colors.accent
            );
            await member.user.send({ embeds: [dmEmbed] });
        } catch (error) {
            // Ignorar se não conseguir enviar DM
        }

        // Executar a expulsão
        await member.kick(`${reason} - Expulso por: ${executor.tag}`);

        // Embed de confirmação
        const successEmbed = createYakuzaEmbed(
            '👢 Usuário Expulso',
            `💀 **Usuário:** ${member.user.tag} (${member.user.id})\n🩸 **Motivo:** ${reason}\n⚡ **Moderador:** ${executor.tag}`,
            colors.accent
        );

        if (message) {
            await message.reply({ embeds: [successEmbed] });
        } else {
            await interaction.reply({ embeds: [successEmbed] });
        }

    } catch (error) {
        console.error('Erro ao expulsar usuário:', error);
        
        const errorEmbed = createYakuzaEmbed(
            '❌ Erro na Expulsão',
            'Ocorreu um erro ao tentar expulsar o usuário.',
            colors.error
        );
        
        if (message) {
            await message.reply({ embeds: [errorEmbed] });
        } else {
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
}