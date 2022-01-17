/*	This names generator was made by Alexey Izvalov (Airapport) for own strategy game called Conquicktory.
It utilizes Markov chains approach to generate names for anything. 
It defines the frequencies of symbols and their combinations from the learning sample (function init), and then
generates the names which will sound naturally alike to those from the learning sample (function generate).

Feel free to use it in your projects of any type and mention Airapport in the Credits.
	*/
	class MarkovGenerator{
		constructor(){
			this.probsOb = {}
			this.markovOb = {}
			this.seedsLengths = [];
			this.seedsAr = [];
			this.minWordLength = 0;
			this.maxWordLength = 30;
			
			this.settings={mustCreateOnlyNewNames:true,mustKeepSmapleLength:true}
		}
		//call this function let the generator find out the rules from the learning sample (which is array of strings)
		init(ar){
			this.seedsLengths = [];
			this.seedsAr = ar.slice();

			this.probsOb = {};
			for (var i = 0; i < this.seedsAr.length; i++ ){
				var str = this.seedsAr[i];
				var prevPrevCh ="|";
				var prevCh ="|";

				var len = str.length;
				for (var j = 0; j <= len; j++ ){
					if(j<len){
						var ch = str.charAt(j);
					}else{
						ch ="|";
					}

					if (prevPrevCh in this.probsOb){
						var ob = this.probsOb[prevPrevCh];
					}else{
						ob = {};
						this.probsOb[prevPrevCh] = ob;
					}
					if (prevCh in ob){
						var ob2 = ob[prevCh];
					}else{
						ob2 = {};
						ob[prevCh] = ob2;
					}
					if (ch in ob2){
						ob2[ch]++;
					}else{
						ob2[ch] = 1;
					}
					
					prevPrevCh = prevCh;
					prevCh = ch;
				}
				
				while (len>=this.seedsLengths.length){
					this.seedsLengths.push(0);
				}
				this.seedsLengths[len]++;
			}
			
			this.markovOb = {};
			for (var ch1 in this.probsOb){
				ob2 = this.probsOb[ch1];
				for (var ch2 in ob2){
					var ob3 = ob2[ch2];
					var charsAr = [];
					var weightAr = [];
					for (var ch3 in ob3){
						charsAr.push(ch3);
						weightAr.push(ob3[ch3]);
					}
					this.markovOb[ch1 + ch2] = {charsAr:charsAr, weightAr:weightAr};
				}
			}
			
			//defining the lengths of 95% smaple strings
			var percVal = 0.025;
			var percNum = Math.round(percVal * this.seedsAr.length);
			var id = 0;
			var sum = 0;
			while(sum<percNum){
				sum += this.seedsLengths[id];
				id++;
			}	
			this.minWordLength = id - 1;			
			
			id = this.seedsLengths.length-1;
			sum = 0;
			while(sum<percNum){
				sum += this.seedsLengths[id];
				id--;
			}
			this.maxWordLength = id + 1;
			
		}
		//call this function to generate a name
		generate(){
			var numAttempts = 0;
			var mustMakeNextAttempt = true;
			while (mustMakeNextAttempt){
				mustMakeNextAttempt = false;
				numAttempts++;
				
				var res ="";
				var prevPrevCh ="|";
				var prevCh ="|";
				var need1More = true;
				while (need1More){
					var ob = this.markovOb[prevPrevCh + prevCh];
					var id = this.getRandomIndexFromWeightedAr(ob.weightAr);
					var ch = ob.charsAr[id];
					if (ch!="|"){
						res += ch;
					}else{
						need1More = false;
					}
					prevPrevCh = prevCh;
					prevCh = ch;				
					//if (res.length>30){
					//	break;
					//}
				}			
				
				if (numAttempts<10){
					if (this.settings.mustCreateOnlyNewNames){
						if (this.seedsAr.indexOf(res)!=-1){
							mustMakeNextAttempt = true;
						}					
					}
					
					if (!mustMakeNextAttempt){
						if (this.settings.mustKeepSmapleLength){
							if ((res.length < this.minWordLength) || (res.length > this.maxWordLength)){
								mustMakeNextAttempt = true;
							}
						}
					}
				}
			}
			return res;
		}
		//service function for weighted random generation
		getRandomIndexFromWeightedAr(ar){
			if (ar.length == 1){
				if (ar[0]==0){
					return -1
				}else{
					return 0;
				}
			}
			var res = -1;
			var s = 0;
			for (var i = 0; i < ar.length; i++)
			{
				s += ar[i];
			}
			if (s > 0)
			{
				var rnd = s * Math.random();
				var rid = 0;
				while (rnd >= ar[rid])
				{
					rnd -= ar[rid];
					rid++;
				}
				res = rid;
			}
			else
			{
				res = -1;
			}
			return res;			
		}
	}