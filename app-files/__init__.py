from flask import Flask, render_template, escape
from sassutils.wsgi import SassMiddleware
from jinja2 import Template
from datetime import datetime

'my imports'
from blog import blog
from resume import RESUME_DATA

app = Flask(__name__)
app.register_blueprint(blog, url_prefix="/blog")
app.wsgi_app = SassMiddleware(app.wsgi_app, {
    '__init__': {
        'sass_path': 'static/sass', 
        'css_path': 'static/css', 
        'wsgi_path': '/static/css', 
        'strip_extension': False
    }
})

@app.route("/")
def serve_home():
    now = datetime.now()
    template_str = """The time is now {{ time }}"""
    time_template = Template(template_str)
    
    return render_template('extemp.html', a_variable=time_template.render(time=now))

@app.route('/spa')
def serve_spa():
    return render_template('spa_out.html')

@app.route("/resume")
def serve_resume():
    return render_template('resume.html', **RESUME_DATA)

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)
