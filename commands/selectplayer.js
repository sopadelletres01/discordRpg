const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const wait = require('util').promisify(setTimeout);

const tree = require('../tree.json');

const DisplayButton = ( {title,description,question,buttons},buttonDisabled =  false ) =>{
    const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId(buttons[0].id)
            .setLabel(buttons[0].content)
            .setStyle('PRIMARY')
            .setDisabled(buttonDisabled),
        new MessageButton()
            .setCustomId(buttons[1].id)
            .setLabel(buttons[1].content)
            .setStyle('SECONDARY')
            .setDisabled(buttonDisabled)
    );

    const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(title)
        .setDescription(`${description}\n\n${question}`);
    return [row,embed];
}



const players = [
    {
        name:"Player1",
        id:"0",
        tree:tree,
        intro:{
            title: "Bienvenido",
            description: "Adentrate en las profundidades de la mazmorra",
            question: "Hacia donde quieres ir?",
            buttons:[
                {
                    id:"1",
                    content:"Dar marcha atras"
                },
                {
                    id:"2",
                    content:"Dar marcha adelante"
                }
            ]
        }
    },
    {
        name:"Player2",
        id:"1",
        tree:tree
    },
    {
        name:"Player3",
        id:"2",
        tree:tree
    },
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('selectplayer')
		.setDescription('Selecciona un jugador para empezar...')
        .addStringOption(option =>
			option.setName('name')
				.setDescription('introduce the user name')
				.setRequired(true)
				.addChoice('Player1', players[0].id)
				.addChoice('Player2', players[1].id)
				.addChoice('Player3', players[2].id)),
	async execute(interaction) {
        const {name,type,value} = interaction.options.data[0];
        const player = players[Number(value)]
		const {tree,intro} = player;

        const [row,embed] = DisplayButton(intro);
        const message = await interaction.reply({ ephemeral: true, embeds: [embed], components: [row], fetchReply:true });
        const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 99999 });
        const DEEP_LVL = 1;
        let count = 0;

        collector.on('collect', async i => {
            let id = i.customId;
            let box = tree.find(branch=>branch.id===id)

            if (count >= DEEP_LVL) {
                let [row,embed] = DisplayButton(box,true);
                interaction.editReply({embeds:[embed],components:[row]})    
                i.reply('Has acabado la aventura...');
                collector.stop("Has acabado la aventura...");
            }

            let [row,embed] = DisplayButton(box);
            interaction.editReply({embeds:[embed],components:[row]})    



            count+=1
            /* for (let index = 0; index < DEEP_LVL; index++) {
                let message = await i.reply({ ephemeral: true, embeds: [embed], components: [row], fetchReply:true });
                let collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });
                collector.on("collect",inter=>{
                    id = inter.customId;
                    box = tree.find(branch=>branch.id===id)
                })
            } */


        })
        
        
        collector.on('end', collected => {
            console.log(`Collected ${collected.size} interactions.`);
        });



        /* await interaction.reply('Pong!');
		await wait(2000);
		await interaction.editReply('Pong again!');
		await wait(1000);
		await interaction.followUp({content:'Pong again!',ephemeral:true}); */
	},
};