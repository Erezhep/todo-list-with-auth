# Список задач с аутентификацией

## Описание проекта

Веб-приложение для управления задачами, построенное на Spring Boot 3.5.0 с Java 21. Позволяет создавать, просматривать, завершать и удалять задачи, фильтровать их по дате через календарь, с поддержкой аутентификации через Spring Security. Дизайн вдохновлен Flutter Material Design: закругленные элементы, тени, адаптивный интерфейс.

## Основные функции

- Создание задач с названием, описанием и сроком выполнения.
- Фильтрация задач: все задачи или задачи на сегодня.
- Интерактивный календарь для выбора даты.
- Завершение и удаление задач.
- Аутентификация с входом и выходом.
- Современный адаптивный дизайн.

## Требования

- Java: JDK 21
- Maven: 3.8.0 или выше
- PostgreSQL: 14 или выше
- Браузер: Chrome, Firefox, Safari
- ОС: Windows, macOS или Linux

## Установка

### 1. Клонирование репозитория

```bash
git clone https://github.com/Erezhep/todo-list-with-auth.git
cd todo-list-with-auth
```

### 2. Настройка PostgreSQL

1. Установите PostgreSQL.
2. Создайте базу данных:
   ```sql
   CREATE DATABASE todolist;
   ```
3. Настройте `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/todolist
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   ```

   Замените `your_username` и `your_password` на ваши учетные данные.

### 3. Сборка и запуск

1. Соберите проект:
   ```bash
   mvn clean install
   ```
2. Запустите приложение:
   ```bash
   mvn spring-boot:run
   ```
3. Откройте в браузере:
   ```
   http://localhost:8080/login
   ```

### 4. Тестовые учетные данные

- **Имя пользователя**: `user`
- **Пароль**: Смотрите сгенерированный пароль в консоли (строка `Using generated security password`).

## Использование

1. **Вход**: На странице `/login` введите учетные данные.
2. **Создание задачи**: В боковой панели заполните поля и нажмите "Добавить задачу".
3. **Просмотр задач**: Фильтруйте через "Все задачи", "Сегодня" или выберите дату в календаре.
4. **Управление задачами**: Нажмите "check" для завершения, "delete" для удаления.
5. **Выход**: Нажмите "Выйти".

## Структура проекта

```
todo-list-with-auth/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/todo/
│   │   │       ├── controller/
│   │   │       ├── model/
│   │   │       ├── repository/
|   |   |       ├── service/
|   |   |       └── config/
|   |   |           └── SecurityConfig.java
│   │   ├── resources/
│   │   │   ├── templates/
│   │   │   │   ├── tasks.html
|   |   |   |   ├── register.html
│   │   │   │   └── login.html
│   │   │   ├── static/
│   │   │   └── application.properties
├── pom.xml
└── README.md
```

## Вклад в проект

1. Создайте форк репозитория.
2. Создайте ветку:
   ```bash
   git checkout -b feature/новая-функция
   ```
3. Внесите изменения и закоммитьте:
   ```bash
   git commit -m "Добавлена новая функция"
   ```
4. Отправьте в форк:
   ```bash
   git push origin feature/новая-функция
   ```
5. Создайте Pull Request.

Следуйте [кодексу поведения](https://www.contributor-covenant.org/ru/version/2/0/code_of_conduct/).

## Устранение неполадок

- **Ошибка базы данных**: Проверьте, что PostgreSQL запущен, база `todolist` создана, и учетные данные верны.
- **Ошибка входа**: Убедитесь, что используете правильный пароль из консоли.
- **404/403 ошибки**: Проверьте наличие шаблонов в `src/main/resources/templates/`.


Спасибо за использование приложения!