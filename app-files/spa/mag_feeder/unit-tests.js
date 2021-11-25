let unit_tests = (() => {

"use strict";

const click_el = selstr => $(selstr).trigger('click');
const el_exists = selstr => $(selstr).length !== 0;

const make_unit = () => {
    let me = {};
    let m_index;
    let m_count = 0;
    let m_executes_test = false;
    const verify_non_negative = (i, msg) => {
        if (typeof i !== 'number') throw msg;
        if (i < 0) throw msg;
        return i;
    };
    me.set_index = i => m_index = verify_non_negative(i, "index must be non-negative integer");
    me.set_is_counting_only = () => { m_executes_test = false; };
    me.set_do_tests = () =>  { m_executes_test = true; };
    me.preface = f => { if (m_executes_test) f(); };
    me.test = f => {
        if (m_count === m_index && m_executes_test) {
            if (f()) {
                console.log('test passed');
            } else {
                console.log('test failed!');
            }
        }
        ++m_count;
    };
    return me;
};

const do_cut_test = i => {
    let unit = make_unit();
    unit.set_do_tests();
    unit.set_index(i);
    let shared_var;
    unit.preface(() => {
        shared_var = 'something neat';
        
        click_el('#sel-hunewearl');
        click_el('#sel-bluefull');
        for (let i = 0; i < 13; ++i) {
            click_el('#sel-monomate');
            click_el('#selected-item .mul-left');
        }
    });
    // how would I know ahead of time how many test cases there are with this
    // context?
    // each feed history link should be 1-n, no 0, as 0 represents the beginning
    unit.test(() => {
        click_el('#feed-history-7 a'); // rewind index is 7
        click_el('#sel-monomate'); // (should) removes 8 and onward with a new 8
        click_el('#selected-item .mul-left');
        // we expect history elements 1-8 to exist
        let all_there = true;
        for (let j = 1; j < 9; ++j) {
            let el = $('#feed-history-'+j);
            if (el.length === 0) {
                all_there = false;
            }
        }
        return all_there && $('#feed-history-9').length === 0;
    });
    unit.test(() => {
        let all_there = true;
        for (let j = 1; j < 14; ++j) {
            let el = $('#feed-history-'+j);
            if (el.length === 0) {
                all_there = false;
            }
        }
        console.log(shared_var);
        return    all_there && $('#feed-history-0').length === 0 
               && $('#feed-history-14').length === 0;
    });
    // expect grey outs (2)
    unit.test(() => {
        click_el('#feed-history-7 a'); 
    
        // we expect history elements 1-8 to exist
        for (let j = 1; j < 13; ++j) {
            let el = $('#feed-history-'+j);
            let has_go = el.hasClass('pending-removal');
            if ((j > 7 && has_go) || (j <= 7 && !has_go)) continue;
            return false;
        }
        return true;
    });
    // do trim test from beginning and from present...
    // (3)
    unit.test(() => {
        click_el('#jump-to-beginning');
        click_el('#sel-monomate');
        click_el('#selected-item .mul-left');
        return    el_exists('#feed-history-1') && !el_exists('#feed-history-2')
               && !el_exists('#feed-history-0');
    });
    // (4)
    unit.test(() => {
        click_el('#jump-to-beginning');
        click_el('#feed-history-13 a');
        click_el('#sel-monomate');
        click_el('#selected-item .mul-left');
        
        // much like a previous test case
        for (let j = 1; j < 15; ++j) {
            if (!el_exists('#feed-history-'+j))
                return false;
        }
        
        return !el_exists('#feed-history-0')&& !el_exists('#feed-history-15');
    });
    // jumping to beginning should grey out all of the history links
    // (5)
    unit.test(() => {
        click_el('#jump-to-beginning');
        for (let j = 1; j < 13; ++j) {
            let el = $('#feed-history-'+j);
            if (!el.hasClass('pending-removal')) return false;
        }
        return true;
    });
};

return Object.freeze({
    cut_test : do_cut_test
});

})(); // end top-level arrow function
