const { SlashCommandBuilder, SlashCommandStringOption } = require("@discordjs/builders");
const Discord = require('discord.js');
const promisedMySQL = require('../api/promisedMySQL');

const regions = ["EUW", "EUNE", "NA"];

module.exports = {
    commandData: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Roll a random account.")
    .addStringOption(new SlashCommandStringOption()
        .setDescription("The region of this acccount.")
        .setName("region")
        .setChoices(...regions.map(value => {return { name: value, value: value }}))
        .setRequired(true)
    ),

    run: async(client, interaction) => {
        const then = new Date();

        const embed = new Discord.MessageEmbed();
        embed.setColor("#f9f338");
        embed.setAuthor({ name: `Fetching`, iconURL: interaction.member.displayAvatarURL() });
        embed.setDescription("Fetching an account from the database...");
        embed.setFooter({ text: `Accounts System` });
        embed.setTimestamp(then);

        await interaction.reply({ embeds: [ embed ] });

        const accounts = await promisedMySQL(client.connection, `SELECT * FROM accounts
            WHERE region = "${interaction.options.getString("region")}"
            ORDER BY RAND()
            LIMIT 1
        `);

        if(accounts.length == 0) {
            embed.setAuthor({ name: "Error", iconURL: interaction.member.displayAvatarURL() });
            embed.setColor("#db3b3b");
            embed.setDescription("There are no accounts with this skin.");
            await interaction.editReply({ embeds: [ embed ] });
        } else {
            embed.setAuthor({ name: "Here's the Account Information!", iconURL: interaction.member.displayAvatarURL() });
            embed.setColor("#49e838");
            embed.setDescription(`**Database ID** ${accounts[0]["id"]}\n**Tag** ${accounts[0]["tag"]}\n**Region** ${accounts[0]["region"]}\n**Essence** ${accounts[0]["essence"]}\n**Price** ${accounts[0]["price"]}\n**Skins** ${accounts[0]["skins"]}\n\n**Buy Link** ${accounts[0]["buy_link"]}`);
            await interaction.editReply({ embeds: [ embed ] });
        }
    }
}