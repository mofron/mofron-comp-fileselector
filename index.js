/**
 * @file mofron-comp-fileselector/index.js
 * @brief file select button component for mofron
 * @license MIT
 */
const FormItem = require("mofron-comp-formitem");
const Text = require("mofron-comp-text");
const Button = require("mofron-comp-button");
const Focus = require("mofron-event-focus");
const onCommon = require("mofron-event-oncommon");
const SyncHei = require("mofron-effect-synchei");
const comutl = mofron.util.common;
const ConfArg = mofron.class.ConfArg;


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
            this.name("FileSelector");
	    this.shortForm("text");
	    /* init config */
	    this.confmng().add("input", { type: "Dom" });
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
            this.style({ display: "flex" });
            
	    let inp = new mofron.class.Dom({
                          tag: "input", component: this,
                          attrs: { type : "file" }, style: { display: "none" }
                      });
            this.childDom().child(inp);
	    this.input(inp);
            
	    this.child([this.button(), this.filetxt()]);
	    this.text("File");
	    this.filetxt().effect(new SyncHei(this.button()));

	    /* set child dom */
            this.childDom(inp);

	    let chg = (c1,c2) => {
                try {
		    c1.confmng().delete("value");
		    c1.confmng().delete("base64Value");
		    c1.filetxt("");
		    let flist = "";
		    let files = c1.input().getRawDom().files;
		    let reader = [];
                    for (let fidx in files) {
		        if (true === Number.isNaN(parseInt(fidx,10))) {
                            continue;
			}
			flist += files[fidx].name + ",";
                        reader.push(new FileReader());
			reader[fidx].readAsDataURL(files[fidx]);
			reader[fidx].onload = () => {
                            try {
			        if (0 === reader[fidx].result.length) {
                                    return;
				}
				c1.base64Value(reader[fidx].result.split(',')[1]);
			        c1.value(atob(reader[fidx].result.split(',')[1]));
				/* change event */
				let cevt = c1.changeEvent();
				for (let cidx in cevt) {
                                    cevt[cidx].exec(c1,reader.result);
				}
			    } catch (e) {
                                console.error(e.stack);
                                throw e;
			    }
			}
		    }
		    c1.filetxt(flist.substring(0,flist.length-1));
		} catch (e) {
                    console.error(e.stack);
                    throw e;
		}
	    }
            this.event(new onCommon(new ConfArg(chg,"onchange")));
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
            return this.confmng("input", prm);
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
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
	        let clk = (p1,p2,p3) => {
                    try {
                        p3.input().getRawDom().click();
		    } catch (e) {
                        console.error(e.stack);
			throw e;
		    }
		};
		let fcs = (f1,f2,f3) => {
                    try {
                        let fevt = f3.focusEvent();
                        for (let fidx in fevt) {
                            fevt[fidx].exec(f3,f2);
			}
		    } catch (e) {
                        console.error(e.stack);
                        throw e;
		    }
		};
		prm.config({
                    clickEvent: new ConfArg(clk,this),
		    event: new Focus(new ConfArg(fcs,this))
		});
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
    filetxt (prm) {
        try {
	    if ("string" === typeof prm) {
	        this.filetxt().text(prm);
                return;
	    } else if (true === comutl.isinc(prm, "Text")) {
                prm.style({ "margin-left" : "0.2rem" });
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
