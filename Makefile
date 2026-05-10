# Makefile для проекта OTTISK Landing
# Запуск одной командой: make all

.PHONY: install build start all dev lint clean

# Установка зависимостей
install:
	npm install

# Запуск dev-сервера
dev:
	npm run dev

# Сборка production
build:
	npm run build

# Запуск production-сервера
start:
	npm start

# Линтинг
lint:
	npm run lint

# Очистка
clean:
	rm -rf .next node_modules

# Полный цикл: установка + сборка + запуск
all: install build start
