from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = "postgres://zviqcjluumydzn:9c2c7e15f7a47ae5aa2ad3e621df3feda14f44a7ba06f773bdeab9e0be517490@ec2-52-54-174-5.compute-1.amazonaws.com:5432/df8daer9acdb4c"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
class Submission(db.Model):
    __tablename__ = "submission"
    id = db.Column(db.Integer, primary_key=True, unique=True)
    input = db.Column(db.String(200), unique=False)

    def __init__(self, input):
        self.input = input

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit', methods = ['POST'])
def submit():
    if request.method == 'POST':
        input = request.form['input']
        data = Submission(input)
        db.session.add(data)
        db.session.commit()
        return render_template('submit.html')


if __name__ == '__main__':
    app.run(debug = True)