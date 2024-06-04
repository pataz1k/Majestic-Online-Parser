import { writeFileSync, readFileSync, existsSync, writeFile } from 'fs'

// Функция для записи строки в JSON файл
export const writeMessageIdToJson = (messageId) => {
	if (checkIsFileCreated()) {
		const data = JSON.stringify({ messageId })
		writeFileSync('data.json', data)
		
	}
}

// Функция для получения строки из JSON файла
export const readMessageIdFromJson = async () => {
	try {
		if (checkIsFileCreated()) {
			const data = readFileSync('data.json')
			const { messageId } = JSON.parse(data)
			return messageId
		}
	} catch (err) {
		console.log('Ошибка чтения файла:', err)
		return null
	}
}

const checkIsFileCreated = () => {
	if (!existsSync('data.json')) {
		const fileContent = { messageId: '' }

		writeFile('data.json', JSON.stringify(fileContent), (err) => {
			if (err) {
				console.log('Ошибка', err)
				return false
			} else {
				console.log("Файл создан")
				return true
			}
		})
	} else {
		console.log("Файл уже был создан")
		return true
	}
}
