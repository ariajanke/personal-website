/*jshint esversion: 6 */
// assumptions present in implementation:
// jquery is available
// all elements have the id definitions they're supposed to
// 'pso_mag_raiser' is available
// vocabulary:
// 'make' returns an instance
// 'update_*_elements' sets up/updates elements for use
let pso_mag_raiser_interface = (() => {

// sort of an import, there had better not be any other reference to this
const pso_magr = pso_mag_raiser;

let inst_history;
const get_history_inst = () => inst_history;
const on_document_ready = () => {
    let character = make_random_character();
    let history   = pso_magr.make_history_tracker(character);
    let mag       = pso_magr.make_mag();
    
    inst_history = history;
    
    const restore_mag_and_character = args => {
        [mag, character] = args;
        update_character_display_elements(character, mag);
        update_mag_stat_elements(mag);
    };
    
    $('#save-link').click(() => {
        $('#save-js').attr('href', 'data:text/plain;charset=utf-8,' + history.save_to_string());
        let svfn = $('#save-filename').attr('value');
        if (svfn.length === 0) {
            svfn = 'my-mag';
        }
        if (svfn.substr(-5) !== '.json') {
            svfn += '.json';
        }
        $('#save-js').attr('download', svfn);
        $('#save-js span').trigger('click');
    });
    $('#load-link').click(() => {
        
    });
    $('#jump-to-beginning').click(() => {
        if (history.record_count() === 0) return;
        [mag, character] = history.rewind_to_index(0);
        grey_out_history_links_after(0);
        update_character_display_elements(character, mag);
        update_mag_stat_elements(mag);
    });
    
    $('#loaded-file').change(function() {
        let reader = new FileReader();
        reader.onload = () => {
            // just clear this whole thing out
            $('#feed-history .links div').remove();
            
            // reinitialize history
            history = pso_magr.make_history_tracker(make_random_character());
            [mag, character] = history.load_from_string(reader.result);
            for (let i = 1; i <= history.record_count(); ++i) {
                append_feed_index_to_history_elements(history, restore_mag_and_character, i);
            }
            update_character_display_elements(character, mag);
            update_mag_stat_elements(mag);
            update_sum_costs_elements(history.total_cost(), mag.name(), history.record_count());
            $('#loaded-file-progress').text('Successfully Loaded Level '+mag.level()+' '+capitalize(mag.name())+'.');
        };
        reader.readAsText($('#loaded-file').prop('files')[0]);
        $('#loaded-file-progress').text('Loading!');
    });
    
    update_app_tab_elements('app-about', '#go-to-app-about');
    update_character_display_elements(character, mag);
    update_mag_stat_elements(mag);
    
    update_class_and_section_id_menu_elements((classname, secid) => {
        classname = classname || pso_mag_raiser.get_class_name(character);
        secid     = secid     || pso_mag_raiser.get_section_id_name(character.sec_id);
        character = pso_mag_raiser['make_' + classname](secid);
        
        history.record_character_change(character);
        
        update_character_display_elements(character, mag);
    });
    $('#sel-' + character.full_class_name).parent().addClass('selected');
    $('#sel-' + character.section_id_name).parent().addClass('selected');
    
    // history:
    // Changed to <char>
    // Fed <item> [DEF +5% DEX +15%]
    // [Mag levels up! DEF 5:50% POW 0:50% DEX (!)3:12% MIND 12:09%] (not a link)
    // [Mag evolves to Varuna!]
    
    const feed_mag = (itemname) => {
        // history does it own feeding to a copy of a mag
        history.record_item_fed(itemname, mag);
        // is this order dependant?
        append_feed_to_history_elements(history, restore_mag_and_character);
        // update the working instance
        mag.feed_item(character, itemname);
    };
    
    const feed_mag_until = (itemname, level_delta) => {
        // note: level delta of 0, always feed once
        remove_history_links_after(history.rewind_index());
        if (level_delta === 0) {
            feed_mag(itemname);
        } else if (typeof level_delta === 'number') {
            let past_level = mag.level();
            while (   mag.level() !== 200
                   && mag.level() !== past_level + level_delta)
            { feed_mag(itemname); }
        } else {
            throw 'level delta must be a number';
        }
        // can this be placed here? no
        // append_feed_to_history_elements(history, restore_mag_and_character);
        
        // update the page
        update_mag_stat_elements(mag);
        update_feed_preview_elements(itemname, mag);
        // there maybe an issue with "history.total_cost", probably should cache it's answer
        update_sum_costs_elements(history.total_cost(), mag.name(), history.record_count());
    };
    
    update_feed_item_menu_elements(feed_mag_until,
        (name) => update_feed_preview_elements(name, mag));
};

const update_app_tab_elements = (div_id, calling_obj) => {
    $(calling_obj).parent().children().each(function(i, element) {
        $(element).removeClass('selected-button');
        $(element).addClass('button');
    });
    $(calling_obj).removeClass('button');
    $(calling_obj).addClass('selected-button');
    
    $('.section').each(function(i, element) {
        $(this).css('display', 'none');
    });
    $('#' + div_id).css('display', 'inline-block');
};

// -----------------------------------------------------------------------------

const make_random_character = () => {
    let init_cname = select_random_element(pso_magr.class_names);
    let init_secid = select_random_element(pso_magr.section_ids);
    let rv = pso_magr['make_' + init_cname](init_secid);
    rv = Object.assign(rv, {
        full_class_name : init_cname
    });
    return rv;
};

const update_class_and_section_id_menu_elements = remake_character => {
    /* section id */
    let get_id_side_for = i => {
        let rv_sec;
        [ { sec: 'left', max_: 3 }, { sec: 'mid', max_: 7 }, 
          { sec: 'right', max_: 10 }
        ].some((group) => {
            if (i < group.max_) rv_sec = group.sec;
            return (i < group.max_);
        });
        return $('#section-ids .' + rv_sec);
    };
    let i = 0;
    for (let id in pso_mag_raiser.section_ids) {
        get_id_side_for(i++).append('<div class="id">' +
            '<a href="#" id="sel-' + id.toLowerCase() + '">' +
            '<img alt="' + capitalize(id) + '" src="' +
            get_image_filename(id) + '" /></a></div>');
        let id_ = id;
        $('#sel-' + id_).click(() => { 
            remake_character(undefined, id_);
            $('#section-ids div').removeClass('selected');
            $('#sel-' + id_).parent().addClass('selected');
        });
    }

    /* classes */
    pso_mag_raiser.class_names.forEach((cname) => {
        $('#class-list').append('<div>' +
            '<a href="#" id="sel-' + cname.toLowerCase() + '">' +
            '<img alt="' + capitalize(cname, 2) + '" src="' +
            get_image_filename(cname) + '" /></a></div>'
        );
        $('#sel-' + cname).click(() => {
            $('#class-list div').removeClass('selected');
            $('#sel-' + cname).parent().addClass('selected');
            remake_character(cname);
        });
    });
};

const update_character_display_elements = (character_info, mag) => {
    let selected_sec_id = pso_mag_raiser.get_section_id_name(character_info.sec_id);
    let classname = pso_mag_raiser.get_class_name(character_info);
    
    let mk_img = (item) => '<img alt="" src="magr/' + item.toLowerCase().replace(' ', '-') + '.png" />';
    
    $('.char-info').html(capitalize(selected_sec_id) + ' '
        + capitalize(classname, 2) + mk_img(classname)+mk_img(selected_sec_id));
};

const update_feed_item_menu_elements = (feed_mag, preview_feed) => {
    // preview_feed may take the undefined keyword in place of item name
    const mk_item_button_string = (id_suffix, alt_string, img_src, name_text) =>
         '<a class="button" href="#" id="sel-' + id_suffix + '"><div class="item-sel">'
        +'<img alt="' + alt_string + '" src="' + img_src + '" />'
        +'<span class="name"><br>' + name_text + '</span>'
        +'</div></a>';
    
    const k_items = pso_magr.item_names;
    let item_list_table = "";
    for (let k in pso_magr.item_names) {
        let name_text = k_items[k];
        name_text = name_text.replace(' ', '&nbsp;');
        item_list_table += mk_item_button_string(k, capitalize(k_items[k].replace('-', ' ')),
            get_image_filename(k_items[k]), name_text);
    }
    const k_no_item_name = 'no-item';
    const k_no_item_img  = 'magr/blank-item.png';
    item_list_table += mk_item_button_string(k_no_item_name, '', k_no_item_img, '(Select None)');
    
    // appends item html
    $('#item-list').append(item_list_table);
    
    // adds events to item menu
    let selected_item_name; // shared between callbacks, maybe undefined...
    const sel_by_internal_name = (name) =>
        $('#sel-' + (name === undefined ? k_no_item_name : name));
    const mk_select_item_func = (name_text, internal_name, img_filename) => {
        return () => {
            $('#selected-item span.name').text(name_text);
            $('#selected-item img').attr('src', img_filename);
            preview_feed(internal_name);
            let old_sel = $('#item-list a.selected-button');
            old_sel.removeClass('selected-button');
            old_sel.addClass('button');
            
            let this_el = sel_by_internal_name(internal_name);
            this_el.removeClass('button');
            this_el.addClass('selected-button');
            
            selected_item_name = internal_name;
        };
    };
    
    for (let k in pso_mag_raiser.item_names) {
        let name = k;
        sel_by_internal_name(name).click(
            mk_select_item_func(capitalize(k_items[k]), name, get_image_filename(k_items[k])));
    }
    $('#sel-'+k_no_item_name).click(mk_select_item_func('None', undefined, k_no_item_img));
    
    $('#selected-item a.mul-left').click(() => {
        feed_mag(selected_item_name, 0);
    });
    $('#selected-item a.mul-mid').click(() => {
        feed_mag(selected_item_name, 1);
    });
    $('#selected-item a.mul-right').click(() => {
        feed_mag(selected_item_name, 4);
    });
};

const update_feed_preview_elements = (itemname, mag) => {
    const preview_stat = (s, del, per) =>
        update_feed_preview_stat_elements(s, del, per, mag.level() === 200);
    if (itemname === undefined) {
        $('#preview-sync').text('');
        $('#preview-iq').text('');
        $('#mag-info .preview').text('');
        $('#mag-info .preview').css('width', '0%');
        $('#mag-info .preview').removeClass('level-up');

        preview_stat('pow' , 0, mag.pow_percent ());
        preview_stat('def' , 0, mag.def_percent ());
        preview_stat('dex' , 0, mag.dex_percent ());
        preview_stat('mind', 0, mag.mind_percent());
    } else {
        let deltas = pso_magr.get_feed_chart_for(mag.name())[itemname];
        let sync_delta = Math.round(deltas.sync*100);
        if (sync_delta !== 0)
            $('#preview-sync').text(' (' + (sync_delta < 0 ? '' : '+') + sync_delta + '%)');
        if (deltas.iq !== 0)
            $('#preview-iq').text(' (' + (deltas.iq < 0 ? '' : '+') + deltas.iq + ')');
        preview_stat('pow' , deltas.pow , mag.pow_percent ());
        preview_stat('def' , deltas.def , mag.def_percent ());
        preview_stat('dex' , deltas.dex , mag.dex_percent ());
        preview_stat('mind', deltas.mind, mag.mind_percent());
    }
};

const update_mag_stat_elements = mag => {
    let pb_as_img = name => {
        let is_none = name === '&lt;NONE&gt;';
        return  '<img alt="'+(is_none ? '' : name)+'" src="magr/'
               +(is_none ? 'blank' : name)+'.png">';
    };
    
    let perstr = p => Math.round(p*100) + '%';
    
    $('#mag-summary').text('Summary for Lv' + mag.level() + ' ' + capitalize(mag.name()));
    $('#mag-sync').text(perstr(mag.sync()));
    $('#mag-iq').text(mag.iq());
    
    let update_bars = (statname, lv, percamt) => {
        percamt = perstr(percamt);// Math.round(percamt*100) + '%';
        $('#mag-' + statname + ' td:nth-of-type(2)').html('<span class="large-only">Lv </span>' + lv);
        $('#mag-' + statname + ' td:nth-of-type(3)').text(percamt);
        $('#mag-' + statname + ' .fill').css('width', percamt);
    };
    
    update_bars('def' , mag.def (), mag.def_percent ());
    update_bars('pow' , mag.pow (), mag.pow_percent ());
    update_bars('dex' , mag.dex (), mag.dex_percent ());
    update_bars('mind', mag.mind(), mag.mind_percent());
    
    $('#pb-left .image-holder' ).html(pb_as_img(mag.left_photon_blast  ()));
    $('#pb-mid .image-holder'  ).html(pb_as_img(mag.center_photon_blast()));
    $('#pb-right .image-holder').html(pb_as_img(mag.right_photon_blast ()));
    $('#mag-item-code').text(mag.to_hex_string());
};

const append_feed_to_history_elements = (history, rewind_to) => {
    append_feed_index_to_history_elements(history, rewind_to, history.record_count());
};

const append_feed_index_to_history_elements = (history, rewind_to, index) => {
    let delta = history.get_entry(index - 1);
    
    const link_id = 'feed-history-' + index;
    let new_content = '<a>' + pso_magr.item_names[delta.item_name] + ' <span class="large-only">';
    let first = true;
    let perstr = p => Math.round(p*100) + '%';
    ['def', 'pow', 'dex', 'mind'].forEach(e => {
        if (delta[e] === 0) return;
        if (first) {
            first = false;
        } else {
            new_content += ', ';
        }
        
        new_content += e + (delta[e] < 0 ? ' ' : ' +') + perstr(delta[e]);
    });
    new_content += '</span></a><br>';
    if (delta.evolves_to !== undefined) {
        new_content +=   capitalize(delta.mag_clone.name()) + ' has evolved to ' 
                       + capitalize(delta.evolves_to) + ' at level '
                       + delta.level_up_to + '!<br>';
    } else if (delta.level_up_to !== undefined) {
        new_content +=   capitalize(delta.mag_clone.name()) + ' has leveled up! ('
                       + delta.level_up_to + ')<br>';
    }
    new_content = '<div id="' + link_id + '">' + new_content + '</div>';
    
    $('#feed-history .links').append(new_content);
    
    $('#'+link_id+' a').click(() => {
        grey_out_history_links_after(index);
        rewind_to(history.rewind_to_index(index));
    });
};

const update_sum_costs_elements = (total_meseta_cost, mag_name, num_of_feeds) => {
    const make_new_mag_string = () => 'This is a new Mag, and can be obtained via a rare drop or creating a new character.';
    const time_for_feed = 3*60 + 15;
    const format_feed_time = (duration_secs) => {
        let hours = Math.floor(duration_secs / 3600);
        let mins  = Math.ceil(duration_secs / 60) % 60;
        return   hours + ' hour' + (hours > 1 ? 's' : '') + ', ' 
               + mins + ' minute' + (mins > 1 ? 's' : '');
    };
    const make_reg_mag_string = () =>
          'It will take about ' + format_feed_time(num_of_feeds*time_for_feed)
        + ' and exactly ' + total_meseta_cost + ' meseta to raise your ' + mag_name + '.';
    $('#mag-raise-costs').text( num_of_feeds === 0 ? make_new_mag_string() : make_reg_mag_string() );
};

const grey_out_history_links_after = rewind_index => {
    for (let i = 0; i < rewind_index + 1; ++i) {
        $('#feed-history-'+i).removeClass('pending-removal');
    }
    for (let i = rewind_index + 1; true; ++i) {
        let el = $('#feed-history-'+i);
        if (el.length === 0) break;
        el.addClass('pending-removal');
    }
};

const remove_history_links_after = index => {
    for (let i = index + 1; true; ++i) {
        let el = $('#feed-history-'+i);
        if (el.length === 0) break;
        el.remove();
    }
};

// -----------------------------------------------------------------------------

const select_random_element = obj => {
    let rnd = (len) => Math.floor(Math.random() * len);
    if (Array.isArray(obj)) return obj[rnd(obj.length)];
    let i = rnd(Object.keys(obj).length);
    for (let k in obj) {
        if (i == 0) { return k; }
        --i;
    }
    throw "shouldn't reach this branch";
};

const capitalize = (str, n_first) => {
    n_first = n_first || 1;
    return str.substr(0, n_first).toUpperCase() + str.substr(n_first);
};

const get_image_filename = item =>
    'magr/' + item.toLowerCase().replace(' ', '-').replace('_', '-') + '.png';

const update_feed_preview_stat_elements = (statname, delta, perc, at_max) => {
    let per = p => Math.round(p*100);
    let prev = $('#mag-' + statname + ' .preview');
    let fill = $('#mag-' + statname + ' .fill'   );
    
    prev.css('display', 'inline-block');
    prev.text('');
    prev.removeClass('level-up empty-out flash-positive flash-negative');
    
    fill.css('display', 'inline-block');
    
    if (perc + delta >= 1) {
        prev.css('width', '100%');
        prev.text(at_max ? 'MAX OUT' : 'LEVEL UP!');
        prev.addClass('level-up');
        
        fill.css('display','none');
    } else if (perc + delta <= 0 && perc > 0) {
        prev.css('width', '100%');
        prev.text('EMPTIES');
        prev.addClass('empty-out');
        
        fill.css('display','none');
    } else if (delta > 0) {
        prev.css('width', per(delta) + '%');
        prev.addClass('flash-positive');
        
        fill.css('width', per(perc) + '%');
    } else if (delta < 0 && perc > 0) {
        prev.css('width', per(-delta) + '%');
        prev.addClass('flash-negative');
        
        fill.css('width', per(perc + delta) + '%');
    } else {        
        prev.css('display', 'none');
        
        fill.css('width', per(perc) + '%');
    }
};

return { document_on_ready : on_document_ready,
         hide_others_show  : update_app_tab_elements,
         // doing this for debug purposes only
         get_history : get_history_inst };

})(); // end of top-level closure
