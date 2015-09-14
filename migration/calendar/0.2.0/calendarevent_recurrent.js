// adapt path

//var version = '1.15-SNAPSHOT';

//load("../../../mods/org.entcore~infra~" + version + "/public/js/moment-langs.js");
load("moment+langs.js");


function adjustStartEndDates(cle) {
    var startMoment = moment(cle.startMoment);
    startMoment.seconds(0).milliseconds(0);    
    var endMoment = moment(cle.endMoment);
    endMoment.seconds(0).milliseconds(0);
    // inside day 
    if (endMoment.isAfter(moment(startMoment).hours(23).minutes(45))) {
        endMoment = moment(startMoment).hours(23).minutes(45);
    }
    // rounded to 15 min
    var duration = endMoment.diff(startMoment, 'seconds');
    var intervalMinute = 15;
    var intervalSecond = intervalMinute * 60;
    if (duration%intervalSecond <= (intervalSecond/2)) {
        duration = ((duration/intervalSecond)>>0)*intervalSecond;
    } else {
        duration = (((duration+intervalSecond)/intervalSecond)>>0)*intervalSecond;
    }
    var startSecond = (startMoment.minutes() * 60) + startMoment.seconds();
    
    if (startSecond%intervalSecond <= (intervalSecond/2)) {
        var startMinute = ((startSecond/intervalSecond)>>0)*intervalMinute;
        startMoment.minutes(startMinute).seconds(0);
        startSecond = startSecond%intervalSecond;
    } else {
        var startMinute = (((startSecond + intervalSecond)/intervalSecond)>>0)*intervalMinute;
        startMoment.minutes(startMinute).seconds(0);
        startSecond = intervalSecond - startSecond%intervalSecond;
    }
    var endSecond = (endMoment.minutes() * 60) + endMoment.seconds();
    if (endSecond%intervalSecond <= (intervalSecond/2)) {
        var endMinute = ((endSecond/intervalSecond)>>0)*intervalMinute; 
        endMoment.minutes(endMinute).seconds(0);
        endSecond = endSecond%intervalSecond;
    } else {
        var endMinute = (((endSecond + intervalSecond)/intervalSecond)>>0)*intervalMinute;
        endMoment.minutes(endMinute).seconds(0);
        endSecond = intervalSecond - endSecond%intervalSecond;
    }
    if (startSecond <= endSecond) {
        endMoment =  moment(startMoment).add(duration, 'seconds'); 
    } else {
        startMoment = moment(endMoment).subtract(duration, 'seconds');
    }
    // bounded beteen 7h and 20h 
    if (startMoment.hours() < 7) {
        startMoment.hours(7).minutes(0);
    }
    if (endMoment.hours() == 20 && endMoment.minutes() > 0) {
        endMoment.hours(20).minutes(0);
        startMoment = moment(endMoment).subtract(duration, 'seconds');
    }
    if (endMoment.hours() > 20) {
        endMoment.hours(20).minutes(0);
        startMoment = moment(endMoment).subtract(duration, 'seconds');
    }  
    if (endMoment.isBefore(moment(startMoment))) {
        endMoment = moment(startMoment).add(1, 'hours');
    }
    return {'start': startMoment, 'end': endMoment};
}
// collect father recurrent events
db.calendarevent.find({"recurrence.type" : {$in: ['every_day', 'every_week']},'isRecurrent': { $exists: false} }).forEach(function(cle) {
    //adjust dates
    var adjusted = adjustStartEndDates(cle);
    var startMoment = adjusted.start;
    var endMoment = adjusted.end;
    //parentId
    var parentId = cle._id;
    //recurrence dates
    var start_on = moment(startMoment).utc().hours(0).minutes(0);
    var end_on = moment(cle.recurrence.end_on).utc().hours(0).minutes(0).seconds(0).milliseconds(0);
    cle.recurrence.start_on = start_on.toISOString();
    cle.recurrence.end_on = end_on.toISOString();
    var idx = 1;
    //collect childs
    db.calendarevent.find({'parentId': parentId}).forEach(function(elm) {
        // adjust dates
        var adjusted = adjustStartEndDates(elm);
        var startMoment = adjusted.start;
        var endMoment = adjusted.end;
        //update child
        db.calendarevent.update(
            {'_id': elm._id }, 
            {
                $set: {  
                    'isRecurrent': true, 
                    'startMoment': startMoment.toISOString(), 
                    'endMoment': endMoment.toISOString(), 
                    'index': NumberInt(idx),
                    'recurrence': cle.recurrence
                }
            }
        );
        idx++;
    });
    // update father recurrent event
    db.calendarevent.update(
        {'_id': cle._id }, 
        {
            $set: { 
                'parentId': parentId, 
                'isRecurrent': true, 
                'startMoment': startMoment.toISOString(), 
                'endMoment': endMoment.toISOString(), 
                'index': NumberInt(0),
                'recurrence': cle.recurrence
            }
        }
    );
});
//collect non recurrent events
db.calendarevent.find({'isRecurrent': { $exists: false} }).forEach(function(cle) {
    // adjust dates
    var adjusted = adjustStartEndDates(cle);
    var startMoment = adjusted.start;
    var endMoment = adjusted.end; 
    // update event
    db.calendarevent.update(
        {'_id': cle._id }, 
        {
            $set: { 
                'isRecurrent': false, 
                'startMoment': startMoment.toISOString(), 
                'endMoment': endMoment.toISOString(), 
                'index': NumberInt(0),
                'recurrence': false
            }
        }
    ); 
      
});

