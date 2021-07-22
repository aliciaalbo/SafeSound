from server import app
import model
import server
import crud


model.connect_to_db(server.app)
model.db.create_all()


youtube_list = crud.build_filter("youtube_blacklist.txt")
crud.create_default_filter(youtube_list, "youtube")