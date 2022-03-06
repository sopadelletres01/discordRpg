const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Shows user info!')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('introduce the user name')
				.setRequired(true)
				.addChoice('Funny', 'gif_funny')
				.addChoice('Meme', 'gif_meme')
				.addChoice('Movie', 'gif_movie')),
	async execute(interaction) {
		console.log("interaction",interaction)
        await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	},
};