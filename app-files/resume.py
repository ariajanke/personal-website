import string
from flask import Markup

def _format_squares(str_):
    str_ = str_.replace('[', '<span class="on-large">')
    str_ = str_.replace(']', '</span>')
    str_ = str_.replace('{', '<span class="on-small">')
    str_ = str_.replace('}', '</span>')
    return Markup(str_)

def _format_date(month, year):
    return _format_squares(month[:3] + '[' + month[3:] + ']&nbsp;[' + year[:2] + "]{'}" + year[2:])

RESUME_DATA = {
    "skills": [{
        "name": "C++",
        "tag":"cpp",
        "color": "#CEF",
        "projects": [{
            "name": _format_squares('Common Utilities[ Library]'),
            "link": 'https://dev.to/ariajanke/my-common-utilities-library-and-unit-testing-gpn'
        }, {
            "name": _format_squares('GUI[ Library]'),
            "link": '#'
        }, {
            "name": _format_squares('AABB Physics[ Demo]'),
            "link": 'static/spa/spa_out.html'
        }]
    }, {
        "name": "JavaScript",
        "tag": "js",
        "color": "#FEC",
        "projects": [{
            "name": 'PSOBB Mag Feeder',
            "link": 'https://ariajanke.github.io/mag-feeder/mag-feeder.html'
        }, {
            "name": 'Encrypted Text Tool',
            "link": '#'
        }]
    }, {
        "name": "Python",
        "tag": "py",
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
        "tag": "sql",
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
        "start_date": _format_date("June", "2019"),
        "end_date": _format_date("April", "2020"),
        "duties": [
            "Performed grocery restocking, consistently reaching performance goals",
            "Conditioning and facing, making the store ready for customers"
        ]
    }, {
        "organization": "Grand Valley State University",
        "position": "Web Developer",
        "location": "Allendale, MI",
        "start_date": _format_date("October", "2018"),
        "end_date": _format_date("December", "2018"),
        "duties": [
            "Updated HTML, and ColdFusion components of the Room Reservation System",
            "Restylized the Room Reservation System to fit the contemporary GVSU website design"
        ]
    }, {
        "organization": "Grand Rapids Community College",
        "position": "Math Tutor",
        "location": "Grand Rapids, MI",
        "start_date": _format_date("August", "2012"),
        "end_date": _format_date("June", "2013"),
        "duties": [
            "Consulted students on a one-to-one basis, to those requiring more in depth help",
            "Promoted use of in class learning resources, enhancing student independent learning"
        ]
    }],
    "education": {
        "school": "University of Michigan",
        "major": "Bachelor of Science in Computer Science",
        "location": "Ann Arbor, MI",
        "graduation_date": _format_date("April", "2017")
    }
}
