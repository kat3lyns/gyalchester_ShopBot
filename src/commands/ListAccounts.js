const { SlashCommandBuilder, SlashCommandStringOption } = require("@discordjs/builders");
const Discord = require('discord.js');
const promisedMySQL = require('../api/promisedMySQL');

module.exports = {
    commandData: new SlashCommandBuilder()
    .setName("listaccounts")
    .setDescription("List the accounts in the database."),

    run: async(client, interaction) => {
        const then = new Date();
        if(!interaction.member.roles.cache.get(client.settings.staff_role)) return interaction.reply({ content: "You can't do this command!", ephemeral: true });

        const embed = new Discord.MessageEmbed();
        embed.setColor("#f9f338");
        embed.setAuthor({ name: `Fetching`, iconURL: interaction.member.displayAvatarURL() });
        embed.setDescription("Fetching the accounts from the database...");
        embed.setFooter({ text: `Accounts System` });
        embed.setTimestamp(then);

        await interaction.reply({ embeds: [ embed ] });

        const accounts = await promisedMySQL(client.connection, `SELECT * FROM accounts`);

        embed.setAuthor({ name: "Accounts List", iconURL: interaction.member.displayAvatarURL() });
        embed.setColor("#49e838");
        embed.setDescription(`Loaded ${accounts.length} accounts from the database!\n\n${
            accounts.map(account =>
                `**${account["tag"]} | ** Region: ${account["region"]}, Price: $${account["price"]} (dbId ${account["id"]})`
            ).join("\n")
        }`);
        await interaction.editReply({ embeds: [ embed ] });
    }
}