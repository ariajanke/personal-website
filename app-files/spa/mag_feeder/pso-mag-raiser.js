/*jshint esversion: 6 */
let pso_mag_raiser = (function() {
"use strict";
 
// character data example

const k_character_constants = Object.freeze((function() { 
    let counter = (() => {
        let num = 0;
        return { get_ : () => { return num++; } };
    })();
    let rv = {
        class_names : 
            ['humar', 'hunewearl', 'hucast'  , 'hucaseal' ,
             'ramar', 'racast'   , 'racaseal', 'ramarl'   ,
             'fomar', 'fomarl'   , 'fonewm'  , 'fonewearl'],
        'class' : {
            hunter : counter.get_(),
            ranger : counter.get_(),
            force  : counter.get_()
        },
        sex : {
            male   : counter.get_(),
            female : counter.get_()
        },
        race : {
            human  : counter.get_(),
            newman : counter.get_(),
            cast   : counter.get_()
        },
        sec_id : {
            bluefull  : counter.get_(),
            greenill  : counter.get_(),
            oran      : counter.get_(),
            pinkal    : counter.get_(),
            purplenum : counter.get_(),
            redria    : counter.get_(),
            skyly     : counter.get_(),
            viridia   : counter.get_(),
            yellowboze: counter.get_(),
            whitill   : counter.get_()
        }
    };
    rv.even_ids = [rv.sec_id.viridia , rv.sec_id.skyly, rv.sec_id.purplenum,
                   rv.sec_id.redria  , rv.sec_id.yellowboze];
    rv.odd_ids  = [rv.sec_id.greenill, rv.sec_id.bluefull, rv.sec_id.pinkal,
                   rv.sec_id.oran    , rv.sec_id.whitill];
    return rv;
})());

// first there's going to be lots of data

const k_item_names = Object.freeze({
    monomate      : 'Monomate'     ,
    dimate        : 'Dimate'       ,
    trimate       : 'Trimate'      ,
    monofluid     : 'Monofluid'    ,
    difluid       : 'Difluid'      ,
    trifluid      : 'Trifluid'     ,
    antidote      : 'Antidote'     ,
    antiparalysis : 'Antiparalysis',
    sol_atomizer  : 'Sol Atomizer' ,
    moon_atomizer : 'Moon Atomizer',
    star_atomizer : 'Star Atomizer'
});

const k_item_costs = Object.freeze({
    monomate      :   50,
    dimate        :  300,
    trimate       : 2000,
    monofluid     :  100,
    difluid       :  500,
    trifluid      : 3600,
    antidote      :   60,
    antiparalysis :   60,
    sol_atomizer  :  300,
    moon_atomizer :  500,
    star_atomizer : 5000
});

const k_feed_charts = Object.freeze((function() {

// for Ashvinau, Marutah, Namuci, Rudra and Sumba
function get_2nd_evo_for_5() {
    return {
        monomate      : { sync :  0   , iq : -1, def :  0.01, pow :  0.09, dex : 0   , mind : -0.05 },
        dimate        : { sync :  0.03, iq :  0, def :  0.01, pow :  0.13, dex : 0   , mind : -0.1  },
        trimate       : { sync :  0.04, iq :  1, def :  0.08, pow :  0.16, dex : 0.02, mind : -0.15 },
        monofluid     : { sync :  0   , iq : -1, def :  0   , pow : -0.05, dex : 0   , mind :  0.09 },
        difluid       : { sync :  0.03, iq :  0, def :  0.04, pow : -0.1 , dex : 0   , mind :  0.13 },
        trifluid      : { sync :  0.03, iq :  2, def :  0.06, pow : -0.15, dex : 0.05, mind :  0.17 },
        antidote      : { sync : -0.01, iq :  1, def : -0.05, pow :  0.04, dex : 0.12, mind : -0.05 },
        antiparalysis : { sync :  0   , iq :  0, def : -0.05, pow : -0.06, dex : 0.11, mind :  0.04 },
        sol_atomizer  : { sync :  0.04, iq : -2, def :  0   , pow :  0.11, dex : 0.03, mind : -0.05 },
        moon_atomizer : { sync : -0.01, iq :  1, def :  0.04, pow : -0.05, dex : 0   , mind :  0.11 },
        star_atomizer : { sync :  0.04, iq :  2, def :  0.07, pow :  0.08, dex : 0.06, mind :  0.09 }
    };
}

// for Apsaras, Bhirava, Kaitabha, Kama, Kumara, Ushasu, Varaha and Vayu
function get_3rd_evo_for_7_apsaras() {
    return {
        monomate      : { sync :  0.02, iq : -1, def : -0.05, pow :  0.09, dex : -0.05, mind :  0    },
        dimate        : { sync :  0.02, iq :  0, def :  0   , pow :  0.11, dex :  0   , mind : -0.1  },
        trimate       : { sync :  0   , iq :  1, def :  0.04, pow :  0.14, dex :  0   , mind : -0.15 },
        monofluid     : { sync :  0.02, iq : -1, def : -0.05, pow :  0   , dex : -0.06, mind :  0.1  },
        difluid       : { sync :  0.02, iq :  0, def :  0   , pow : -0.1 , dex :  0   , mind :  0.11 },
        trifluid      : { sync :  0   , iq :  1, def :  0.04, pow : -0.15, dex :  0   , mind :  0.15 },
        antidote      : { sync :  0.02, iq : -1, def : -0.05, pow : -0.05, dex :  0.16, mind : -0.05 },
        antiparalysis : { sync : -0.02, iq :  3, def :  0.07, pow : -0.03, dex :  0   , mind : -0.03 },
        sol_atomizer  : { sync :  0.04, iq : -2, def :  0.05, pow :  0.21, dex : -0.05, mind : -0.2  },
        moon_atomizer : { sync :  0.03, iq :  0, def : -0.05, pow : -0.2 , dex :  0.05, mind :  0.21 },
        star_atomizer : { sync :  0.03, iq :  2, def :  0.04, pow :  0.06, dex :  0.08, mind :  0.05 }
    };
}

// for Andhaka, Bana, Bhima, Kabanda, Madhu, Marica, Naga, Naraka, Pushan, Rati and Ravana
function get_3rd_evo_for_8() {
    return {
        monomate      : { sync : -0.01, iq :  1, def : -0.03, pow :  0.09, dex : -0.03, mind : -0.04 },
        dimate        : { sync :  0.02, iq :  0, def :  0   , pow :  0.11, dex :  0   , mind : -0.1  },
        trimate       : { sync :  0.02, iq :  0, def :  0.02, pow :  0.15, dex :  0   , mind : -0.16 },
        monofluid     : { sync : -0.01, iq :  1, def : -0.03, pow : -0.04, dex : -0.03, mind :  0.09 },
        difluid       : { sync :  0.02, iq :  0, def :  0   , pow : -0.1 , dex :  0   , mind :  0.11 },
        trifluid      : { sync :  0.02, iq :  0, def : -0.02, pow : -0.15, dex :  0   , mind :  0.19 },
        antidote      : { sync :  0.02, iq : -1, def :  0   , pow :  0.06, dex :  0.09, mind : -0.15 },
        antiparalysis : { sync : -0.02, iq :  3, def :  0   , pow : -0.15, dex :  0.09, mind :  0.06 },
        sol_atomizer  : { sync :  0.03, iq : -1, def :  0.09, pow : -0.2 , dex : -0.05, mind :  0.17 },
        moon_atomizer : { sync :  0   , iq :  2, def : -0.05, pow :  0.2 , dex :  0.05, mind : -0.2  },
        star_atomizer : { sync :  0.03, iq :  2, def :  0   , pow :  0.11, dex :  0   , mind :  0.11 }
    };
}

// for Deva, Durga, Garuda, Ila, Nandin, Ribhava, Rukmin, Sato, Sita, Soma and Yaksa
function get_3rd_evo_for_7_durga() {
    return {
        monomate      : { sync :  0.02, iq : -1, def : -0.04, pow :  0.13, dex : -0.05, mind : -0.05 },
        dimate        : { sync :  0   , iq :  1, def :  0   , pow :  0.16, dex :  0   , mind : -0.15 },
        trimate       : { sync :  0.02, iq :  0, def :  0.03, pow :  0.19, dex : -0.02, mind : -0.18 },
        monofluid     : { sync :  0.02, iq : -1, def : -0.04, pow : -0.05, dex : -0.05, mind :  0.13 },
        difluid       : { sync :  0   , iq :  1, def :  0   , pow : -0.15, dex :  0   , mind :  0.16 },
        trifluid      : { sync :  0.02, iq :  0, def :  0.03, pow : -0.2 , dex :  0   , mind :  0.19 },
        antidote      : { sync :  0   , iq :  1, def :  0.05, pow : -0.06, dex :  0.06, mind : -0.05 },
        antiparalysis : { sync : -0.01, iq :  1, def :  0   , pow : -0.04, dex :  0.14, mind : -0.1  },
        sol_atomizer  : { sync :  0.04, iq : -1, def :  0.04, pow :  0.17, dex : -0.05, mind : -0.15 },
        moon_atomizer : { sync :  0.02, iq :  0, def : -0.1 , pow : -0.15, dex :  0.05, mind :  0.21 },
        star_atomizer : { sync :  0.03, iq :  2, def :  0.02, pow :  0.08, dex :  0.03, mind :  0.06 }
    };
}

// for Mitra, Surya and Tapas
function get_2nd_evo_for_3() {
    return {
        monomate      : { sync :  0   , iq : -1, def :  0   , pow :  0.03, dex :  0   , mind :  0    },
        dimate        : { sync :  0.02, iq :  0, def :  0.05, pow :  0.07, dex :  0   , mind : -0.05 },
        trimate       : { sync :  0.03, iq :  1, def :  0.04, pow :  0.14, dex :  0.06, mind : -0.1  },
        monofluid     : { sync :  0   , iq :  0, def :  0   , pow :  0   , dex :  0   , mind :  0.04 },
        difluid       : { sync :  0   , iq :  1, def :  0.04, pow : -0.05, dex :  0   , mind :  0.08 },
        trifluid      : { sync :  0.02, iq :  2, def :  0.04, pow : -0.1 , dex :  0.03, mind :  0.15 },
        antidote      : { sync : -0.03, iq :  3, def :  0   , pow :  0   , dex :  0.07, mind :  0    },
        antiparalysis : { sync :  0.03, iq :  0, def : -0.04, pow : -0.05, dex :  0.2 , mind : -0.05 },
        sol_atomizer  : { sync :  0.03, iq : -2, def : -0.1 , pow :  0.09, dex :  0.06, mind :  0.09 },
        moon_atomizer : { sync : -0.02, iq :  2, def :  0.08, pow :  0.05, dex : -0.08, mind :  0.07 },
        star_atomizer : { sync :  0.03, iq :  2, def :  0.07, pow :  0.07, dex :  0.07, mind :  0.07 }
    };
}

// for Diwari, Nidra, Savitri
function get_4th_evo_for_3() {
    return {
        monomate      : { sync : -0.01, iq :  0, def : -0.04, pow :  0.21, dex : -0.15, mind : -0.05 },
        dimate        : { sync :  0   , iq :  1, def : -0.01, pow :  0.27, dex : -0.1 , mind : -0.16 },
        trimate       : { sync :  0.02, iq :  0, def :  0.05, pow :  0.29, dex : -0.07, mind : -0.25 },
        monofluid     : { sync : -0.01, iq :  0, def : -0.1 , pow : -0.05, dex : -0.1 , mind :  0.21 },
        difluid       : { sync :  0   , iq :  1, def : -0.05, pow : -0.16, dex : -0.05, mind :  0.25 },
        trifluid      : { sync :  0.02, iq :  0, def : -0.07, pow : -0.25, dex :  0.06, mind :  0.29 },
        antidote      : { sync : -0.01, iq :  1, def : -0.1 , pow : -0.1 , dex :  0.28, mind : -0.1  },
        antiparalysis : { sync :  0.02, iq : -1, def :  0.09, pow : -0.18, dex :  0.24, mind : -0.15 },
        sol_atomizer  : { sync :  0.02, iq :  1, def :  0.19, pow :  0.18, dex : -0.15, mind : -0.2  },
        moon_atomizer : { sync :  0.02, iq :  1, def : -0.15, pow : -0.2 , dex :  0.19, mind :  0.18 },
        star_atomizer : { sync :  0.04, iq :  2, def :  0.03, pow :  0.07, dex :  0.03, mind :  0.03 }
    };
}

return {
    mag : {
        monomate      : { sync : 0.03, iq : 3, def : 0.05, pow : 0.4 , dex : 0.05, mind : 0    },
        dimate        : { sync : 0.03, iq : 3, def : 0.1 , pow : 0.45, dex : 0.05, mind : 0    },
        trimate       : { sync : 0.04, iq : 4, def : 0.15, pow : 0.5 , dex : 0.1 , mind : 0    },
        monofluid     : { sync : 0.03, iq : 3, def : 0.05, pow : 0   , dex : 0.05, mind : 0.4  },
        difluid       : { sync : 0.03, iq : 3, def : 0.1 , pow : 0   , dex : 0.05, mind : 0.45 },
        trifluid      : { sync : 0.04, iq : 4, def : 0.15, pow : 0   , dex : 0.1 , mind : 0.5  },
        antidote      : { sync : 0.03, iq : 3, def : 0.05, pow : 0.1 , dex : 0.4 , mind : 0    },
        antiparalysis : { sync : 0.03, iq : 3, def : 0.05, pow : 0   , dex : 0.44, mind : 0.1  },
        sol_atomizer  : { sync : 0.04, iq : 1, def : 0.15, pow : 0.3 , dex : 0.15, mind : 0.25 },
        moon_atomizer : { sync : 0.04, iq : 1, def : 0.15, pow : 0.25, dex : 0.15, mind : 0.3  },
        star_atomizer : { sync : 0.06, iq : 5, def : 0.25, pow : 0.25, dex : 0.25, mind : 0.25 }
    },
    // first evolution
    varuna : {
        monomate      : { sync :  0   , iq :  0, def :  0.05, pow :  0.1 , dex : 0   , mind : -0.01 },
        dimate        : { sync :  0.02, iq :  1, def :  0.06, pow :  0.15, dex : 0.03, mind : -0.03 },
        trimate       : { sync :  0.03, iq :  2, def :  0.12, pow :  0.21, dex : 0.04, mind : -0.07 },
        monofluid     : { sync :  0   , iq :  0, def :  0.05, pow :  0   , dex : 0   , mind :  0.08 },
        difluid       : { sync :  0.02, iq :  1, def :  0.07, pow :  0   , dex : 0.03, mind :  0.13 },
        trifluid      : { sync :  0.03, iq :  2, def :  0.07, pow : -0.07, dex : 0.06, mind :  0.19 },
        antidote      : { sync :  0   , iq :  1, def :  0   , pow :  0.05, dex : 0.15, mind :  0    },
        antiparalysis : { sync :  0.02, iq :  0, def : -0.01, pow :  0   , dex : 0.14, mind :  0.05 },
        sol_atomizer  : { sync : -0.02, iq :  2, def :  0.1 , pow :  0.11, dex : 0.08, mind :  0    },
        moon_atomizer : { sync :  0.03, iq : -2, def :  0.09, pow :  0   , dex : 0.09, mind :  0.11 },
        star_atomizer : { sync :  0.04, iq :  3, def :  0.14, pow :  0.09, dex : 0.18, mind :  0.11 }
    },
    kalki : {
        monomate      : { sync :  0   , iq :  0, def :  0.05, pow :  0.1 , dex : 0   , mind : -0.01 },
        dimate        : { sync :  0.02, iq :  1, def :  0.06, pow :  0.15, dex : 0.03, mind : -0.03 },
        trimate       : { sync :  0.03, iq :  2, def :  0.12, pow :  0.21, dex : 0.04, mind : -0.07 },
        monofluid     : { sync :  0   , iq :  0, def :  0.05, pow :  0   , dex : 0   , mind :  0.08 },
        difluid       : { sync :  0.02, iq :  1, def :  0.07, pow :  0   , dex : 0.03, mind :  0.13 },
        trifluid      : { sync :  0.03, iq :  2, def :  0.07, pow : -0.07, dex : 0.06, mind :  0.19 },
        antidote      : { sync :  0   , iq :  1, def :  0   , pow :  0.05, dex : 0.15, mind :  0    },
        antiparalysis : { sync :  0.02, iq :  0, def : -0.01, pow :  0   , dex : 0.14, mind :  0.05 },
        sol_atomizer  : { sync : -0.02, iq :  2, def :  0.1 , pow :  0.11, dex : 0.08, mind :  0    },
        moon_atomizer : { sync :  0.03, iq : -2, def :  0.09, pow :  0   , dex : 0.09, mind :  0.11 },
        star_atomizer : { sync :  0.04, iq :  3, def :  0.14, pow :  0.09, dex : 0.18, mind :  0.11 }
    },
    vritra : {
        monomate      : { sync :  0   , iq :  0, def :  0.05, pow :  0.1 , dex : 0   , mind : -0.01 },
        dimate        : { sync :  0.02, iq :  1, def :  0.06, pow :  0.15, dex : 0.03, mind : -0.03 },
        trimate       : { sync :  0.03, iq :  2, def :  0.12, pow :  0.21, dex : 0.04, mind : -0.07 },
        monofluid     : { sync :  0   , iq :  0, def :  0.05, pow :  0   , dex : 0   , mind :  0.08 },
        difluid       : { sync :  0.02, iq :  1, def :  0.07, pow :  0   , dex : 0.03, mind :  0.13 },
        trifluid      : { sync :  0.03, iq :  2, def :  0.07, pow : -0.07, dex : 0.06, mind :  0.19 },
        antidote      : { sync :  0   , iq :  1, def :  0   , pow :  0.05, dex : 0.15, mind :  0    },
        antiparalysis : { sync :  0.02, iq :  0, def : -0.01, pow :  0   , dex : 0.14, mind :  0.05 },
        sol_atomizer  : { sync : -0.02, iq :  2, def :  0.1 , pow :  0.11, dex : 0.08, mind :  0    },
        moon_atomizer : { sync :  0.03, iq : -2, def :  0.09, pow :  0   , dex : 0.09, mind :  0.11 },
        star_atomizer : { sync :  0.04, iq :  3, def :  0.14, pow :  0.09, dex : 0.18, mind :  0.11 }
    },
    // 2nd evolution mags
    rudra    : get_2nd_evo_for_5        (),
    marutah  : get_2nd_evo_for_5        (),
    vayu     : get_3rd_evo_for_7_apsaras(),
    surya    : get_2nd_evo_for_3        (),
    mitra    : get_2nd_evo_for_3        (),
    tapas    : get_2nd_evo_for_3        (),
    sumba    : get_2nd_evo_for_5        (),
    ashvinau : get_2nd_evo_for_5        (),
    namuci   : get_2nd_evo_for_5        (),
    // 3rd evolution mags
    andhaka  : get_3rd_evo_for_8        (),
    apsaras  : get_3rd_evo_for_7_apsaras(),
    bana     : get_3rd_evo_for_8        (),
    bhirava  : get_3rd_evo_for_7_apsaras(),
    durga    : get_3rd_evo_for_7_durga  (),
    garuda   : get_3rd_evo_for_7_durga  (),
    ila      : get_3rd_evo_for_7_durga  (),
    kabanda  : get_3rd_evo_for_8        (),
    kaitabha : get_3rd_evo_for_7_apsaras(),
    kama     : get_3rd_evo_for_7_apsaras(),
    kumara   : get_3rd_evo_for_7_apsaras(),
    madhu    : get_3rd_evo_for_8        (),
    marica   : get_3rd_evo_for_8        (),
    naga     : get_3rd_evo_for_8        (),
    nandin   : get_3rd_evo_for_7_durga  (),
    naraka   : get_3rd_evo_for_8        (),
    ravana   : get_3rd_evo_for_8        (),
    ribhava  : get_3rd_evo_for_7_durga  (),
    sita     : get_3rd_evo_for_7_durga  (),
    soma     : get_3rd_evo_for_7_durga  (),
    ushasu   : get_3rd_evo_for_7_apsaras(),
    varaha   : get_3rd_evo_for_7_apsaras(),
    yaksa    : get_3rd_evo_for_7_durga  (),
    // 4th evolution mags
    bhima    : get_3rd_evo_for_8        (),
    deva     : get_3rd_evo_for_7_durga  (),
    diwari   : get_4th_evo_for_3        (),
    nidra    : get_4th_evo_for_3        (),
    pushan   : get_3rd_evo_for_8        (),
    rati     : get_3rd_evo_for_8        (),
    rukmin   : get_3rd_evo_for_7_durga  (),
    sato     : get_3rd_evo_for_7_durga  (),
    savitri  : get_4th_evo_for_3        ()
};

})()); // end of function initializing feed_charts

const k_stat_names = Object.freeze(['def', 'pow', 'dex', 'mind']);

const verify_mag_name_in_feed_charts = name => {
    if (k_feed_charts[name] === undefined) {
        throw 'name not in feed charts';
    }
    return name;
};

const k_mag_cells = Object.freeze({
    liberta_kit : (() => {
        const can_ev = mag => mag.level() > 50;
        return false;
    })()
    
});

const sum_of_levels = level_table => {
    let sum_ = 0;
    k_stat_names.forEach((item) => {
        sum_ += level_table[item];
    });
    return sum_;
};

const is_odd_id = id =>
    k_character_constants.odd_ids.some((item) => item === id);

const is_even_id = id =>
    k_character_constants.even_ids.some((item) => item === id);

function make_2nd_evo_function(pow_name, dex_name, mind_name, fallback) {
    return (stats, owner) => {
        if (sum_of_levels(stats) < 35) return undefined;
        if (stats.pow > stats.dex && stats.pow > stats.mind)
            return pow_name;
        else if (stats.dex > stats.pow && stats.dex > stats.mind)
            return dex_name;
        else if (stats.mind > stats.pos && stats.mind > stats.dex)
            return mind_name;
        else
            return fallback;
    };
}

const handle_2nd_to_3rd_evo = (() => {
    const do_even_hunter = stats => {
        let pow = stats.pow, dex = stats.dex, mind = stats.mind;
        if (pow  > dex  && dex  >= mind) return 'varaha' ;
        if (pow  > mind && mind >  dex ) return 'bhirava';
        if (dex  > pow  && pow  >  mind) return 'ila'    ;
        if (dex  > mind && mind >= pow ) return 'nandin' ;
        if (mind > pow  && pow  >= dex ) return 'kabanda';
        if (mind > dex  && dex  >  pow ) return 'ushasu' ;
        if (dex >= mind) return 'varaha' ;
        if (mind < dex ) return 'bhirava';
        throw 'unhandled mag stat arrangement';
    };
    const do_odd_hunter = stats => {
        let pow = stats.pow, dex = stats.dex, mind = stats.mind;
        if (pow  > dex  && dex  >= mind) return 'kama'   ;
        if (pow  > mind && mind >  dex ) return 'apsaras';
        if (dex  > pow  && pow  >  mind) return 'garuda' ;
        if (dex  > mind && mind >= pow ) return 'yaksa'  ;
        if (mind > pow  && pow  >= dex ) return 'bana'   ;
        if (mind > dex  && dex  >  pow ) return 'soma'   ;
        if (dex >= mind) return 'kama' ;
        if (mind < dex ) return 'apsaras';
        throw 'unhandled mag stat arrangement';
    };
    const do_even_ranger = stats => {
        let pow = stats.pow, dex = stats.dex, mind = stats.mind;
        if (pow  > dex  && dex  >= mind) return 'kama'   ;
        if (pow  > mind && mind >  dex ) return 'bhirava';
        if (dex  > pow  && pow  >  mind) return 'bhirava';
        if (dex  > mind && mind >= pow ) return 'kama'   ;
        if (mind > pow  && pow  >= dex ) return 'varaha' ;
        if (mind > dex  && dex  >  pow ) return 'apsaras';
        if (pow >= mind) return 'bhirava';
        if (mind < pow ) return 'kama'   ;
        throw 'unhandled mag stat arrangement';
    };
    const do_odd_ranger = stats => {
        let pow = stats.pow, dex = stats.dex, mind = stats.mind;
        if (pow  > dex  && dex  >= mind) return 'madhu'   ;
        if (pow  > mind && mind >  dex ) return 'kaitabha';
        if (dex  > pow  && pow  >  mind) return 'kaitabha';
        if (dex  > mind && mind >= pow ) return 'varaha'  ;
        if (mind > pow  && pow  >= dex ) return 'kabanda' ;
        if (mind > dex  && dex  >  pow ) return 'durga'   ;
        if (pow >= mind) return 'kaitabha';
        if (mind < pow ) return 'varaha'  ;
        throw 'unhandled mag stat arrangement';
    };
    const do_even_force = stats => {
        let pow = stats.pow, dex = stats.dex, def = stats.def, mind = stats.mind;
        if (pow  > dex  && dex  >= mind)
            return (def < 45) ? 'naraka' : 'andhaka';
        if (pow  > mind && mind >  dex )
            return (def < 45) ? 'ravana' : 'andhaka';
        if (dex  > pow  && pow  >  mind)
            return (def < 45) ? 'ribhava' : 'bana';
        if (dex  > mind && mind >= pow )
            return (def < 45) ? 'sita' : 'bana';
        if (mind > pow  && pow  >= dex )
            return (def < 45) ? 'naga' : 'bana';
        if (mind > dex  && dex  >  pow )
            return (def < 45) ? 'kabanda' : 'bana';
        if (def < 45)
            return (pow >= dex) ? 'naga' : 'kabanda';
        return 'bana';
    };
    const do_odd_force = stats => {
        let pow = stats.pow, dex = stats.dex, def = stats.def, mind = stats.mind;
        if (pow  > dex  && dex  >= mind)
            return (def < 45) ? 'marica' : 'andhaka';
        if (pow  > mind && mind >  dex )
            return (def < 45) ? 'naga' : 'andhaka';
        if (dex  > pow  && pow  >  mind)
            return (def < 45) ? 'garuda' : 'bana';
        if (dex  > mind && mind >= pow )
            return (def < 45) ? 'bhirava' : 'bana';
        if (mind > pow  && pow  >= dex )
            return (def < 45) ? 'kumara' : 'bana';
        if (mind > dex  && dex  >  pow )
            return (def < 45) ? 'ila' : 'bana';
        if (def < 45)
            return (pow >= dex) ? 'kumara' : 'ila';
        return 'bana';
    };
    const k = k_character_constants;
    return (stats, owner) => {
        let level = sum_of_levels(stats);
        if (level < 50 || level % 5 !== 0) return undefined;
        let is_even = is_even_id(owner.sec_id);
        if (!is_even && !is_odd_id(owner.sec_id))
            throw 'handle_2nd_to_3rd_evo: invalid section id';
        if (owner['class'] === k['class'].hunter)
            return (is_even) ? do_even_hunter(stats) : do_odd_hunter(stats);
        if (owner['class'] === k['class'].ranger)
            return (is_even) ? do_even_ranger(stats) : do_odd_ranger(stats);
        // forces are even worse
        if (owner['class'] === k['class'].force)
            return (is_even) ? do_even_force(stats) : do_odd_force(stats);
        throw 'handle_2nd_to_3rd_evo: owner has an invalid class id';

    };
})();

const handle_3rd_to_4th_evo = (() => {
    const k = k_character_constants;
    const bad_branch_msg = 'handle_3rd_to_4th_evo: bad branch reached, this ' +
                           'maybe a sign of invalid an owner.';
        
    return (stats, owner) => {
        let level = sum_of_levels(stats);
        if (level %  5 !== 0) return undefined;
        if (level % 10 !== 0) return handle_2nd_to_3rd_evo(stats, owner);
        
        let pow = stats.pow, dex = stats.dex, def = stats.def, mind = stats.mind;
        let is_male = owner.sex === k.sex.male;
        if (!is_male && owner.sex !== k.sex.female) {
            throw 'handle_3rd_to_4th_evo: owner gender not covered by ' +
                  'possible character classes';
        }
        
        switch (owner.sec_id) {
        case k.sec_id.skyly: case k.sec_id.pinkal: case k.sec_id.yellowboze:
            if (def + pow !== dex + mind) break;
            switch (owner.class) {
            case k.class.hunter: return is_male ? 'rati'   : 'savitri';
            case k.class.ranger: return is_male ? 'pushan' : 'diwari' ;
            case k.class.force : return is_male ? 'nidra'  : 'bhima'  ;
            }
            throw bad_branch_msg;
        case k.sec_id.viridia: case k.sec_id.bluefull: case k.sec_id.redria:
        case k.sec_id.whitill:
            if (def + dex !== pow + mind) break;
            switch (owner.class) {
            case k.class.hunter: return is_male ? 'deva'   : 'savitri';
            case k.class.ranger: return is_male ? 'pushan' : 'rukmin' ;
            case k.class.force : return is_male ? 'nidra'  : 'sato'   ;
            }
            throw bad_branch_msg;
        case k.sec_id.greenill: case k.sec_id.purplenum: case k.sec_id.oran:
            if (def + mind !== pow + dex) break;
            switch (owner.class) {
            case k.class.hunter: return is_male ? 'rati'   : 'savitri';
            case k.class.ranger: return is_male ? 'pushan' : 'rukmin' ;
            case k.class.force : return is_male ? 'nidra'  : 'bhima'  ;
            }
            throw bad_branch_msg;
        }
        return handle_2nd_to_3rd_evo(stats, owner);
    };
})();

const k_mag_info = Object.freeze({
    mag : { hex : '000002', 
        evolves_to : (stats, owner) => {
            var k = k_character_constants;
            if (sum_of_levels(stats) < 10) return undefined;
            switch (owner.class) {
            case k.class.hunter: return 'varuna';
            case k.class.ranger: return 'kalki' ;
            case k.class.force : return 'vritra';
            default: throw 'owner class is invalid.';
            }
        } },
    // first evolution
    varuna : { hex : '000102',
        evolves_to : make_2nd_evo_function('rudra', 'marutah', 'vayu', 'rudra'),
        pb_added : 'farlla' },
    kalki  : { hex : '000D02',
        evolves_to : make_2nd_evo_function('surya', 'mitra', 'tapas', 'mitra'),
        pb_added : 'estilla' },
    vritra : { hex : '001902',
        evolves_to : make_2nd_evo_function('sumba', 'ashvinau', 'namuci', 'namuci'),
        pb_added : 'leilla' },
    // 2nd evolution mags
    rudra    : { hex : '000E02', evolves_to : handle_2nd_to_3rd_evo, pb_added : 'golla' },
    marutah  : { hex : '000F02', evolves_to : handle_2nd_to_3rd_evo, pb_added : 'pilla' },
    vayu     : { hex : '000402', evolves_to : handle_2nd_to_3rd_evo, pb_added : 'mylla_and_youlla' },
    surya    : { hex : '000302', evolves_to : handle_2nd_to_3rd_evo, pb_added : 'golla' },
    mitra    : { hex : '000202', evolves_to : handle_2nd_to_3rd_evo, pb_added : 'pilla' },
    tapas    : { hex : '000B02', evolves_to : handle_2nd_to_3rd_evo, pb_added : 'mylla_and_youlla' },
    sumba    : { hex : '001B02', evolves_to : handle_2nd_to_3rd_evo, pb_added : 'golla' },
    ashvinau : { hex : '001402', evolves_to : handle_2nd_to_3rd_evo, pb_added : 'pilla' },
    namuci   : { hex : '001A02', evolves_to : handle_2nd_to_3rd_evo, pb_added : 'mylla_and_youlla' },
    // 3rd evolution mags
    andhaka  : { hex : '002302', evolves_to : handle_3rd_to_4th_evo, pb_added : 'estilla' },
    apsaras  : { hex : '000802', evolves_to : handle_3rd_to_4th_evo, pb_added : 'estilla' },
    bana     : { hex : '002402', evolves_to : handle_3rd_to_4th_evo, pb_added : 'estilla' },
    bhirava  : { hex : '000C02', evolves_to : handle_3rd_to_4th_evo, pb_added : 'pilla' },
    durga    : { hex : '001802', evolves_to : handle_3rd_to_4th_evo, pb_added : 'estilla' },
    garuda   : { hex : '001202', evolves_to : handle_3rd_to_4th_evo, pb_added : 'pilla' },
    ila      : { hex : '001702', evolves_to : handle_3rd_to_4th_evo, pb_added : 'mylla_and_youlla' },
    kabanda  : { hex : '001E02', evolves_to : handle_3rd_to_4th_evo, pb_added : 'mylla_and_youlla' },
    kaitabha : { hex : '000A02', evolves_to : handle_3rd_to_4th_evo, pb_added : 'mylla_and_youlla' },
    kama     : { hex : '000602', evolves_to : handle_3rd_to_4th_evo, pb_added : 'pilla' },
    kumara   : { hex : '000902', evolves_to : handle_3rd_to_4th_evo, pb_added : 'golla' },
    madhu    : { hex : '002602', evolves_to : handle_3rd_to_4th_evo, pb_added : 'mylla_and_youlla' },
    marica   : { hex : '002002', evolves_to : handle_3rd_to_4th_evo, pb_added : 'pilla' },
    naga     : { hex : '001C02', evolves_to : handle_3rd_to_4th_evo, pb_added : 'mylla_and_youlla' },
    nandin   : { hex : '001302', evolves_to : handle_3rd_to_4th_evo, pb_added : 'estilla' },
    naraka   : { hex : '002502', evolves_to : handle_3rd_to_4th_evo, pb_added : 'golla' },
    ravana   : { hex : '001F02', evolves_to : handle_3rd_to_4th_evo, pb_added : 'farlla' },
    ribhava  : { hex : '001502', evolves_to : handle_3rd_to_4th_evo, pb_added : 'farlla' },
    sita     : { hex : '001102', evolves_to : handle_3rd_to_4th_evo, pb_added : 'pilla' },
    soma     : { hex : '001602', evolves_to : handle_3rd_to_4th_evo, pb_added : 'estilla' },
    ushasu   : { hex : '000702', evolves_to : handle_3rd_to_4th_evo, pb_added : 'golla' },
    varaha   : { hex : '000502', evolves_to : handle_3rd_to_4th_evo, pb_added : 'golla' },
    yaksa    : { hex : '001002', evolves_to : handle_3rd_to_4th_evo, pb_added : 'golla' },
    // 4th evolution mags
    bhima    : { hex : '004002', evolves_to : () => undefined },
    deva     : { hex : '003902', evolves_to : () => undefined },
    diwari   : { hex : '003E02', evolves_to : () => undefined },
    nidra    : { hex : '004100', evolves_to : () => undefined },
    pushan   : { hex : '003D02', evolves_to : () => undefined },
    rati     : { hex : '003A02', evolves_to : () => undefined },
    rukmin   : { hex : '003C02', evolves_to : () => undefined },
    sato     : { hex : '003F02', evolves_to : () => undefined },
    savitri  : { hex : '003B02', evolves_to : () => undefined }	
});

const k_photon_blasts = Object.freeze((function() {
    let rv = {};
    let i = 1;
    rv.farlla           = { left : 9      , center : i, right : (i - 1)*8 }; ++i;
    rv.estilla          = { /* undefined */ center : i, right : (i - 1)*8 }; ++i;
    rv.golla            = { left : 1      , center : i, right : (i - 1)*8 }; ++i;
    rv.pilla            = { left : 65     , center : i, right : (i - 1)*8 }; ++i;
    rv.leilla           = { left : 129    , center : i, right : (i - 1)*8 }; ++i;
    rv.mylla_and_youlla = { left : 193    , center : 0, right : (i - 1)*8 };
    // "0 Farlla", "1 Estlla", "2 Golla", "3 Pilla", "4 Leilla", "5 Mylla & Youlla"
    return rv;
})());

// "00 Red", "01 Blue", "02 Yellow", "03 Green", "04 Purple", "05 Dark Purple", 
// "06 White", "07 Cyan", "08 Brown", "09 Black", "0A (unused)", 
// "0B (unused)", "0C (unused)", "0D (unused)", "0E (unused)", "0F ???", "10 Pink", "11 ???"
// further exploration needed to get all 18 colors
const k_mag_colors = Object.freeze({
    red         : { hex : '00', rgb : '#F00' },
    blue        : { hex : '01', rgb : '#00F' },
    yellow      : { hex : '02', rgb : '#00F' },
    green       : { hex : '03', rgb : '#00F' },
    purple      : { hex : '04', rgb : '#00F' },
    dark_purple : { hex : '05', rgb : '#00F' },
    white       : { hex : '06', rgb : '#00F' },
    cyan        : { hex : '07', rgb : '#00F' },
    brown       : { hex : '08', rgb : '#00F' },
    black       : { hex : '09', rgb : '#000' },
    pink        : { hex : '10', rgb : '#00F' }
    /* Fuchsia */
});

// questions relating to mechanics of mag feeding:
// what if multiple stats overflow and hit 200?
// how are left over amounts affected by mag evolution?
// left overs are discarded upon evolution it seems... perhaps another test is
// warranted to be sure
// how about just between levels?
// carries over

const deep_copy = obj => {
    if (typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) {
        let rv = [];
        let obj_len = obj.length;
        for (let i = 0; i != obj_len; ++i) {
            rv[i] = deep_copy(obj[i]);
        }
        return rv;
    } else {
        var rv = {};
        for (var k in obj) { if (true) {
            rv[k] = deep_copy(obj[k]);
        }}
        return rv;
    }
};

const is_valid_photon_blasts_table = table => {
    let rv = true;
    ['left', 'center', 'right'].forEach(item => {
        if (table[item] === undefined) return;
        // is valid pb name?
        if (k_photon_blasts[table[item]] === undefined)
            rv = false;
    });
    // short circut
    if (!rv) return false;
    if (table.left === undefined || table.right === undefined || 
        table.center === undefined)
    { return true; }
    // rules recorded from ancient history
    // list of indicies to names
    // "X None", "0 Farlla", "1 Estlla", "2 Golla", "3 Pilla", "4 Leilla", 
    // "5 Mylla & Youlla", "6 Megid", "7 Grants"
    // rule 1
    if (table.left === table.right || table.left === table.center) return false;
    // rule 2
    // recorded for historical reasons
    /* if(table.left === 'megid' && table.center === table.right) return false; */ 
    // rule 3
    if (table.left === 'megid'
        && (   (table.center === 'grants' || table.center === '8')
            || (table.right  === 'grants' || table.right  === '8'))) 
    { return false; }
    if (table.left === 'farlla' || table.right === undefined || table.center === undefined)
        return true;
    return true;
};

const as_byte_string = (value, byte_count) => {
    if (typeof byte_count !== 'number')
        throw 'pad_value_as_byte_string: byte_count must be a number';
    if (typeof value === 'number') {
        value = Math.round(value).toString(16).toUpperCase();
    }
    if (value.length % 2 !== 0)
        value = '0' + value;
    while (value.length < byte_count*2)
        value = '00' + value;
    return value;
};

const reverse_byte_string = val => {
    if (val.length % 2 !== 0) {
        throw 'reverse_byte_string: string length must be divisible by two';
    }
    let rv = '';
    for (let i = val.length; i >= 0; i -= 2) {
        rv += val.substr(i, 2);
    }
    return rv;
};

const photon_blasts_to_hex = table => {
    let rv = 0;
    if (!is_valid_photon_blasts_table(table)) {
        is_valid_photon_blasts_table(table);
        throw 'photon_blasts_to_hex: invalid photon blasts table.';
    }
    ['left', 'center', 'right'].forEach(item => {
        if (table[item] === undefined) {
            return;
        }
        rv += k_photon_blasts[table[item]][item];
    });
    return as_byte_string(rv, 1);
};

const make_mag = init_table => {
    let me = {};
    let m_name = 'mag'; // must be internal name
    let m_stat_table = { sync : 0, iq : 0, def : 0, pow : 0, dex : 0, mind : 0 };
    let m_level_table = { def : 5, pow : 0, dex : 0, mind : 0 };
    let m_photon_blasts = {};
    let m_color = 'red';

    const do_level_up = owner => {
        let old_name = m_name;
        m_name = k_mag_info[m_name].evolves_to(m_level_table, owner) || m_name;
        if (old_name === m_name) return;
        let new_pb = k_mag_info[m_name].pb_added;
        // no dupelicate pb
        for (const slot in m_photon_blasts) {
            if (m_photon_blasts[slot] === new_pb) return;
        }
        if (m_photon_blasts.center === undefined) {
            m_photon_blasts.center = new_pb;
        } else if (m_photon_blasts.right === undefined) {
            m_photon_blasts.right = new_pb;
        } else if (m_photon_blasts.left === undefined) {
            m_photon_blasts.left = new_pb;
        }
    };

    const correct_stats = owner => {
        k_stat_names.forEach((item) => {
            while (m_stat_table[item] >= 1) {
                if (sum_of_levels(m_level_table) < 200) {
                    m_level_table[item]++;
                    do_level_up(owner);
                    m_stat_table[item] -= 1;
                } else {
                    m_stat_table[item] = 1;
                    break;
                }
            }
            m_stat_table[item] = Math.max(0.0, m_stat_table[item]);
        });
        m_stat_table.sync = Math.max(Math.min(1.2, m_stat_table.sync), 0);
        m_stat_table.iq   = Math.max(Math.min(200, m_stat_table.iq  ), 0);
    };
    
    (() => { // construct
        if (init_table === undefined) return;
        // validate table
        if (init_table.name !== undefined) {
            if (k_mag_info[init_table.name] === undefined)
                throw 'make_mag: init_table\'s name not valid';
        }
        let stat_table_  = deep_copy(m_stat_table );
        let level_table_ = deep_copy(m_level_table);
        if (init_table.levels !== undefined) {
            k_stat_names.forEach(function(item) {
                level_table_[item] = init_table.levels[item];
            });
        }
        if (sum_of_levels(level_table_) > 200) {
            throw 'make_mag: levels table\'s sum is greater than 200.';
        }
        if (init_table.stats !== undefined) {
            k_stat_names.forEach(function(item) {
                stat_table_[item] = init_table.stats[item];
            });
        }
        if (init_table.photon_blasts !== undefined) {
            ['left', 'center', 'right'].forEach(slot => {
                const pb_name = init_table.photon_blasts[slot];
                if (pb_name === undefined) return;
                if (k_photon_blasts[pb_name] !== undefined) return;
                throw 'make_mag: undefined photon blast "' + pb_name + '"';
            });
        }
        if (init_table.color !== undefined) {
            if (k_mag_colors[init_table.color] === undefined) {
                throw 'make_mag: color "' + init_table.color + 
                      '" is not a possible mag color.';
            }
            m_color = init_table.color;
        }
        // set object members
        m_name          = init_table.name;
        m_level_table   = level_table_;
        m_stat_table    = stat_table_;
        m_photon_blasts = init_table.photon_blasts || {};
        correct_stats();
    })();
    
    me.name = () => m_name;
    
    me.feed_item = (owner, itemname, number_of_times) => {
        if (typeof number_of_times !== 'number' && number_of_times !== undefined) {
            throw 'make_mag().feed_item: number_of_times must be a ' +
                  'number (value is "' + number_of_times + '")';
        }
        number_of_times = number_of_times || 1;
        
        let stat_delta = k_feed_charts[me.name()][itemname];
        if (stat_delta === undefined) {
            throw 'make_mag().feed_item: item name "' + itemname + 
                  '" is not something that can be fed to a mag';
        }
        
        ['sync', 'iq', 'def', 'pow', 'dex', 'mind'].forEach(function(item) {
            m_stat_table[item] += stat_delta[item];
        });
        correct_stats(owner);
        if (number_of_times < 2)
            return me;
        else
            return me.feed_item(owner, itemname, number_of_times - 1);
    };
    
    me.to_hex_string = () => {
        // I'm not sure the function of this data, it appears to be needed for
        // photon blasts
        let i = 0;
        if (m_photon_blasts.center) i += 1;
        if (m_photon_blasts.left  ) i += 4;
        if (m_photon_blasts.right ) i += 2;
        // first tuple
        return reverse_byte_string(k_mag_info[me.name()].hex.substr(2, 4)) + 
            as_byte_string(sum_of_levels(m_level_table), 1) + 
            photon_blasts_to_hex(m_photon_blasts) + ',' + 
            // second & third tuple
            reverse_byte_string(as_byte_string(m_level_table.def *100, 2)) + 
            reverse_byte_string(as_byte_string(m_level_table.pow *100, 2)) + ',' +
            reverse_byte_string(as_byte_string(m_level_table.dex *100, 2)) + 
            reverse_byte_string(as_byte_string(m_level_table.mind*100, 2)) + ',' +
            // final tuple
            as_byte_string(m_stat_table.sync, 1) +
            as_byte_string(m_stat_table.iq  , 1) +
            as_byte_string(i, 1) + k_mag_colors[m_color].hex;
    };
    
    me.iq   = () => m_stat_table.iq;
    me.sync = () => m_stat_table.sync;
    me.pow  = () => m_level_table.pow ;
    me.def  = () => m_level_table.def ;
    me.dex  = () => m_level_table.dex ;
    me.mind = () => m_level_table.mind;
    
    // okay, new 'method' :/
    me.level = () => me.pow() + me.def() + me.dex() + me.mind();

    me.pow_percent  = () => m_stat_table.pow ;
    me.def_percent  = () => m_stat_table.def ;
    me.dex_percent  = () => m_stat_table.dex ;
    me.mind_percent = () => m_stat_table.mind;

    me.color = () => m_color;
    me.clone = () => make_mag(me.dump());
    
    me.dump = () => ({
        name         : m_name,
        levels       : deep_copy(m_level_table),
        stats        : { def : m_stat_table.def, pow  : m_stat_table.pow, 
                         dex : m_stat_table.dex, mind : m_stat_table.mind },
        photon_blasts: deep_copy(m_photon_blasts),
        color        : m_color,
        sync         : m_stat_table.sync,
        iq           : m_stat_table.iq
    });

    const make_pb_getter = name =>
        () => m_photon_blasts[name] === undefined ? '&lt;NONE&gt;' : m_photon_blasts[name];

    me.left_photon_blast   = make_pb_getter('left'  );
    me.center_photon_blast = make_pb_getter('center');
    me.right_photon_blast  = make_pb_getter('right' );
    
    me.is_cell_mag = () => false;
    return me;
}; // end of make_mag

const k_char_makers = Object.freeze((() => {
    const k = k_character_constants;
    const k_reverse_class_lookup = (() => {
        let rv = {};
        for (const [key, value] of Object.entries(k['class'])) {
            rv[value] = key;
        }
        return rv;
    })();
    
    let verify_class_symbolic_value = i => {
        let rv = k_reverse_class_lookup[i];
        if (rv !== undefined) return rv;
        throw 'not a class symbolic constant';
    };
    
    let verify_sec_id_name = (sec_id_name) => {
        if (k.sec_id[sec_id_name] === undefined) {
            throw '"' + sec_id_name + '" is not a valid section id.';
        }
        return k.sec_id[sec_id_name];
    };
    
    // need symbolic constants to not break the code
    // but need the string values also...
    let mk_class_maker = (classid) => {
        return (sex_, race_) => {
            return (secid) => {
                return {
                    sec_id: verify_sec_id_name(secid), 'class': classid, 
                    sex: sex_, race: race_,
                    
                    // added for strings
                    class_name: verify_class_symbolic_value(classid),
                    section_id_name : secid
                };
            }; // char_maker + sec_id
        }; // char_maker - sec_id
    };
    
    let mk_hunter_maker = mk_class_maker(k['class'].hunter);
    let mk_ranger_maker = mk_class_maker(k['class'].ranger);
    let mk_force_maker  = mk_class_maker(k['class'].force );
    
    return {
        humar    : mk_hunter_maker(k.sex.  male, k.race.human ),
        hunewearl: mk_hunter_maker(k.sex.female, k.race.newman),
        hucast   : mk_hunter_maker(k.sex.  male, k.race.cast  ),
        hucaseal : mk_hunter_maker(k.sex.female, k.race.cast  ),
        ramar    : mk_ranger_maker(k.sex.  male, k.race.human ),
        ramarl   : mk_ranger_maker(k.sex.female, k.race.human ),
        racast   : mk_ranger_maker(k.sex.  male, k.race.cast  ),
        racaseal : mk_ranger_maker(k.sex.female, k.race.cast  ),
        fomar    : mk_force_maker (k.sex.  male, k.race.human ),
        fomarl   : mk_force_maker (k.sex.female, k.race.human ),
        fonewm   : mk_force_maker (k.sex.  male, k.race.newman),
        fonewearl: mk_force_maker (k.sex.female, k.race.newman)
    };
})());

function get_feed_chart_for(mag_name) {
    let rv = k_feed_charts[mag_name];
    if (rv === undefined) {
        throw "there is no mag named " + mag_name;
    } else {
        return rv;
    }
}

const make_history_tracker = (() => {

const k_ss_item_name_key = 'i';

const [shorten_character_table, lengthen_character_table, is_saved_character_table] = (() => {
    const k_class_key  = 'c';
    const k_sec_id_key = 's';
    const k_sex_key    = 'x';
    const k_race_key   = 'r';
    
    const shorten = chr => {
        let rv = {};
        rv[k_class_key ] = chr['class'];
        rv[k_sec_id_key] = chr.sec_id;
        rv[k_sex_key   ] = chr.sex;
        rv[k_race_key  ] = chr.race;
        return rv;
    };
    const lengthen = tbl => { 
        return { 'class': tbl[k_class_key], sec_id: tbl[k_sec_id_key],
                 sex    : tbl[k_sex_key  ], race  : tbl[k_race_key ]    };
    };
    return [shorten, lengthen, tbl => typeof tbl[k_class_key] === 'number'];
})();

const [shorten_item_name, lengthen_item_name] = (() => {
    const k_to_short_table = Object.freeze({
        monomate      : 'a',
        dimate        : 'b',
        trimate       : 'c',
        monofluid     : 'd',
        difluid       : 'e',
        trifluid      : 'f',
        antidote      : 'g',
        antiparalysis : 'h',
        sol_atomizer  : 'i',
        moon_atomizer : 'j',
        star_atomizer : 'k'
    });
    const k_to_long_table = Object.freeze((() => {
        let rv = {};
        for (const [key, val] of Object.entries(k_to_short_table)) {
            rv[val] = key;
        }
        return rv;
    })());
    return [fullname  => k_to_short_table[fullname ],
            shortname => k_to_long_table [shortname]];
})();

const is_character_table = tbl => {
    if (tbl === undefined) return false;
    return !(   typeof tbl.sec_id !== 'number' || typeof tbl['class'] !== 'number'
             || typeof tbl.sex    !== 'number' || typeof tbl.race     !== 'number');
};

const verify_valid_character_table = tbl => {
    if (!is_character_table(tbl)) throw 'not a valid character table';
    return tbl;
};

const verify_item_name = itemname => {
    if (k_item_names[itemname] !== undefined) return itemname;
    throw '"' + itemname + '" is not a valid item name.';
};

const objects_are_same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const compute_total_costs = history => {
    let cost = 0;
    for (let i = 0; i < history.length; ++i) {
        cost += k_item_costs[history[i].item_name];
    }
    return cost;
};

// inside make_history_tracker function
// instance generator
return chara => {
    let me = {};
    // character identity since last
    let m_old_character;
    let m_character;
    let m_rewind_idx;
    let m_history = [];
    
    (() => { // "constructor"
        m_character = deep_copy(verify_valid_character_table(chara));
    })();
    
    me.record_character_change = chara => {
        m_character = deep_copy(verify_valid_character_table(chara));
    };
    
    me.record_item_fed = (itemname, mag) => {
        verify_item_name(itemname);
        
        let num_removed = 0;
        if (m_rewind_idx !== undefined) {
            num_removed = m_history.length - m_rewind_idx;
            m_history.length = m_rewind_idx;
            m_rewind_idx = undefined;
        }
        
        let delta = deep_copy(k_feed_charts[mag.name()][itemname]);
        Object.assign(delta, {
            item_name : itemname,
            mag_clone : mag.clone()
        });
        
        let new_mag = mag.clone();
        let old_level = new_mag.level();
        new_mag.feed_item(m_character, itemname);
        if (mag.name() !== new_mag.name()) {
            Object.assign(delta, {
                evolves_to : new_mag.name(),
                character  : deep_copy(m_character)
            });

            if (!objects_are_same(m_old_character, m_character)) {
                m_old_character = m_character;
            }
        }
        if (old_level !== new_mag.level()) {
            Object.assign(delta, { level_up_to : new_mag.level() });
        }
        
        m_history.push(delta);
        
        return num_removed;
    };
    
    me.get_entry = i => {
        if (typeof i !== 'number') throw 'index is not a number';
        if (i >= m_history.length || i < 0) throw 'index is oor';
        let last_delta = deep_copy(m_history[i]);
        last_delta.mag_clone = last_delta.mag_clone.clone();
        return last_delta;
    };
    
    me.get_last_change = () => {
        let last_delta = deep_copy(m_history[m_history.length - 1]);
        last_delta.mag_clone = last_delta.mag_clone.clone();
        return last_delta;
    };
    
    /*me.save_to_string_old = () => {
        let rv = [];
        // do it this time by omission
        m_history.forEach(el => {
            let new_entry = { item_name : el.item_name };
            if (el.evolves_to !== undefined) {
                // how do I show adding entries to a dictionary in a terse and
                // readable way?
                const chr = el.character;
                Object.assign(new_entry, {
                    'class' : chr['class'],
                    race    : chr.race,
                    sex     : chr.sex,
                    sex_id  : chr.sec_id
                });
            } 
            
            rv.push(new_entry);
        });
        return JSON.stringify(rv);
    };*/
    
    me.save_to_string = () => {
        let rv = [];
        // do it this time by omission
        let repeat_count = 0;
        const check_push_repeats = () => {
            if (repeat_count === 0) return;
            rv.push({ re : repeat_count });
            repeat_count = 0;
        };
        let last_item_name;
        m_history.forEach(el => {
            let new_entry = {};
            new_entry[k_ss_item_name_key] = shorten_item_name(el.item_name);
            
            if (el.evolves_to !== undefined) {
                /* need a better name than this...? */
                Object.assign(new_entry, shorten_character_table(el.character));
                check_push_repeats();
                rv.push(new_entry);
            } else if (last_item_name == el.item_name) {
                repeat_count++;
            } else {
                check_push_repeats();
                rv.push(new_entry);
            }
            last_item_name = el.item_name;
        });
        check_push_repeats();
        return JSON.stringify(rv);
    };
    
    const load_entry = (el, working_mag) => {
        if (typeof el.re === 'string') {
            throw 'this function should not process repeats';
        } else if (typeof el[k_ss_item_name_key] !== 'string') {
            throw 'item name must be a string';
        }
        
        if (is_saved_character_table(el)) {
            me.record_character_change(lengthen_character_table(el));
        }
        
        let itemname = lengthen_item_name(el[k_ss_item_name_key]);
        me.record_item_fed(itemname, working_mag);
        working_mag.feed_item(m_character, itemname);
    };
    
    me.load_from_string = (str) => {
        if (typeof str !== 'string') {
            throw  'make_mag().load_from_string: requires exactly one argument '
                  +'a JSON string describing a mag\'s feeding history.';
        }
        
        // reset instance state
        m_history = [];
        m_rewind_idx = undefined;
        m_character = m_old_character = undefined;
        
        // doesn't matter what the initial character is, so long as it's valid
        me.record_character_change(k_char_makers.humar('bluefull'));
        
        // then we restore the state based on the saved history string
        let working_mag = make_mag();
        
        let last_entry;
        JSON.parse(str).forEach(el => {
            if (el.re !== undefined) {
                if (last_entry === undefined) throw 'repeat without a previous records';
                for (let i = 0; i < el.re; ++i) {
                    load_entry(last_entry, working_mag);
                }
                return;
            } else {
                load_entry(el, working_mag);
                last_entry = el;
            }
        });
        return [working_mag, deep_copy(m_character)];
    };
    
    /*me.load_from_string_old = (str) => {
        if (typeof str !== 'string') {
            throw  'make_mag().load_from_string: requires exactly one argument '
                  +'a JSON string describing a mag\'s feeding history.';
        }
        
        // reset instance state
        m_history = [];
        m_rewind_idx = undefined;
        m_character = m_old_character = undefined;
        
        // doesn't matter what the initial character is, so long as it's valid
        me.record_character_change(k_char_makers.humar('bluefull'));
        
        // then we restore the state based on the saved history string
        let working_mag = make_mag();
        JSON.parse(str).forEach(el => {
            if (typeof el.item_name !== 'string') {
                throw 'each entry must have an (string) item name';
            }
            if (el['class'] !== undefined) {
                me.record_character_change({
                    'class' : el['class'],
                    sex     : el.sex,
                    sec_id  : el.sec_id,
                    race    : el.race
                });
            }
            me.record_item_fed(el.item_name, working_mag);
            working_mag.feed_item(m_character, el.item_name);
        });
        return [working_mag, deep_copy(m_character)];
    };*/
    
    me.record_count = () => m_history.length;
    
    const find_earlier_character_from = i => {
        for (let j = i; j >= 0; --j) {
            if (m_history[j].character !== undefined)
                return m_history[j].character;
        }
        return m_character;
    };
    
    me.rewind_to_index = i => {
        if (typeof i !== 'number') {
            throw  'make_history_tracker().rewind_to_index: first expected must '
                  +'be a number';
        } else if (i > m_history.length) {
            throw  'make_history_tracker().rewind_to_index: cannot rewind to '
                  +'an index greater than the number of records.';
        }
        // special case: jump to present
        if (i === m_history.length) {
            if (m_history.length === 0) {
                throw 'Cannot jump to present with no history records present';
            }
            m_rewind_idx = undefined;
            
            let character_to_restore = find_earlier_character_from(m_history.length - 1);
            m_old_character = m_character = character_to_restore;
            let new_mag = m_history[m_history.length - 1].mag_clone.clone();
            new_mag.feed_item(character_to_restore, m_history[m_history.length - 1].item_name);
            return [new_mag, deep_copy(character_to_restore)];
        } else {
            m_rewind_idx = i;
            let character_to_restore = find_earlier_character_from(i);
            m_old_character = m_character = character_to_restore;
            return [m_history[i].mag_clone.clone(), deep_copy(character_to_restore)];
        }
    };
    
    // This is what I would call an example of "semantic tightening" when it comes
    // to how variables are used
    // A rewind index represents the index to which history has be rewond to
    // 0 being the beginning before any feeding has occured
    // n (where n is the number of entries) being the present after all feeds have
    //   occured
    me.rewind_index = () => m_rewind_idx === undefined ? m_history.length : m_rewind_idx;

    me.total_cost = () => compute_total_costs(m_history);

    return me;
};

})(); // end of make_history_tracker

const get_sec_id_name = (() => {
    let tbl = {};
    let k_sec_id = k_character_constants.sec_id; 
    for (let k in k_sec_id) { if (true) {
        if (tbl[k_sec_id[k]] !== undefined) throw 'assertion failed';
        tbl[k_sec_id[k]] = k;
    }}
    return i => {
        if (tbl[i] === undefined) throw 'Cannot map value "' + i + '"to section id.';
        return tbl[i];
    };
})();

function get_class_name(i) {
    if (typeof i === 'object') {
        if (i['class'] === undefined || i.sex === undefined || i.race === undefined) {
            throw 'get_class_name: if parameter is an object, it must describe a character';
        }
        let k_not_possible_cname = 'get_class_name: character is not possible in PSOBB';
        let k_not_valid_chara = 'get_class_name: character data is not valid';
        let rv = '';
        
        /**/ if (i['class'] === k_character_constants['class'].ranger) rv += 'ra';
        else if (i['class'] === k_character_constants['class'].hunter) rv += 'hu';
        else if (i['class'] === k_character_constants['class'].force ) rv += 'fo';
        if (rv === '') throw k_not_valid_chara;
        
        if (i.sex === k_character_constants.sex.female) {
            /**/ if (i.race === k_character_constants.race.cast  ) rv += 'caseal' ;
            else if (i.race === k_character_constants.race.human ) rv += 'marl'   ;
            else if (i.race === k_character_constants.race.newman) rv += 'newearl';
        } else if (i.sex === k_character_constants.sex.male) {
            /**/ if (i.race === k_character_constants.race.cast  ) rv += 'cast';
            else if (i.race === k_character_constants.race.human ) rv += 'mar' ;
            else if (i.race === k_character_constants.race.newman) rv += 'newm';
        } else {
            throw k_not_valid_chara;
        }
        if (rv.length === 2) throw k_not_valid_chara;
        if (!k_character_constants.class_names.some(cn => cn === rv))
            { return k_not_possible_cname; }
        return rv;
    } else if (typeof i === 'number') {
        let k_class_names = k_character_constants.class_names;
        if (k_class_names[i] === undefined) throw 'Cannot map value "' + i + '" to class name.';
        return k_class_names[i];
    } else {
        throw 'get_class_name: unhandled type "' + (typeof i) + '".';
    }
}

return Object.freeze({
    class_names         : k_character_constants.class_names,
    item_names          : k_item_names,
    get_feed_chart_for  : get_feed_chart_for,
    get_class_name      : get_class_name,
    get_section_id_name : get_sec_id_name,
    make_history_tracker: make_history_tracker,
    make_mag            : make_mag      ,
    make_humar          : k_char_makers.humar,
    make_hunewearl      : k_char_makers.hunewearl,
    make_hucast         : k_char_makers.hucast,
    make_hucaseal       : k_char_makers.hucaseal,
    make_ramar          : k_char_makers.ramar,
    make_racast         : k_char_makers.racast,
    make_racaseal       : k_char_makers.racaseal,
    make_ramarl         : k_char_makers.ramarl,
    make_fomarl         : k_char_makers.fomarl,
    make_fonewm         : k_char_makers.fonewm,
    make_fonewearl      : k_char_makers.fonewearl,
    make_fomar          : k_char_makers.fomar,
    section_ids         : k_character_constants.sec_id
});

})();
