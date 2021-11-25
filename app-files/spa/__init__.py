from flask import Flask, Blueprint, render_template, request, Markup
import html
# import markdown
mag_feeder = Blueprint('mag-feeder',__name__, static_folder='mag_feeder',static_url_path='/')
wasmex     = Blueprint('wasmex',__name__, static_folder='wasmex',static_url_path='/')
@mag_feeder.route('/')
def show():
    return mag_feeder.send_static_file('mag-feeder.html')
    
@wasmex.route('/')
def show_wasmex():
    return wasmex.send_static_file('spa_out.html')

