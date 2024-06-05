import { readFile } from 'fs'
import { WebhookClient, EmbedBuilder } from 'discord.js'
import fs from 'fs/promises'
import axios from 'axios'

async function getServerData() {
    readFile('data.json', 'utf-8', async (err, data) => {
        if (err) {
            console.log(err)
            return
        }
    
        const serversData = JSON.parse(data)
    
        const servers = serversData.servers
    
        await servers.map(async (serverData) => {
            const webhookClient = new WebhookClient({
                url: serverData.link,
            })
    
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
                                        ? 'Очередь: ' + (server.players - server.queue)
                                        : ''
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
    
            if (serverData.messageId) {
                webhookClient.editMessage(serverData.messageId, {
                    embeds: [embed],
                }).catch(err => {
                    if (err.code == 10008) {
                        updateServerData(serverData.serverName, "")
                    }
                })
            } else {
                const message = webhookClient.send({
                    embeds: [embed],
                })
                message.then((res) => {
                    updateServerData(serverData.serverName, res.id)
                })
            }
        })
    })
}

async function updateServerData(serverName, newMessageId) {
	try {
		// Читаем файл data.json
		let data = await fs.readFile('data.json', 'utf8')

		// Преобразуем JSON в объект
		const jsonData = JSON.parse(data)

		// Находим сервер с определенным serverName
		const serverToUpdate = jsonData.servers.find(
			(server) => server.serverName === serverName
		)

		// Если сервер найден, обновляем его данные
		if (serverToUpdate) {
			serverToUpdate.messageId = newMessageId
		} else {
			console.log('Сервер не найден.')
			return
		}

		// Записываем обновленные данные обратно в файл
		await fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), 'utf8')
		console.log('Данные успешно обновлены.')
	} catch (err) {
		console.error(err)
	}
}

setInterval(getServerData, 20000)