## HOW TO CHECK & SET REMOTE GITHUB ?

```bash
$ git remote -v
# or
$ git remote set-url <remote_name> <remote_url> (ex : git remote set-url origin https://github.com/hafidh2001/Hactiv8_Final_Project-4.git)
```

## HOW TO REMOVE REMOTE GITHUB ?

```bash
$ git remote remove <remote_name> (ex : git remote remove origin)
```

## HOW TO CLONE REPOSITORY ?

```bash
$ git clone <remote_repo> (ex: git clone https://github.com/hafidh2001/Hactiv8_Final_Project-4.git)
# or clones to specific branches
$ git clone -b <branch> <remote_repo> (ex: git clone -b development https://github.com/hafidh2001/Hactiv8_Final_Project-4.git)
```

## HOW TO RUN TEST USING JEST IN THIS PROJECT ?

```bash
# SETUP ENVIRONMENT COMMON.JS

# step 1 : install all dependencies && dev-dependencies
$ npm install (to install dependencies on the project stored in package.json)
# step 2 : create .env file and duplicates the contents of the .env.example
$ touch .env 
# step 3 : setting database in ./config/config.json
$ "username": "postgres",
  "password": "sql2001",
  "database": "PhotoAlbum",
  "host": "localhost",
  "port": 5432,
  "dialect": "postgres"
# step 4 : create db for test in database using sequelize-cli
$ npx sequelize db:create --env test
# step 5 : migrate db for test in database using sequelize-cli
$ npx sequelize db:migrate --env test

##########################################################################################

# RUN TEST

# step : run all test
$ npm run test
# step : run specified file test
$ npm run test ./path (ex : npm run test ./__test__/user/register.test.js)
```

## License

[MIT LICENSE](./LICENSE)

© Developed by [hafidh2001](https://github.com/hafidh2001)
