/*-------------------------------------------------------------------------------
 *  js-wpclock - HTML/JS Wallpaper Clock from .wcz files
 *  Copyright (C) 2012  Florian Richter
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *  If you have any questions find support at 
 *  https://github.com/myape/js-wpclock
 *-------------------------------------------------------------------------------
 */

/* bad, bad global vars, cause i am not a JS-Master and a lazy fool */
var JS_WPCLOCK_NextMoonphaseUnixTS = 0;
var JS_WPCLOCK_CurrentMoonPhase = 0;

function startClock($,imgPath,clockType) {
    next = updateClock($,imgPath,clockType);
    window.setTimeout(function() { startClockTimer($,imgPath,clockType); },next);
}

function startClockTimer($,imgPath,clockType) {
    updateClock($,imgPath,clockType);
    window.setInterval(function() { startClockTimer($,imgPath,clockType); },60000);

}

function updateClock($,imgPath,clockType) {
    var images = "";
    /* --- Current Date ---*/
    var currentTime    = new Date ( );
    var currentMilli   = currentTime.getTime();
    var currentUnixTS  = currentMilli/ 1000;
    var currentDay     = currentTime.getDay();
    var currentMonth   = currentTime.getMonth();
    var currentYear    = currentTime.getFullYear();
    var currentDate    = currentTime.getDate();
    var currentHours   = currentTime.getHours();
    var currentMinutes = currentTime.getMinutes();
    var currentSeconds = currentTime.getSeconds();

    var nextMin = ( currentMinutes < 59 ) ? 1 : 0;
    var nextMinute = currentTime;
    if(nextMin == 0) {
        nextMinute.setHours(currentHours +1);
        nextMinute.setMinutes(0);
    } else {
        nextMinute.setMinutes(currentMinutes +1);
    }
    nextMinute.setSeconds(0);
    nextMinute.setMilliseconds(0);
    var nextMinuteIn   = nextMinute.getTime() - currentMilli;

    // Choose either "AM" or "PM" as appropriate
    var timeOfDay = ( currentHours < 12 ) ? "am" : "pm";

    // Hours (different if clock is analog or digital)
    if("analog" == clockType) {
        var hrefresh = 12;
    } else {
        var hrefresh = 60;
    }

    if("analog" == clockType && currentHours > 11 ) {
        var hcount = (currentHours - 12) * (Math.floor(60 / hrefresh));
    } else {
        var hcount = currentHours * (60 / hrefresh);
    }   
    var mcount = parseInt(currentMinutes / hrefresh);
    var hourNr = hcount + mcount;

    /** --- Astro --- */
    var zodiacs = new Array();
    zodiacs[1] = "zodiacSagittarius.png" // Widder
    zodiacs[2] = "zodiacTaurus.png" // Stier
    zodiacs[3] = "zodiacGemini.png" // Zwillinge
    zodiacs[4] = "zodiacCancer.png" // Krebs
    zodiacs[5] = "zodiacLeo.png" // Loewe
    zodiacs[6] = "zodiacVirgo.png" // Jungfrau
    zodiacs[7] = "zodiacLibra.png" // Waage
    zodiacs[8] = "zodiacScorpio.png" // Skorpion
    zodiacs[9] = "zodiacAries.png" // Schuetze
    zodiacs[10] = "zodiacCapricorn.png" // Steinbock
    zodiacs[11] = "zodiacAquarius.png" // Wassermann
    zodiacs[12] = "zodiacPisces.png" // Fische

    var currentZodiac=0;
    currentMonth++;

    if ((currentMonth==3 && currentDate>=21) || (currentMonth==4 && currentDate<=20)){currentZodiac=1;}
    else if ((currentMonth==4 && currentDate>=21) || (currentMonth==5 && currentDate<=20)){currentZodiac=2;}
    else if ((currentMonth==5 && currentDate>=21) || (currentMonth==6 && currentDate<=21)){currentZodiac=3;}
    else if ((currentMonth==6 && currentDate>=22) || (currentMonth==7 && currentDate<=22)){currentZodiac=4;}
    else if ((currentMonth==7 && currentDate>=23) || (currentMonth==8 && currentDate<=23)){currentZodiac=5;}
    else if ((currentMonth==8 && currentDate>=24) || (currentMonth==9 && currentDate<=23)){currentZodiac=6;}
    else if ((currentMonth==9 && currentDate>=24) || (currentMonth==10 && currentDate<=23)){currentZodiac=7;}
    else if ((currentMonth==10 && currentDate>=24) || (currentMonth==11 && currentDate<=22)){currentZodiac=8;}
    else if ((currentMonth==11 && currentDate>=23) || (currentMonth==12 && currentDate<=21)){currentZodiac=9;}
    else if ((currentMonth==12 && currentDate>=22) || (currentMonth==1 && currentDate<=21)){currentZodiac=10;}
    else if ((currentMonth==1 && currentDate>=21) || (currentMonth==2 && currentDate<=19)){currentZodiac=11;}
    else if ((currentMonth==2 && currentDate>=20) || (currentMonth==3 && currentDate<=20)){currentZodiac=12;}

    /** --- Moonphase --- */
    if(JS_WPCLOCK_NextMoonphaseUnixTS <= currentUnixTS) {
        // Recalc Moonphase
        var moonAge = moonphase(currentUnixTS);
        JS_WPCLOCK_CurrentMoonPhase = parseInt(moonAge) + 1;
    }

    /** --- Images --- */
    // Zodiac
    images += "url('" + imgPath + zodiacs[currentZodiac] + "')";

    // WeekDays
    images += ",url('" + imgPath +"weekday" + currentDay + ".png')";

    // Month
    images += ",url('" + imgPath +"month" + currentMonth + ".png')";

    // Days
    images += ",url('" + imgPath +"day" + currentDate + ".png')";

    // Hours
    images += ",url('" + imgPath +"hour" + hourNr + ".png')";

    // Minutes
    images += ",url('" + imgPath +"minute" + currentMinutes + ".png')";

    // AM/PM
    images += ",url('" + imgPath + timeOfDay + ".png')";

    // Moon 
    images += ",url('" + imgPath +"moonphase" + JS_WPCLOCK_CurrentMoonPhase + ".png')";

    // Back 
    images += ",url('" + imgPath +"bg.jpg')";

    $("body").css("background-image",images);

    return nextMinuteIn;
}

function fixangle(angle) {
    return angle - 360 * Math.floor(angle / 360);
}

function radians(degrees) {
    return degrees*(Math.PI/180);
}

function degrees(radians) {
    return radians*(180/Math.PI);
}

function kepler(m, eccent) {
    var epsilon = 1.0e-6            // Limiting value for Kepler equation
    e = m = radians(m);
    delta = 1;

    while(Math.abs(delta) > epsilon) {
        delta = e - eccent * Math.sin(e) - m;
        e = e - (delta / (1 - eccent * Math.cos(e)));
    }

    return e;
}

function moonphase(unixts) {
    // Astronomical constants.

    var unixepoch = 2440587.5       // Midnight 1 jan 1970
    var astroepoch = 2444238.5      // Midnight 1 jan 1980

    // Constants defining the Sun's apparent orbit.

    var s_elong = 278.833540        // ecliptic longitude of the Sun at epoch
    var s_elongp = 282.596403       // ecliptic longitude of the Sun at perigee
    var s_eccent = 0.016718         // eccentricity of Earth's orbit

    // Constants defining the Moon's orbit.

    var m_mlong = 64.975464         // moon's mean longitude at the epoch
    var m_mlongp = 349.383063       // mean longitude of the perigee at the epoch
    var m_longnode = 151.950429     // mean longitude of the node at the epoch
    var m_eccent = 0.054900         // eccentricity of the Moon's orbit
    var m_synodic = 29.53058868     // synodic month (new Moon to new Moon)

    // Calculation of the Sun's position.
    // ----------------------------------
    
    // Modified Julian Date within astroepoch
    var Day = (unixepoch + (unixts / 86400)) - astroepoch;
     
    // Mean anomaly of the Sun
    var N = fixangle((360.0 / 365.2422) * Day);
    
    // Convert from perigee coordinates to epoch
    var M = fixangle(N + s_elong - s_elongp);
    
    // Solve equation of Kepler
    var Ec = kepler(M, s_eccent);
    
    // True anomaly in degrees
    Ec = Math.sqrt((1 + s_eccent) / (1 - s_eccent)) * Math.tan(Ec / 2);
    Ec = 2 * degrees(Math.atan(Ec));
    
    // Sun's geocentric ecliptic longitude
    var lsun = fixangle(Ec + s_elongp);
    
    // Calculation of the Moon's position
    // ----------------------------------
    
    // Moon's mean longitude
    var ml = fixangle(13.1763966 * Day + m_mlong);
    
    // Moon's mean anomaly
    var MM = fixangle(ml - 0.1114041 * Day - m_mlongp);
    
    // Ascending node mean anomaly
    var MN = fixangle(m_longnode - 0.0529539 * Day);
    
    // Evection
    var Ev = 1.2739 * Math.sin(radians(2 * (ml - lsun) - MM));

    // Annual equation.
    var Ae = 0.1858 * Math.sin(radians(M));
    
    // Correction term.
    var A3 = 0.37 * Math.sin(radians(M));
    
    // Corrected anomaly.
    var MmP = MM + Ev - Ae - A3;
    
    // Correction for the equation of the centre.
    var mEc = 6.2886 * Math.sin(radians(MmP));
    
    // Another correction term.
    var A4 = 0.214 * Math.sin(radians(2 * MmP));
    
    // Corrected longitude.
    var lP = ml + Ev + mEc - Ae + A4;
    
    // Variation.
    var V = 0.6583 * Math.sin(radians(2 * (lP - lsun)));

    // True longitude.
    var lPP = lP + V;
    
    // Calculation of the phase of the Moon.
    // -------------------------------------
    
    // Age of the Moon in degrees.
    var agedegrees = lPP - lsun;
    
    // Fraction of moon phase
    // var phase = radians(fixangle(agedegrees));
    
    // Fraction of moon illuminated.
    // var illuminated = (1 - Math.cos(radians(agedegrees))) / 2;

    // Moon age in days
    var age = m_synodic * (fixangle(agedegrees) / 360.0);
    
    // Calculate Unix timestamp for next moonphase change
    if(parseInt(age) == 29)
        remainder = m_synodic % 1 - age % 1;
    else
        remainder = 1 - age % 1;
    
    var phasehours = parseInt(24 * remainder);
    var phasemins = parseInt(1440 * remainder) % 60;
    var phasesecs = parseInt(86400 * remainder) % 60;
    
    var changesecs = phasehours * 60 * 60 + phasemins * 60 + phasesecs;
    var next = unixts + changesecs;
    
    // Populate instance with calculated phase values
    //alert(phase);
    //alert(illuminated);
    //alert(age);
    //alert(next)

    JS_WPCLOCK_NextMoonphaseUnixTS = next;
    return age;
}

