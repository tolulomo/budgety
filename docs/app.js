var appProcessor = (function(){
    //Income Object
    var Income = function(id, desc, val) {
        this.id = id;
        this.desc = desc;
        this.val = val;
    };
    
    //Expenses Object
    var Expenses = function(id, desc, val) {
        this.id = id;
        this.desc = desc;
        this.val = val;
        this.percentage = 0;
    };
    
    Expenses.prototype.perc = function(inc){
        if(inc > 0){
            this.percentage = (this.val / inc) *  100;
        } else {
            this.percentage = 0;
        }
    };
    
    Expenses.prototype.getPercent = function(){
        return this.percentage;
    }
    
    var calcTotal = function(type){
        var sum = 0;
        dataMem.entry[type].forEach(function(curr){
            sum += curr.val;
        });
        dataMem.total[type] = sum;
    };
    
    //Storage
    var dataMem = {
        entry : {
            inc : [],
            exp : []
        },
        total : {
            inc : 0,
            exp : 0
        },
        percentage : 0,
        budget : 0
    };
    // Remove Delete Item from storage
    var memRemover = function(obj){
        var type = obj[0], id = obj[1], op, getIndex;
        op = dataMem.entry[type].map(function(cur, arr){
            cur.id;
        });
        getIndex = op.indexOf([id]);
        dataMem.entry[type].splice(getIndex, 1);
    };
    // Returns
    return {
        //Process Input
        entryProcess : function(obj){
            let id, inc, exp, store = {};
             
            if(obj.type === 'inc' && obj.val > 0){
                if(dataMem.entry.inc.length <= 0) {
                    id = 1;
                } else {
                    id = (dataMem.entry.inc.length) + 1;
                }
                store = new Income(id, obj.desc, obj.val);
                dataMem.entry.inc.push(store);
            } else if(obj.type === 'exp' && obj.val > 0) {
                if(dataMem.entry.exp.length <= 0) {
                    id = 1;
                } else {
                    id = (dataMem.entry.exp.length) + 1;
                }
                store = new Expenses(id, obj.desc, obj.val);
                dataMem.entry.exp.push(store);
            }
            return store;
        },
        getPercents : function() {
            let list;
            list = dataMem.entry.exp.map(function(curr, arr){
                return curr.getPercent();
            });
            return list;
        },
        getStorage : function () {
            return dataMem;
        },
        memRem : function(obj){
            return memRemover(obj);
        },
        //Calculate total and percentage
        getTotalCalc : function(){
            calcTotal('inc');
            calcTotal('exp');
            dataMem.budget = (dataMem.total.inc - dataMem.total.exp);
            if(dataMem.total.inc > dataMem.total.exp){
                dataMem.percentage = (dataMem.total.exp / dataMem.total.inc) * 100;
            } else {
                dataMem.percentage = 0;
            }
        },
        //Calculate Row Percentages
        rowPercent : function() {
            dataMem.entry.exp.forEach(function(curr){
                curr.perc(dataMem.total.inc);
            })
        }
    }
    
})();

var output = (function(){
    //DOM Classes
    var DOMClasses = {
        type : '.add__type',
        desc : '.add__description',
        val : '.add__value',
        btn : '.add__btn',
        incEntry : '.income__list',
        expEntry : '.expenses__list',
        budgetlbl : '.budget__value',
        inclbl : '.budget__income--value',
        explbl : '.budget__expenses--value',
        percentagelbl : '.budget__expenses--percentage',
        listcontainer : '.container',
        allperc : '.item__percentage',
        date : '.budget__title--month'
    };
    //Accept Input
    var DOMInput = function(){
        return {
            type : document.querySelector(DOMClasses.type).value,
            desc : document.querySelector(DOMClasses.desc).value,
            val : parseFloat(document.querySelector(DOMClasses.val).value)
        }
    };
    //Number formatting
    var numFormat = function(num) {
        let input, process, output;
        input = Math.abs(num).toFixed(2);
        process = input.split('.');
        if(process[0].length > 3) {
            output = process[0].substr(0, process[0].length - 3) + ',' + process[0].substr(process[0].length - 3, 3);
        } else {
            output = process[0];
        }
        
        return output + '.' + process[1];
    };
    
    var forEachfn = function(li, fn){
        for(var i = 0; i < li.length; i++){
            fn(li[i], i);
        }
    };
    // Date Function
    var myDate = function(){
        let date = new Date(), myMonth = date.getMonth(), myYear = date.getFullYear(), months, myAppDate;
        months = ['Janurary', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        return myAppDate = months[myMonth] + ', ' + myYear;
    };
    // Return
    return {
        getDate : function(){
            return myDate();
        },
        showDate : function(){
            document.querySelector(DOMClasses.date).textContent = myDate();
        },
        //Document Object Classes
        getDOM : function(){
            return DOMClasses;
        },
        // Retrieve Input Values
        getInput : function() {
            return DOMInput();
        },
        // Display user entry
        domDisplay : function(obj, type){
            var html, nhtml;
            if(obj.val > 0 && (obj.desc)){
                if(type === 'inc'){
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">+ $%val%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                } else if (type === 'exp') {
                    html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">- $%val%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }

                nhtml = html.replace('%id%', obj.id);
                nhtml = nhtml.replace('%desc%', obj.desc);
                nhtml = nhtml.replace('%val%', numFormat(obj.val));
                if(type === 'inc' ){
                    document.querySelector(DOMClasses.incEntry).insertAdjacentHTML('beforeend', nhtml);
                } else if(type === 'exp'){
                    document.querySelector(DOMClasses.expEntry).insertAdjacentHTML('beforeend', nhtml);
                }
            }
        },
        rowPercentages : function(p){
           let list;
            list = document.querySelectorAll(DOMClasses.allperc);
            if(list.length > 0){
                forEachfn(list, function(curr, i){
                    curr.textContent = numFormat(p[i]) + '%';
                });
            }
            
        },
        label : function(obj){
            if(obj.budget > 0){
                document.querySelector(DOMClasses.budgetlbl).textContent = '$' + numFormat(obj.budget);
            } else {
                document.querySelector(DOMClasses.budgetlbl).textContent = '-';
            }
            if(obj.total.inc > 0) {
                document.querySelector(DOMClasses.inclbl).textContent = '$' + numFormat(obj.total.inc);
            } else {
                document.querySelector(DOMClasses.inclbl).textContent = '-';
            }
            if(obj.total.exp > 0) {
                document.querySelector(DOMClasses.explbl).textContent = '$' + numFormat(obj.total.exp);
            } else {
                document.querySelector(DOMClasses.explbl).textContent = '-';
            }
            if(obj.percentage > 0){
                document.querySelector(DOMClasses.percentagelbl).textContent = (obj.percentage).toFixed(2) + '%';
            } else {
                document.querySelector(DOMClasses.percentagelbl).textContent = '--';
            }
        },
        //delete from list
        delList : function(obj, type){
            obj.parentNode.removeChild(obj);
        },
        clear : function() {
            var input = document.querySelectorAll(DOMClasses.desc + ',' + DOMClasses.val);
            var clears = input.forEach(function(current, array){
                current.value = '';                                
            });
            input[0].focus();
        },
        selection : function(type){
            let list 
            list = document.querySelectorAll(DOMClasses.desc + ',' + DOMClasses.val + ',' + DOMClasses.type);
            list.forEach(function(curr, arr){
                curr.classList.toggle('red-focus');
            });
            document.querySelector(DOMClasses.btn).classList.toggle('red');
        }
    };
    
})();

var appInit = (function(op, ap){
    var date, DOM, inputs, processed, storage, getRowPercentage, supportsPassive;
    op.showDate();
    var pass = function(){
            supportsPassive = false;
            try {
              var opts = Object.defineProperty({}, 'passive', {
                get: function() {
                  supportsPassive = true;
                }
              });
              window.addEventListener("testPassive", null, opts);
              window.removeEventListener("testPassive", null, opts);
            } catch (e) {}
    }
    
    var update = function() {
        ap.getTotalCalc();
        storage = ap.getStorage();
        op.label(storage);
        ap.rowPercent();
        getRowPercentage = ap.getPercents();
        op.rowPercentages(getRowPercentage);
    }
    
    function starter() {
        
        inputs = op.getInput();
        processed = ap.entryProcess(inputs);
        op.domDisplay(processed, inputs.type);
        update();
        op.clear();
        //console.log(inputs);
    }
    
    function eventListener() {
        DOM = op.getDOM();
        //Input Event Listener
        document.querySelector(DOM.btn).addEventListener('click', starter);
        document.addEventListener('keyup', function(e){
            if(e.keyCode === 13 || e.which === 13) {
                starter();
                op.clear();
            }
        });

        //Iniside the description box switcher
        document.querySelector(DOM.desc).addEventListener('keyup', function(e){
            if(e.keycode === 109 || e.keyCode === 189) {
                document.querySelector(DOM.type).value = 'exp';
                op.selection('exp');
                op.clear();
            } else if(e.keyCode === 107 || e.keyCode === 187){
                document.querySelector(DOM.type).value = 'inc';
                op.selection('inc');
                op.clear();  
            }
        });

        //Outside the description box switcher
        document.addEventListener('keyup', function(e){
            if(e.keycode === 109 || e.keyCode === 189) {
                document.querySelector(DOM.type).value = 'exp';
                op.selection('exp');
                op.clear();
            } else if(e.keyCode === 107 || e.keyCode === 187){
                document.querySelector(DOM.type).value = 'inc';
                op.selection('inc');
                op.clear();  
            }
        });

        // Use our detect's results. passive applied if supported, capture will be false either way.
        document.querySelector(DOM.type).addEventListener('change', op.selection, supportsPassive ? { passive: true } : false);
        document.querySelector(DOM.listcontainer).addEventListener('click', getDOMList)
        
    }
    
    var getDOMList = function(event){
        var myDOM, splitDOM, DOMid;
        myDOM = event.target.parentNode.parentNode.parentNode.parentNode;
        DOMid = myDOM.id;
        if(DOMid){
            splitDOM = DOMid.split('-');  
            ap.memRem(splitDOM); 
            op.delList(myDOM);
            update();
        }
        
    }
    //Initialize App  
    return {
        initialize : function(){
            console.log('App Started');
            eventListener();
            op.label({
                budget : 0,
                total : {
                    inc : 0,
                    exp : 0
                }, 
                percentage: 0
            });
        }
    };
        
})(output, appProcessor);

appInit.initialize();