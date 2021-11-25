from flask import Flask, render_template, escape
from sassutils.wsgi import SassMiddleware
from jinja2 import Template
from datetime import datetime

'my imports'
from blog import blog
from resume import RESUME_DATA
from spa import mag_feeder, wasmex

from flaskext.mysql import MySQL

app = Flask(__name__)
app.register_blueprint(blog, url_prefix="/blog")
app.register_blueprint(mag_feeder, url_prefix="/mag-feeder")
app.register_blueprint(wasmex, url_prefix="/wasmex")
app.wsgi_app = SassMiddleware(app.wsgi_app, {
    '__init__': {
        'sass_path': 'static/sass', 
        'css_path': 'static/css', 
        'wsgi_path': '/static/css', 
        'strip_extension': False
    }
})

mysql = MySQL() # MySQL configurations
app.config['MYSQL_DATABASE_USER'    ] = 'nutri_admin'
app.config['MYSQL_DATABASE_PASSWORD'] = 'JSrStpsdTf1m'
app.config['MYSQL_DATABASE_DB'      ] = 'nutri_db'
app.config['MYSQL_DATABASE_HOST'    ] = 'localhost'
mysql.init_app(app)

def get_aloo_gobi_info():
    # These are only a few of the complete ingredient list, and is only done for
    # illustrative purposes.
    
    cursor = mysql.get_db().cursor()
    unprefaced_query = """SELECT name_, calories, serving_size, sodium, total_carbohydrates
                          FROM base_ingredients
                          WHERE """
    INGREDIENTS = {
        # db name -> quantity in grams
        'potato'     : 320,
        'cauliflower': 180,
        'onion'      : 110,
        'tomato'     : 150
    }
    for key in INGREDIENTS:
        unprefaced_query = unprefaced_query + "name_='" + key + "' OR "
    unprefaced_query = unprefaced_query[:-3]
    
    cursor.execute(unprefaced_query)
    
    sum_cals  = 0
    sum_sodi  = 0
    sum_carbs = 0
    
    for (name, cals, serving_size, sodium, carbs) in cursor:
        sum_cals  += INGREDIENTS[name]*( cals   / serving_size )
        sum_sodi  += INGREDIENTS[name]*( sodium / serving_size )
        sum_carbs += INGREDIENTS[name]*( carbs  / serving_size )
    res = 'Cals ' + str(round(sum_cals)) + ' Carbs ' + str(round(sum_carbs)) + 'g Sodium ' + str(round(sum_sodi)) + 'mg '
        
    return '<span style="color:#11B">' + res + '</span>'

@app.route("/")
def serve_home():
    now = datetime.now()
    template_str = """The time is now {{ time }}"""
    time_template = Template(template_str)
    
    sqlretstring = get_aloo_gobi_info()
    
    return render_template('extemp.html', a_variable=time_template.render(time=now), b_variable=sqlretstring)

@app.route('/spa')
def serve_spa():
    return render_template('spa_out.html')

@app.route("/resume")
def serve_resume():
    return render_template('resume.html', **RESUME_DATA)

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)
