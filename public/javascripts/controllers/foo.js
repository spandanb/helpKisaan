'use strict';
angular.module('fooControllers', ['pascalprecht.translate'])
.config(function ($translateProvider) {
  $translateProvider.translations('en', {
    NAV_HOME: 'Home',
    NAV_PROJECTS: 'Projects',
    NAV_ABOUT: 'About',
    NAV_REGISTER: 'Register',
    NAV_SIGNIN: 'Sign In',
    NAV_NEW_PROJ: 'New Project',
    NAV_LOG_OUT: "Log Out",

    PROJ_FUNDS_RAISED : "Funds Raised",
    PROJ_GOAL : "Goal",
    PROJ_PROGRESS : "Progress",
    PROJ_MSG_IN_PROGRESS : "Percentage Raised",
    PROJ_MSG_SUCCESS : "Project Complete",

    PROJ_NAME : "Name",
    PROJ_DESCRIPTION : "Description",
    PROJ_LOCATION : "Location",

    PROJ_DONATE : "Donate",
    PROJ_APPLY_CHANGES : "Apply Changes",
    PROJ_DELETE_PROJECT : "Delete Project",
    PROJ_ADMIN_PANEL : "Admin Panel",
    PROJ_INFO : "Info",

    USER_ACCT_NUMBER : "Account Number",
    USER_IFSC : "Indian Financial System Code",
    USER_FIRST_NAME: "First Name",
    USER_LAST_NAME: "Last Name",
    USER_LOCATION: "Location",
    USER_EMAIL: "Email",
  });
  $translateProvider.translations('hi', {
    NAV_HOME: 'घर', //Ghar
    NAV_PROJECTS: 'परियोजना', //Pariyogana
    NAV_ABOUT: 'बारे में', //Barey main
    NAV_REGISTER: 'नया खाता', //Naya Khata
    NAV_SIGNIN: 'साइन इन', //Sign in
    NAV_NEW_PROJ: 'नई परियोजना', //Nai pariyogna
    NAV_LOG_OUT: "लॉग आउट", //Log out
    
    PROJ_FUNDS_RAISED : "रकम जुटाई",//rakam jootai
    PROJ_GOAL : "लक्ष्य",//lakshay
    PROJ_PROGRESS : "प्रगति", //Poorgati
    PROJ_MSG_IN_PROGRESS : "प्रगति का प्रतिशत", //Pragati ka pratishak,
    PROJ_MSG_SUCCESS : "परियोजना पूरी", //Pariyojna Poori

    PROJ_NAME : "नाम",
    PROJ_DESCRIPTION : "विवरण",//vivaran
    PROJ_LOCATION : "स्थान", //sthan
    
    PROJ_DONATE : "हाथ बढ़ाना", //Hath Badana
    PROJ_APPLY_CHANGES : "परिवर्तन लागू करें",//Parivartan Lagu Karein
    PROJ_DELETE_PROJECT : "हटाएं", //Hataye
    PROJ_ADMIN_PANEL : "व्यवस्थापक पैनल", //Vyavasthāpaka painala
    PROJ_INFO : "जानकारी", //Jaankaari
  });
  $translateProvider.preferredLanguage('en');
})
