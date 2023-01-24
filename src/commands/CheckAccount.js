const { SlashCommandBuilder, SlashCommandStringOption } = require("@discordjs/builders");
const Discord = require('discord.js');
const promisedMySQL = require('../api/promisedMySQL');

module.exports = {
    commandData: new SlashCommandBuilder()
    .setName("checkaccount")
    .setDescription("Check an account.")
    .addStringOption(new SlashCommandStringOption()
        .setDescription("The tag of the account.")
        .setName("tag")
        .setRequired(true)
    )
    .toJSON(),

    run: async(client, interaction) => {
        const then = new Date();

        const embed = new Discord.MessageEmbed();
        embed.setColor("#f9f338");
        embed.setAuthor({ name: `Fetching`, iconURL: interaction.member.displayAvatarURL() });
        embed.setDescription("Fetching the account from the database...");
        embed.setFooter({ text: `Accounts System` });
        embed.setTimestamp(then);

        await interaction.reply({ embeds: [ embed ] });

        const accounts = await promisedMySQL(client.connection, `SELECT * FROM accounts
            WHERE tag = "${interaction.options.getString("tag")}"
        `);

        if(accounts.length == 0) {
            embed.setAuthor({ name: "Error", iconURL: interaction.member.displayAvatarURL() });
            embed.setColor("#db3b3b");
            embed.setDescription("This account doesn't exist.");
            await interaction.editReply({ embeds: [ embed ] });
        } else {
            embed.setAuthor({ name: "Here's the Account Information!", iconURL: interaction.member.displayAvatarURL() });
            embed.setColor("#49e838");
            embed.setDescription(`**Database ID** ${accounts[0]["id"]}\n**Tag** ${accounts[0]["tag"]}\n**Region** ${accounts[0]["region"]}\n**Essence** ${accounts[0]["essence"]}\n**Price** ${accounts[0]["price"]}\n**Skins** ${accounts[0]["skins"]}\n\n**Buy Link** ${accounts[0]["buy_link"]}`);
            await interaction.editReply({ embeds: [ embed ] });    
        }
    }
}