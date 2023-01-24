const { SlashCommandBuilder, SlashCommandStringOption } = require("@discordjs/builders");
const Discord = require('discord.js');
const promisedMySQL = require('../api/promisedMySQL');

module.exports = {
    commandData: new SlashCommandBuilder()
    .setName("removeaccount")
    .setDescription("Remove an account.")
    .addStringOption(new SlashCommandStringOption()
        .setDescription("The tag of the account.")
        .setName("tag")
        .setRequired(true)
    )
    .toJSON(),

    run: async(client, interaction) => {
        const then = new Date();
        if(!interaction.member.roles.cache.get(client.settings.staff_role)) return interaction.reply({ content: "You can't do this command!", ephemeral: true });

        const embed = new Discord.MessageEmbed();
        embed.setColor("#f9f338");
        embed.setAuthor({ name: `Removing`, iconURL: interaction.member.displayAvatarURL() });
        embed.setDescription("Removing the account from the database...");
        embed.setFooter({ text: `Accounts System` });
        embed.setTimestamp(then);

        await interaction.reply({ embeds: [ embed ] });

        const accounts = await promisedMySQL(client.connection, `DELETE FROM accounts
            WHERE tag = "${interaction.options.getString("tag")}"
        `);

        embed.setAuthor({ name: "Deleted!", iconURL: interaction.member.displayAvatarURL() });
        embed.setColor("#49e838");
        embed.setDescription(`If there an account with that tag, it's gone now!`);
        await interaction.editReply({ embeds: [ embed ] });    
    }
}