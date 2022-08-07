import psycopg2
import secret

class raw_db:
    def __init__(self):
        self.conn = None
        self.debug = False
        
    def connect(self):
        try:
            self.conn = psycopg2.connect(
                host="localhost",
                database="safesound",
                user=secret.db_user,
                password=secret.db_pw)
        except (Exception, psycopg2.DatabaseError) as error:
            print("raw_db error:", error)

    def close(self):
        if self.conn is not None:
            self.conn.close()

    def sql(self, cmd: str, query: str, qargs: tuple = None):
        val = ''
        try:
            with self.conn.cursor() as cursor:
                cursor.execute(query) if qargs is None else cursor.execute(query, qargs)
                if self.debug:
                    print(cursor.query)
                if cmd == 'select':
                    val = cursor.fetchall()
                if cmd == 'one':
                    val = cursor.fetchone()
                    return None if val is None else val[0]
                elif cmd == 'insert':
                    val = cursor.lastrowid
                self.conn.commit()
                cursor.close()
        except:
            print(f"Postgres error with:\n{query}\n")
            raise
        return val