"use strict";
// I may reduce this down to a single function call
let program_state = (() => {
    let me = {};
    let set_func_once = (name, func) => {
        if (me[name] === unimplemented_state_func) {
            me[name] = func;
        } else {
            throw "Attempting to either double set a function, or was not "
                  "entry was not 'set aside' to be set by this function.";
        }
    };
    let unimplemented_state_func = () => { 
        throw "state needs to be setup first before this function is called";
    };
    
    me.setup = (module, canvas) => {
        let issue_canvas_resize = module.cwrap('js_glue_on_canvas_resize', null, ['number', 'number']);
        set_func_once('issue_canvas_resize', (_ignored_event) => {
            console.log("w: " + canvas.width + " h: " + canvas.height);
            issue_canvas_resize(canvas.width, canvas.height);
        });
        
        let issue_click = module.cwrap('js_glue_on_click', null, ['number', 'number']);
        set_func_once('on_click', (e) => {
            issue_click(e.clientX, e.clientY);
        });
        
        set_func_once('render', module.cwrap('js_glue_render_to', null, null));
        
        module.ccall('js_glue_create_spa_instance', null, null, null);
        
        window.addEventListener('resize', issue_canvas_resize);
        canvas.onclick = me.on_click;
        canvas.width  = 800;
        canvas.height = 400;
        
        // canvas.getContext("2d").font = "bold 96px Helvetica, Arial, sans-serif";
        
        let do_update = module.cwrap('js_glue_on_update', null, ['number']);
        function update_func() {
            program_state.render();
            do_update(1 / 25);
            setTimeout(update_func, 1000 / 25);
        };
        setTimeout(update_func, 1000 / 25);

        console.log('module started');
        
        me.issue_canvas_resize(canvas.width, canvas.height);
    };
    me.issue_canvas_resize = unimplemented_state_func;
    me.on_click            = unimplemented_state_func;
    me.render              = unimplemented_state_func;
    return me;
})();
