set pg_env="C:\Program Files\PostgreSQL\13\bin"
%pg_env%\dropdb.exe -h localhost -p 5432 -U postgres -d OnlineAuction_db
%pg_env%\createdb.exe -h localhost -p 5432 -U postgres -d OnlineAuction_db
%pg_env%\psql.exe -h localhost -p 5432 -U postgres -d OnlineAuction_db < OnlineAuction_DB.sql
pause
