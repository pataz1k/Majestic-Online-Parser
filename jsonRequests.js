import { writeFileSync, readFileSync, existsSync, writeFile } from 'fs'

// Функция для записи строки в JSON файл
export const writeMessageIdToJson = (messageId) => {
	if (checkIsFileCreated()) {
		const data = JSON.stringify({ messageId })
		writeFileSync('data.json', data)
		//* Создание файла
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
		console.error('Ошибка чтения файла:', err)
		return null
	}
}

const checkIsFileCreated = () => {
	if (!existsSync('data.json')) {
		const fileContent = { messageId: '' }

		writeFile('data.json', JSON.stringify(fileContent), (err) => {
			if (err) {
				console.error('Ошибка', err)
				return false
			} else {
				//* Файл Создан
				return true
			}
		})
	} else {
		//* Файл уже был создан
		return true
	}
}
