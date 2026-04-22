# Automate test with playwright
# UMI-erp project

## Initialize & Clone
git init                        # initialize a new repo
git clone <url>                 # clone a remote repo
git clone <url> my-folder       # clone into a specific folder

## Run save-session
npm install dotenv --save-dev   > install dotenv
> create .env file  add BASE_URL="url"
node seseion.js                 > Run to login get token
> config playwright add storageState: 'session.json'  
npx playwright test             > run test
