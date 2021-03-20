'use strict';
'use strict';
let startTime = {};
let tot = []

const start = function(name) {
    tot.push(new Date().getTime())
    if (!startTime[name]) {
        startTime[name] = [ new Date().getTime()]    
    }    
};
const stop = function(name) {
    if (startTime[name]) {
        startTime[name].push(new Date().getTime())
        console.log('DooHTML', name, 'took:', startTime[name][1] - startTime[name][0]);
        if (tot.length === 2) {
            console.log('DooHTML Tot:', startTime[name][1] - tot[0]);
            tot = []
        }
        startTime[name] = undefined
    }
};

const _random = ((max) => {
    return Math.round(Math.random()*1000)%max;
})

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

const lenA = adjectives.length
const lenB = colours.length
const lenC = nouns.length

Doo.define(
  	class Main extends Doo {
		constructor() {
			super()
			this.scrollTarget = '.table'
			this.defaultDataSet = 'rows'
			this.ID = 1
			this.data = {
				[this.defaultDataSet]: []
			}
			this.add = this.add.bind(this)
			this.run = this.run.bind(this)
			this.runLots = this.runLots.bind(this)
			this.update = this.update.bind(this)
			this.clear = this.clear.bind(this)
			this.swaprows = this.swapRows.bind(this)
			this.addEventListeners()
			Main.xxx = document.getElementById("xxx");
			this.selectedRow = undefined
			document.querySelector(".jumbotron H1").innerHTML += ` ${Doo.version} (keyed)`
  		}

		async dooAfterRender() {
			this.tbody = this.shadow.querySelector('#tbody')
			this.shadow.querySelector(this.scrollTarget).addEventListener('click', e => {
				e.preventDefault();
				if (e.target.parentElement.matches('.remove')) {
					this.delete(e.target.parentElement);
				} else if (e.target.tagName === 'A') {
					this.select(e.target);
				}
			});
		}

        getParentRow(elem) {
        	while (elem) {
        		if (elem.tagName === "TR") {return elem}
        		elem = elem.parentNode;
        	}
        	return undefined;
        }

		buildData(count = 1000) {
			const data = [];
			for (let i = 0; i < count; i++) 
				data.push({id: this.ID++,label: adjectives[_random(lenA)] + " " + colours[_random(lenB)] + " " + nouns[_random(lenC)]});
			return data;
		}

		delete(elem) {
			let row = this.getParentRow(elem)
			if (row) {
				this.tbody.removeChild(row)
				this.data.rows[row.getAttribute('key')] = undefined
			}
		}  

		run() {
			start('buildData')
			this.data.rows = this.buildData()
			stop('buildData')
			start('run')
			this.tbody.textContent = ""
			this.renderAll()
			Main.xxx.focus()
			stop('run')
		}

		add() {
			start('append')
			let len = this.data.rows.length
			this.data.rows = this.data.rows.concat(this.buildData())
			stop('append')
			start('runAppend')
			this.appendData(this.data.rows, len)
			Main.xxx.focus()
			stop('runAppend')
		}    

		runLots() {
			start('buildLots')
			this.data.rows = this.buildData(10000);
			stop('buildLots')
			start('runLots')
			this.tbody.textContent = ""
			this.renderAll()
			Main.xxx.focus()
			stop('runLots')
		}

		update() {
			let tr = this.tbody.querySelectorAll('tr')
			for (let i=0, len = this.data.rows.length;i<len;i+=10) {
				this.data.rows[i].label += ' !!!';
				tr[i].childNodes[1].childNodes[0].innerHTML = this.data.rows[i].label

			}
		}

		select(elem) {
			if (this.selectedRow) {
				this.selectedRow.classList.remove('danger')
				this.selectedRow = undefined
				return
			}
			let row = this.getParentRow(elem)
			if (row) {
				row.classList.toggle('danger')
				this.selectedRow = row
			}    
		}

		clear() {
			this.data.rows = []
			this.clearAll()
		}

		swapRows() {
			if (this.data.rows.length>10) {
				let tr = this.tbody.querySelectorAll('tr')
				let swapNodeIdx =  Math.min(tr.length - 2, 998)
				let node1 = tr[1].cloneNode(true)
				let node2 = tr[swapNodeIdx].cloneNode(true)
				let tmp = this.data.rows[1]
				this.data.rows[1] = this.data.rows[swapNodeIdx];
				this.data.rows[swapNodeIdx] = tmp;
				this.tbody.replaceChild(node2, tr[1])
				this.tbody.replaceChild(node1, tr[swapNodeIdx])
			}
		}

		addEventListeners() {
			document.getElementById("main").addEventListener('click', e => {
				e.preventDefault();
				if (e.target.matches('#runlots')) {
					this.runLots();
				} else if (e.target.matches('#run')) {
					this.run();
				} else if (e.target.matches('#add')) {
					this.add();
				} else if (e.target.matches('#update')) {
					this.update();
				} else if (e.target.matches('#clear')) {
					this.clear();
				} else if (e.target.matches('#swaprows')) {
					this.swapRows();
				}
			})    

    	}   
	}
)
