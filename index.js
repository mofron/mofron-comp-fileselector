/**
 * @file mofron-comp-fileselector/index.js
 * @brief file select button component for mofron
 * @license MIT
 */
const FormItem = require("mofron-comp-formitem");
const Input    = require("mofron-comp-input");
const Text     = require("mofron-comp-text");
const Button   = require("mofron-comp-button");
const Focus    = require("mofron-event-focus");
const onCommon = require("mofron-event-oncommon");
const SyncHei  = require("mofron-effect-synchei");
const comutl   = mofron.util.common;
const ConfArg  = mofron.class.ConfArg;


let read_files = null;

module.exports = class extends FormItem {
    /**
     * initialize component
     * 
     * @param (mixed) text parameter
     *                key-value: component config
     * @short text
     * @type private
     */
    constructor (prm) {
        try {
            super();
            this.modname("FileSelector");
	    this.shortForm("text");
	    /* init config */
	    this.confmng().add("typeFilter", { type: "string", list: true, init:[] });
	    this.confmng().add("typeFilter_comp", { type: "Component" });
	    this.confmng().add("sizeFilter", { type: "number" });
            this.confmng().add("sizeFilter_comp", { type: "Component" });
	    this.confmng().add("value", { type: "string", list: true });
	    this.confmng().add("base64Value", { type: "string", list: true });
            /* set config */
	    if (undefined !== prm) {
                this.config(prm);
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * initialize dom contents
     * 
     * @type private
     */
    initDomConts () {
        try {
            super.initDomConts();
	    let wrap = new mofron.class.Component({
	        style: { "display": "flex" },
                child: [this.button(), this.filetxt()]
	    })
            this.child([this.input(), wrap]);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    fileEvent (p1,p2,p3) {
        try {
	    p2.preventDefault();

	    /* init file value */
	    p3.confmng().delete("value");
            p3.confmng().delete("base64Value");
            p3.filetxt("");
            
            let flist = "";
            let files = p1.childDom().getRawDom().files;
            let reader = [];
            for (let fidx in files) {
                if (true === Number.isNaN(parseInt(fidx,10))) {
                    continue;
                }
                flist += files[fidx].name + ",";
                
		/* check type filter */
		let typ_fil = p3.typeFilter();
		let ftype   = files[fidx].name.split('.')[1];
		for (let fidx in typ_fil.type) {
                    if (ftype !== typ_fil.type[fidx]) {
		        typ_fil.comp.visible(true);
		        return;
                    }
		}
                reader.push(new FileReader());
                reader[fidx].readAsDataURL(files[fidx]);
                reader[fidx].onload = () => {
                    try {
                        if (0 === reader[fidx].result.length) {
                            return;
                        }
                        
                        let siz_fil = p3.sizeFilter();
                        p3.base64Value(reader[fidx].result.split(',')[1]);
                        p3.value(atob(reader[fidx].result.split(',')[1]));
                        /* change event */
                        let cevt = p3.changeEvent();
                        for (let cidx in cevt) {
                            cevt[cidx][0](p3, reader.result, cevt[cidx][1]);
                        }
                    } catch (e) {
                        console.error(e.stack);
                        throw e;
                    }
                }
            }
            p3.filetxt(flist.substring(0,flist.length-1));
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    typeFilter (tp, cmp) {
        try {
            if (undefined === tp) {
                return {
                    type: this.confmng("typeFilter"),
		    comp: this.confmng("typeFilter_comp")
		};
	    }
	    this.confmng("typeFilter", tp);
            this.confmng("typeFilter_comp", cmp);
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    }
    
    sizeFilter (siz, cmp) {
        try {
            if (undefined === siz) {
                return {
                    size: this.confmng("sizeFilter"),
                    comp: this.confmng("sizeFilter_comp")
		};
	    }
	    this.confmng("sizeFilter", siz);
            this.confmng("sizeFilter_comp", cmp);
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    }

    /**
     * input tag setter/getter
     * 
     * @param (mofron.class.Dom) input tag dom
     *                           undefined: call as getter
     * @return (mofron.class.Dom) input tag dom
     * @type private
     */
    input (prm) {
        try {
	    if (true === comutl.isinc(prm, "Input")) {
	        prm.type("file");
                prm.visible(false);
		prm.event(
		    new onCommon(new ConfArg(this.fileEvent, this), "onchange")
		);
	    }
            return this.innerComp("input", prm, Input);
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    }

    contents (fnc) {
        
        if (0 === this.input().childDom().getRawDom().length) {
            return;
        }
        let file = this.input().childDom().getRawDom().files[0];
        const reader = new FileReader();
        reader.onload = () => {
            fnc(reader.result);
        };
        
        reader.readAsText(file);

    }
    
    /**
     * button component setter/getter
     * 
     * @param (mofron-comp-button) button component
     *                             undefined: call as getter
     * @return (mofron-comp-button) button component
     * @type parameter
     */
    button (prm) {
        try {
	    if (true === comutl.isinc(prm, "Button")) {
	        prm.clickEvent(
		    (c1,c2,c3) => {
                        c3.input().childDom().getRawDom().click();
                    },
		    this
		);
		let fcs_evt = (f1,f2,f3) => {
                    let fevt = f3.focusEvent();
                    for (let fidx in fevt) {
                        fevt[fidx][0].exec(f3,f2, fevt[fidx][1]);
                    }
		}
                let focus = new Focus(new ConfArg(fcs_evt, this));
                prm.event(
                    new Focus(new ConfArg(fcs_evt, this))
                );
	    }
            return this.innerComp("button", prm, Button);
	} catch (e) {
            console.error(e.stack);
	    throw e;
	}
    }
    
    /**
     * file name text component setter/getter
     * 
     * @param (mixed) string: file name text
     *                mofron-comp-text: file name text component
     *                undefined: call as getter
     * @return (mofron-comp-text) file name text component
     * @type parameter
     */
    filetxt (prm, cnf) {
        try {
	    if ("string" === typeof prm) {
	        this.filetxt().text(prm);
		this.filetxt().config(cnf);
                return;
	    } else if (true === comutl.isinc(prm, "Text")) {
                prm.style({ "margin-left" : "0.2rem" });
		prm.config(cnf);
	    }
            return this.innerComp("filetxt", prm, Text);
	} catch (e) {
            console.error(e.stack);
	    throw e;
	}
    }
    
    /**
     * button text setter/getter
     * 
     * @param (string) button text
     *                 undefined: call as getter
     * @return (string) button text
     * @type parameter
     */
    text (prm) {
        try {
            return this.button().text(prm);
	} catch (e) {
            console.error(e.stack);
	    throw e;
	}
    }
    
    /**
     * multiple selector setter/getter
     * 
     * @param (boolean) true: multiple selector
     *                  false: single selector
     *                  undefined: call as getter
     * @return (boolean) multiple selector
     * @type parameter
     */
    multiple (prm) {
        try {
	    if (undefined === prm) {
                /* getter */
                let ret = this.input().attrs("multiple");
		return (null === ret) ? false : true;
	    }
	    /* setter */
            this.input().attrs(
                { multiple : (false !== prm ) ? true : null }
	    );
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    }
    
    /**
     * accept file type
     * 
     * @param (string) accept file types
     *                 undefined: call as getter
     * @return (mixed) string: accept file types
     *                 null: not set 
     * @type parameter
     */
    accept (prm) {
        try {
            this.input().attrs(
	        (undefined === prm) ? "accept" : { multiple : prm }
	    );
	} catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * base64 value setter/getter
     * 
     * @param (string) base64 value
     * @return (string) base64 value 
     * @type function
     */
    base64Value (prm) {
        try {
            return this.confmng("base64Value", prm);
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    }
    
    /**
     * selected value setter/getter
     * 
     * @param (string) value string
     * @return (string) value string
     * @type function
     */
    value (prm) {
        try {
	    return this.confmng("value", prm);
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    }
    
    /**
     * selector button height setter/gertter
     * 
     * @param (string(size)) button height
     *                       undefined: call as getter
     * @param (key-value) style option
     * @return (string(size)) button height
     * @type parameter
     */
    height (prm, opt) {
        try {
            return this.button().height(prm, opt);
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    }
    
    /**
     * selector button width setter/gertter
     * 
     * @param (string(size)) button width
     *                       undefined: call as getter
     * @param (key-value) style option
     * @return (mixed) string(size) button width
     *                 null: not set
     * @type parameter
     */
    width (prm, opt) {
        try {
            return this.button().width(prm, opt);
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    }
}
/* end of file */
