const { SlashCommandBuilder, SlashCommandStringOption } = require("@discordjs/builders");
const Discord = require('discord.js');
const promisedMySQL = require('../api/promisedMySQL');

const regions = ["EUW", "EUNE", "NA"];

module.exports = {
    commandData: new SlashCommandBuilder()
    .setName("findskin")
    .setDescription("Find accounts with a specific skin.")
    .addStringOption(new SlashCommandStringOption()
        .setDescription("The region of this acccount.")
        .setName("region")
        .setChoices(...regions.map(value => {return { name: value, value: value }}))
        .setRequired(true)
    )
    .addStringOption(new SlashCommandStringOption()
        .setDescription("The skin that you want.")
        .setName("skin")
        .setRequired(true)
    )
    .toJSON(),

    run: async(client, interaction) => {
        const then = new Date();

        const embed = new Discord.MessageEmbed();
        embed.setColor("#f9f338");
        embed.setAuthor({ name: `Fetching`, iconURL: interaction.member.displayAvatarURL() });
        embed.setDescription("Fetching the accounts from the database...");
        embed.setFooter({ text: `Accounts System` });
        embed.setTimestamp(then);

        if(interaction.options.getString("skin").includes("-")) return await interaction.reply({ content: "You can't use `-` in your searches!", ephemeral: true});
        await interaction.reply({ embeds: [ embed ] });

        const accounts = await promisedMySQL(client.connection, `SELECT * FROM accounts
            WHERE region = "${interaction.options.getString("region")}"
            AND skins LIKE "%${interaction.options.getString("skin")} %"
        `);

        console.log(accounts, interaction.options.getString("region"), interaction.options.getString("skin"));

        if(accounts.length == 0) {
            embed.setAuthor({ name: "Error", iconURL: interaction.member.displayAvatarURL() });
            embed.setColor("#db3b3b");
            embed.setDescription("There are no accounts with this skin.");
            await interaction.editReply({ embeds: [ embed ] });
        } else {
            embed.setAuthor({ name: "Found account(s) that have this skin!", iconURL: interaction.member.displayAvatarURL() });
            embed.setColor("#49e838");
            embed.setDescription(`${
                accounts.map(account => {
                    return account["tag"]
                }).join("\n")
            }`);
            await interaction.editReply({ embeds: [ embed ] });    
        }
    }
}