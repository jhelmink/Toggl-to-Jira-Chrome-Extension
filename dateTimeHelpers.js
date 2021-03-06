/*
    Date time helpers.
    
    Some string extensions.
    Some functions.
*/

String.prototype.limit = function (limit) {
    return this.length > limit ? this.substr(0, limit) + '...' : this;
}

String.prototype.toHHMMSS = function () {
    // don't forget the second param
    var secNum = parseInt(this, 10);
    var hours = Math.floor(secNum / 3600);
    var minutes = Math.floor((secNum - (hours * 3600)) / 60);
    var seconds = secNum - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    var time = hours + 'h ' + minutes + 'm ' + seconds + 's';
    return time;
}

String.prototype.toHHMM = function () {
    // don't forget the second param
    var secNum = parseInt(this, 10);
    var hours = Math.floor(secNum / 3600);
    var minutes = Math.floor((secNum - (hours * 3600)) / 60);

    // set minimum as 1 minute
    if (hours + minutes === 0) minutes = 1;

    // pad zero
    if (hours < 10) {
        hours = '0' + hours;
    }
    // pad zero
    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    var time = hours + 'h ' + minutes + 'm';
    return time;
}

String.prototype.toHH_MM = function () {
    // don't forget the second param
    var secNum = parseInt(this, 10);
    var hours = Math.floor(secNum / 3600);
    var minutes = Math.floor((secNum - (hours * 3600)) / 60);

    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    var time = hours + ':' + minutes;
    return time;
}

String.prototype.toMMMDD = function () {
    // don't forget the second param
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var d = new Date(this);
    return monthNames[d.getMonth()] + ' ' + d.getDate();
}

String.prototype.toMMMDDHHMM = function () {
    // don't forget the second param
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var d = new Date(this);
    return monthNames[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getHours() + '' + d.getMinutes();
}

var dateTimeHelpers = {

    // DateTimePicker local date (ignore time zones) eg; '2020-05-26'
    localDateISOString: function (date) {
        var localDate = (date || new Date());
        return localDate.getFullYear() + '-' + this.padZero(localDate.getMonth() + 1) + '-' + this.padZero(localDate.getDate());
    },

    // Get the timezone offset eg; +12:00
    timeZoneOffset: function (date) {
        var timezone_offset_min = (date || new Date()).getTimezoneOffset(),
            offset_hrs = this.padZero(parseInt(Math.abs(timezone_offset_min / 60))),
            offset_min = this.padZero(Math.abs(timezone_offset_min % 60)),
            timezone_standard;

        // Add an opposite sign to the offset
        // If offset is 0, it means timezone is UTC
        if (timezone_offset_min < 0)
            timezone_standard = '+' + offset_hrs + ':' + offset_min;
        else if (timezone_offset_min > 0)
            timezone_standard = '-' + offset_hrs + ':' + offset_min;
        else if (timezone_offset_min == 0)
            timezone_standard = 'Z';

        // Timezone difference in hours and minutes
        // String such as +05:30 or -06:00 or Z
        return timezone_standard;
    },

    // Creates a key in ISO date format (0 padded) eg; 20200518
    createDateKey: function (date) {
        var d = new Date(date);
        return '' + d.getFullYear() + this.padZero(d.getMonth() + 1) + this.padZero(d.getDate());
    },

    // Padding for < 10 numbers
    padZero: function (value) {
        if(value < 10) return '0' + value;
        return value;
    },

    // Take a date, add days and return a new date
    addDays: function (date, days) {
        var newDate = (date || new Date()); // default to now
        var days = (days || 1); // default to 1
        return new Date(newDate.setDate(newDate.getDate() + days));
    },

    /*
    * Round duration up to next `minutes`.
    * No rounding will be applied if minutes is zero.
    * 
    * Example: round to next quater:
    * roundUpTogglDuration(22, 15) = 30 // rounded to the next quarter
    * roundUpTogglDuration(35, 60) = 60 // round to full hour
    * roundUpTogglDuration(11, 0) = 11  // ignored rounding
    */
    roundUpTogglDuration: function (initialDurationSeconds, roundingMinutes) {
        var minutesDuration = initialDurationSeconds / 60 // initialDuration is in seconds
        if (minutesDuration == 0 || roundingMinutes == 0) { // no rounding required
            return initialDurationSeconds;
        } else { // make sure minium `minutes` are tracked
            var roundedDuration = (Math.floor(minutesDuration / roundingMinutes) + 1) * roundingMinutes;
            return roundedDuration * 60; // convert back to seconds
        }
    },

    // Toggl time should look like jira time (otherwise 500 Server Error is raised)
    // Toggl always returns the time in UTC so we just need to reformat but otherwise not mess with it
    toJiraWhateverDateTime: function (togglDateString) {
        // TOGGL:           start: "2020-05-20T03:00:05+00:00"
        // JIRA:     "started": "2012-02-15T17:34:37.937-0600"
        var jiraDateString = togglDateString.slice(0, -6); // slice of the last "+00:00"
        jiraDateString += ".000"; // add the milliseconds
        jiraDateString += "-0000"; // add the timezone, which will always be UTC thanks to Toggl
        return jiraDateString;
    }

}