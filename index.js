import axios from 'axios'
import { WebhookClient, EmbedBuilder } from 'discord.js'
import 'dotenv/config'

const webhookClient = new WebhookClient({
	url: process.env.DISCORD_WEBHOOK,
})

async function GetServerData() {
	const embed = new EmbedBuilder()
		.setTitle('Majestic Online Parser')
		.setColor(0xe0015b)
		.setDescription('Актуальный онлайн на серверах Majestic')
		.setTimestamp()

	await axios
		.get('https://api1master.majestic-files.com/meta/servers')
		.then((res) => {
			function compareIds(a, b) {
				const idA = parseInt(a.id.match(/\d+/)[0])
				const idB = parseInt(b.id.match(/\d+/)[0])
				return idA - idB
			}

			res.data.result.servers.sort(compareIds)

			res.data.result.servers.map((server) => {
				if (server.region == 'ru') {
					const online =
						'`' + `Игроков: ${server.players}/${server.queue}` + '`'
					embed.addFields({
						name: `${server.name}   ${
							server.status ? ':green_circle:' : ':red_circle:'
						}`,
						value: online,
					})
				}
			})
		})
		.catch((err) => {
			console.log(err)
		})

	webhookClient.editMessage('1246343361799917570', {
		embeds: [embed],
	})
	console.log('updated')
}

GetServerData()
setInterval(GetServerData, 20000)
