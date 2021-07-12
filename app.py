from flask import Flask, render_template, escape, Markup
from sassutils.wsgi import SassMiddleware
from jinja2 import Template
from datetime import datetime
import string

app = Flask(__name__)
app.wsgi_app = SassMiddleware(app.wsgi_app, {
    'app': {
        'sass_path': 'static/sass', 
        'css_path': 'static/css', 
        'wsgi_path': '/static/css', 
        'strip_extension': False
    }
})

template_str = """The time is now {{ time }}"""

@app.route("/")
def hello():
    now = datetime.now()
    time_template = Template(template_str)
    
    return "Hello World!<br>" + time_template.render(time=now) + "<br>" + render_template('extemp.html', a_variable="what")

def format_squares_on_large(str_):
    str_ = str_.replace('[', '<span class="on-large">')
    str_ = str_.replace(']', '</span>')
    str_ = str_.replace('{', '<span class="on-small">')
    str_ = str_.replace('}', '</span>')
    return Markup(str_)

def format_date(month, year):
    return format_squares_on_large(month[:3] + '[' + month[3:] + ']&nbsp;[' + year[:2] + "]{'}" + year[2:])

resume_data = {
    "skills": [{
        "name": "C++",
        "color": "#CEF",
        "projects": [{
            "name": format_squares_on_large('Common Utilities[ Library]'),
            "link": '#'
        }, {
            "name": format_squares_on_large('GUI[ Library]'),
            "link": '#'
        }, {
            "name": format_squares_on_large('AABB Physics[ Demo]'),
            "link": '#'
        }]
    }, {
        "name": "JavaScript",
        "color": "#FEC",
        "projects": [{
            "name": 'PSOBB Mag Feeder',
            "link": '#'
        }, {
            "name": 'Encrypted Text Tool',
            "link": '#'
        }]
    }, {
        "name": "Python",
        "color": "#ECE",
        "projects": [{
            "name": "This Website's backend",
            "link": '#'
        }, {
            "name": 'Project B',
            "link": '#'
        }]
    }, {
        "name": "(Open) SQL",
        "color": "#CFC",
        "projects": [{
            "name": "Food Planner",
            "link": '#'
        }, {
            "name": 'Project B',
            "link": '#'
        }]
    }],
    "experiences": [{
        "organization": "SpartanNash Associates",
        "position": "Night Stock Associate",
        "location": "Grand Rapids, MI",
        "start_date": format_date("June", "2019"),
        "end_date": format_date("April", "2020"),
        "duties": [
            "Performed grocery restocking, consistently reaching performance goals",
            "Conditioning and facing, making the store ready for customers"
        ]
    }, {
        "organization": "Grand Valley State University",
        "position": "Web Developer",
        "location": "Allendale, MI",
        "start_date": format_date("October", "2018"),
        "end_date": format_date("December", "2018"),
        "duties": [
            "Updated HTML, and ColdFusion components of the Room Reservation System",
            "Restylized the Room Reservation System to fit the contemporary GVSU website design"
        ]
    }, {
        "organization": "Grand Rapids Community College",
        "position": "Math Tutor",
        "location": "Grand Rapids, MI",
        "start_date": format_date("August", "2012"),
        "end_date": format_date("June", "2013"),
        "duties": [
            "Consulted students on a one-to-one basis, to those requiring more in depth help",
            "Promoted use of in class learning resources, enhancing student independent learning"
        ]
    }],
    "education": {
        "school": "University of Michigan",
        "major": "Bachelor of Science in Computer Science",
        "location": "Ann Arbor, MI",
        "graduation_date": format_date("April", "2017")
    }
}

@app.route("/resume")
def serve_resume():
    return render_template('resume.html', **resume_data)

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)
