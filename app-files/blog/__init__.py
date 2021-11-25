from flask import Flask, Blueprint, render_template, request, Markup
import html
'this may have to be done at home also...'
#import markdown
blog = Blueprint("blog", __name__, template_folder='templates')

BLOG_TEST_DATA = {
    "cpp": "This is a test entry for C++, designed by Bjarne Stroustrup maintained by the ISO standards committee.",
    "js": "This is a test entry for JavaScript, designed by Brendan Eich maintained by the ECMA.",
    "py": "This is a test entry for Python, designed by Guido van Rossum maintained by the Python Software Foundation.",
    "sql": "This is a test entry for SQL, designed by both Donald D. Chamberlin, and Raymond F. Boyce."
}

@blog.route('/')
def show():
    chosen_skill = html.escape(request.args.get('skill') or '')
    sel_content = ''
    'this test up here should work as a "sanitizer" of sorts since only very'
    'specific values will fire the proceding branch'
    if chosen_skill in BLOG_TEST_DATA.keys():
        'filter to one'
        sel_content = BLOG_TEST_DATA[chosen_skill]
    else:
        'list all, do not attempt to use "chosen_skill"'
        for tag, str_ in BLOG_TEST_DATA.items():
            sel_content = sel_content + str_ + ' '
            
    loaded_source_file = ''
    '/home/aria/webmain/'
    with open('app-files/blog/entries/one.md', 'r') as file_:
        loaded_source_file = file_.read();
    return render_template('blogex.html', content_text=sel_content, \
        tag_request=(chosen_skill or '(none)'), source_code=Markup(loaded_source_file))

