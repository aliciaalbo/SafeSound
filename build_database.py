from server import app
import model
import server

model.connect_to_db(server.app)
model.db.create_all()