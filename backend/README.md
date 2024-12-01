
https://member.fpv.jp/api/phpinfo

http://localhost:8000/api/phpinfo




[fpv@v2008 private_html]$ mariadb -u fpv_jp -p -h 127.0.0.1 -P 3306
Enter password:
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 126943878
Server version: 10.6.18-MariaDB-cll-lve MariaDB Server

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| fpv_jp             |
| information_schema |
+--------------------+
2 rows in set (0.010 sec)

MariaDB [(none)]> use fpv_jp;
Database changed
MariaDB [fpv_jp]> show tables;
Empty set (0.000 sec)

MariaDB [fpv_jp]> quit;
Bye