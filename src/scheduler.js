'use strict';

const EventEmitter = require('events');
const TimeMatcher = require('./time-matcher');

class Scheduler extends EventEmitter{
    constructor(pattern, timezone){
        super();
        this.timeMatcher = new TimeMatcher(pattern, timezone);
    }

    start(){
        // clear timeout if exsits
        this.stop();

        var matchTime = () => {
            var currentTime = process.hrtime();

            var now = new Date();
            if(this.timeMatcher.match(now)){
                this.emit('scheduled-time-matched', now);
            }
           
            this.timeout = setTimeout(matchTime, 1000 - now.getMilliseconds() + 1);
        }
        
        matchTime();
    }

    stop(){
        if(this.timeout){
            clearTimeout(this.timeout);
        }
        this.timeout = null;
    }
}

module.exports = Scheduler;