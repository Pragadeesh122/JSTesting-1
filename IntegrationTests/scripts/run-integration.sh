docker-compose up -d
echo '🟡 - Waiting for database to be ready...'
./scripts/wait-for-it.sh "postgresql://postgres:mysecretpassword@localhost:5432/postgres" -- 
echo '🟢 - Database is ready!'
yarn prisma migrate dev --name init
yarn run test
docker-compose down