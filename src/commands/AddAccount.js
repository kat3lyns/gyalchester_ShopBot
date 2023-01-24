const { SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandStringOption, SlashCommandNumberOption } = require("@discordjs/builders");
const Discord = require('discord.js');
const promisedMySQL = require('../api/promisedMySQL');

const regions = ["EUW", "EUNE", "NA"];

module.exports = {
    commandData: new SlashCommandBuilder()
    .setName("addaccount")
    .setDescription("Add an account.")
    .addStringOption(new SlashCommandStringOption()
        .setDescription("The tag of the account.")
        .setName("tag")
        .setRequired(true)
    )
    .addStringOption(new SlashCommandStringOption()
        .setDescription("The region of this acccount.")
        .setName("region")
        .setChoices(...regions.map(value => {return { name: value, value: value }}))
        .setRequired(true)
    )
    .addStringOption(new SlashCommandStringOption()
        .setDescription("The amount of essence this account has.")
        .setName("essence")
        .setRequired(true)
    )
    .addStringOption(new SlashCommandStringOption()
        .setDescription("The cost to buy this account.")
        .setName("price")
        .setRequired(true)
    )
    .addStringOption(new SlashCommandStringOption()
        .setDescription("The link to buy this account.")
        .setName("buylink")
        .setRequired(true)
    )
    .addStringOption(new SlashCommandStringOption()
        .setDescription("The skins of this account, please put a space in between the skins.")
        .setName("skins")
        .setRequired(true)
    )
    .toJSON(),

    run: async(client, interaction) => {
        const then = new Date();
        if(!interaction.member.roles.cache.get(client.settings.staff_role)) return interaction.reply({ content: "You can't do this command!", ephemeral: true });

        const embed = new Discord.MessageEmbed();
        embed.setColor("#f9f338");
        embed.setAuthor({ name: `Uploading`, iconURL: interaction.member.displayAvatarURL() });
        embed.setDescription("Sending your account information to our MySQL database...");
        embed.setFooter({ text: `Accounts System` });
        embed.setTimestamp(then);

        await interaction.reply({ embeds: [ embed ] });

        await promisedMySQL(client.connection, `INSERT INTO accounts
        (id,
        tag,
        region,
        essence,
        price,
        buy_link,
        skins
        )
        VALUES
        (
            NULL,
            "${interaction.options.getString("tag")}",
            "${interaction.options.getString("region")}",
            "${interaction.options.getString("essence")}",
            "${interaction.options.getString("price")}",
            "${interaction.options.getString("buylink")}",
            "${interaction.options.getString("skins")}"
        )`);

        embed.setAuthor({ name: "Done!" });
        embed.setColor("#49e838");
        embed.setDescription("Successfully inputted the account information into MySQL.");
        await interaction.editReply({ embeds: [ embed ] });

    }
}