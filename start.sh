export DATABASE_URL=$MYSQL_ADDON_URI
npx prisma migrate deploy && node app.js
