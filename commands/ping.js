const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const collector = await message.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });
		await interaction.reply('Pong!');
		await wait(2000);
		await interaction.editReply('Pong again!');
		await wait(1000);
		await interaction.followUp({content:'Pong again!',ephemeral:true});
	},
};