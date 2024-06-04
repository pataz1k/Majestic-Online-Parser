import axios from 'axios'
import { WebhookClient, EmbedBuilder } from 'discord.js'
import 'dotenv/config'
import { writeMessageIdToJson, readMessageIdFromJson } from './jsonRequests.js'

const webhookClient = new WebhookClient({
	url: process.env.DISCORD_WEBHOOK,

})

webhookClient.edit({ 
	name: process.env.WEBHOOK_NAME,
	avatar: process.env.WEBHOOK_AVATAR
})

async function GetServerData() {
	const embed = new EmbedBuilder()
		.setTitle('Majestic Online Parser')
		.setColor(0xe0015b)
		.setDescription('Актуальный онлайн на серверах Majestic')
		.setTimestamp()
		.setFooter({
			text: 'dev by @pataz1k',
		})

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
						'`' +
						`Игроков: ${server.players}/${server.queue}. ` +
						`${
							server.players - server.queue > 0
								? "Очередь: " + (server.players - server.queue)
								: ""
						}` +
						'`'
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

	readMessageIdFromJson().then((res) => {
		if (res) {
			//* ID присутствует
				webhookClient.editMessage(res, {
					embeds: [embed],
				}).catch(err => {
					if (err.code == 10008) {
						writeMessageIdToJson("")
						GetServerData()
					}
				})
		} else {
			//* ID отсутствует
			const message = webhookClient.send({
				embeds: [embed],
				name: process.env.WEBHOOK_NAME,
				avatar: process.env.WEBHOOK_AVATAR
			})
			message.then((res) => {
				writeMessageIdToJson(res.id)
			})
		}
	})

	console.log('updated')
}

GetServerData()
setInterval(GetServerData, 20000)
